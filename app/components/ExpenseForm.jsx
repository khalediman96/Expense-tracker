// app/components/ExpenseForm.jsx
"use client";
import { useState } from 'react';
const ExpenseForm = ({ onSubmit, initialData = null, onCancel = null }) => {
    const [formData, setFormData] = useState({
      title: initialData?.title || '',
      amount: initialData?.amount || '',
      category: initialData?.category || '',
    });
    const [loading, setLoading] = useState(false);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      await onSubmit(formData);
      setLoading(false);
    };
  
    const categories = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Other'];
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Expense Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-2 border rounded focus:outline-cyan-800"
            required
          />
        </div>
        <div>
          <input
            type="number"
            placeholder="Amount"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full p-2 border rounded focus:outline-cyan-800"
            required
          />
        </div>
        <div>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full p-2 border rounded focus:outline-cyan-800"
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option className='hover:bg-cyan-800' key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-cyan-800 text-white p-4 rounded hover:bg-cyan-900 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Saving...' : initialData ? 'Update Expense' : 'Add Expense'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    );
  };
  
  export default ExpenseForm;