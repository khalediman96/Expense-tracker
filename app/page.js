// app/page.jsx
'use client';
import { useState, useEffect } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseChart from './components/ExpenseChart';
import { exportToExcel, exportToPDF } from './utils/export';

export default function ExpenseTracker() {
  // State Management
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sortBy, setSortBy] = useState({ field: 'date', order: 'desc' });

  // Constants
  const categories = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Other'];

  // Effects
  useEffect(() => {
    fetchExpenses();
  }, []);

  // Message Handler
  const showMessage = (successMsg = '', errorMsg = '') => {
    setSuccess(successMsg);
    setError(errorMsg);
    setTimeout(() => {
      setSuccess('');
      setError('');
    }, 3000);
  };

  // Data Fetching
  const fetchExpenses = async () => {
    try {
      const response = await fetch('/api/expenses');
      const data = await response.json();
      
      if (data.expenses && Array.isArray(data.expenses)) {
        setExpenses(data.expenses);
      } else {
        showMessage('', 'Invalid data format received from server');
      }
    } catch (error) {
      showMessage('', 'Error fetching expenses');
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations
  const handleAddExpense = async (formData) => {
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchExpenses();
        showMessage('Expense added successfully');
      } else {
        const data = await response.json();
        showMessage('', data.error || 'Error adding expense');
      }
    } catch (error) {
      showMessage('', 'Error adding expense');
    }
  };

  const handleUpdateExpense = async (formData) => {
    try {
      const response = await fetch(`/api/expenses/${editingExpense._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchExpenses();
        setEditingExpense(null);
        showMessage('Expense updated successfully');
      } else {
        const data = await response.json();
        showMessage('', data.error || 'Error updating expense');
      }
    } catch (error) {
      showMessage('', 'Error updating expense');
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;

    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchExpenses();
        showMessage('Expense deleted successfully');
      } else {
        const data = await response.json();
        showMessage('', data.error || 'Error deleting expense');
      }
    } catch (error) {
      showMessage('', 'Error deleting expense');
    }
  };

  // Filter and Sort Logic
  const filteredExpenses = expenses
    .filter(expense => {
      const matchesCategory = !filterCategory || expense.category === filterCategory;
      const matchesDateRange = (!dateRange.start || new Date(expense.date) >= new Date(dateRange.start)) &&
                              (!dateRange.end || new Date(expense.date) <= new Date(dateRange.end));
      return matchesCategory && matchesDateRange;
    })
    .sort((a, b) => {
      const order = sortBy.order === 'asc' ? 1 : -1;
      if (sortBy.field === 'amount') {
        return (a.amount - b.amount) * order;
      }
      return (new Date(a.date) - new Date(b.date)) * order;
    });

  return (
    <div className="max-w-6xl  mx-auto p-4">
      <div className='w-full bg-cyan-900 rounded-lg p-4 shadow-md mb-4'>
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-300">Expense Tracker</h1>
        <p className='text-lg text-gray-300 font-medium mb-4 text-center'>By Khaled Iman</p>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Add/Edit Expense Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-cyan-900">
          {editingExpense ? 'Edit Expense' : 'Add New Expense'}
        </h2>
        <ExpenseForm
          onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
          initialData={editingExpense}
          onCancel={editingExpense ? () => setEditingExpense(null) : null}
        />
      </div>

      {/* Filters and Export */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <div className="flex flex-col">
            <label className="text-sm text-gray-600">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="p-2 border rounded"
            />
          </div>
          
          <div className="flex flex-col">
            <label className="text-sm text-gray-600">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="p-2 border rounded"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => exportToExcel(filteredExpenses)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Export to Excel
          </button>
          <button
            onClick={() => exportToPDF(filteredExpenses)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Export to PDF
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <ExpenseChart expenses={filteredExpenses} />
      </div>

      {/* Expenses Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Expenses</h2>
          <select
            value={`${sortBy.field}-${sortBy.order}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy({ field, order });
            }}
            className="p-2 border rounded"
          >
            <option value="date-desc">Date (Newest)</option>
            <option value="date-asc">Date (Oldest)</option>
            <option value="amount-desc">Amount (High to Low)</option>
            <option value="amount-asc">Amount (Low to High)</option>
          </select>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading expenses...</p>
        ) : filteredExpenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Title</th>
                  <th className="p-2 text-left">Amount</th>
                  <th className="p-2 text-left">Category</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr key={expense._id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{expense.title}</td>
                    <td className="p-2">${expense.amount.toFixed(2)}</td>
                    <td className="p-2">{expense.category}</td>
                    <td className="p-2">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => setEditingExpense(expense)}
                        className="text-blue-500 hover:text-blue-700 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(expense._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center">No expenses found</p>
        )}
      </div>
    </div>
  );
}