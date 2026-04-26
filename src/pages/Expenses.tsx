/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Search, Calendar, Tag, Trash2, Receipt } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { translations } from '../i18n';
import { ExpenseCategory, Expense } from '../types';
import { Modal } from '../components/Modal';
import { formatCurrency, formatDate, cn } from '../lib/utils';

export const Expenses = () => {
  const { language, expenses, addExpense, deleteExpense } = useAppContext();
  const t = translations[language];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    category: ExpenseCategory.OTHER,
    amount: 0,
    notes: '',
    date: new Date().toISOString().split('T')[0],
  });

  const filteredExpenses = expenses.filter(e => 
    e.notes.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.category.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => b.date - a.date);

  const totalExpenses = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({
      ...formData,
      date: new Date(formData.date).getTime(),
    });
    setIsModalOpen(false);
    setFormData({ 
      category: ExpenseCategory.OTHER, 
      amount: 0, 
      notes: '', 
      date: new Date().toISOString().split('T')[0] 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.expenses}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-500">{language === 'ur' ? 'کل اخراجات' : 'Total Expenses'}:</span>
            <span className="text-lg font-bold text-red-600">{formatCurrency(totalExpenses, language)}</span>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-rose-600 text-white px-5 py-2.5 rounded-xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20 text-xs font-black uppercase tracking-widest active:scale-95"
        >
          <Plus size={18} />
          <span>{t.addExpense}</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder={t.search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-sm"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-start">{t.date}</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-start">{t.category}</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-start">{t.notes}</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-end">{t.amount}</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-end">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-500 tracking-tighter">
                      <Calendar size={12} className="text-slate-300" />
                      {formatDate(expense.date, language)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 border border-slate-200">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-slate-800 max-w-xs truncate">{expense.notes || '-'}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-end">
                    <span className="font-black text-rose-600 text-sm tracking-tighter">{formatCurrency(expense.amount, language)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-end">
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-slate-300 uppercase text-[10px] font-black tracking-widest">
                    {t.noRecords}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t.addExpense}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.category}</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as ExpenseCategory }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white"
              >
                {Object.values(ExpenseCategory).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.date}</label>
              <input
                required
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.amount}</label>
            <input
              required
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.notes}</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none h-24"
            />
          </div>
          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors shadow-sm shadow-red-200"
            >
              {t.save}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
