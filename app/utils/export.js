// app/utils/export.js
import { utils, write } from 'xlsx';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToExcel = (expenses) => {
  const worksheet = utils.json_to_sheet(expenses);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'Expenses');
  const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });
  
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'expenses.xlsx';
  link.click();
  URL.revokeObjectURL(url);
};

export const exportToCSV = (expenses) => {
  // Convert expenses to CSV format
  const headers = ['Title', 'Amount', 'Category', 'Date'];
  const csvData = expenses.map(expense => [
    expense.title,
    expense.amount,
    expense.category,
    new Date(expense.date).toLocaleDateString()
  ]);

  // Add headers to the beginning
  csvData.unshift(headers);

  // Convert to CSV string
  const csvString = csvData
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  // Create and trigger download
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'expenses.csv';
  link.click();
  URL.revokeObjectURL(url);
};

export const exportToPDF = (expenses) => {
  const doc = new jsPDF();
  doc.autoTable({
    head: [['Title', 'Amount', 'Category', 'Date']],
    body: expenses.map(expense => [
      expense.title,
      expense.amount,
      expense.category,
      new Date(expense.date).toLocaleDateString()
    ])
  });
  doc.save('expenses.pdf');
};

