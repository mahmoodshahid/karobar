/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BarChart3, FileText, Download, Calendar, ArrowUpRight, ArrowDownRight, Printer } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { translations } from '../i18n';
import { formatCurrency, formatDate, cn } from '../lib/utils';

export const Reports = () => {
  const { language, transactions, expenses } = useAppContext();
  const t = translations[language];

  const [dateFilter, setDateFilter] = useState('monthly');

  const totalSales = transactions
    .filter(t => t.type === 'sale')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const totalPurchases = transactions
    .filter(t => t.type === 'purchase')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const netProfit = totalSales - totalPurchases - totalExpenses;

  const reportItems = [
    { label: t.totalSales, value: totalSales, color: 'text-blue-600', icon: ArrowUpRight },
    { label: t.totalPurchases, value: totalPurchases, color: 'text-orange-600', icon: ArrowDownRight },
    { label: t.totalExpenses, value: totalExpenses, color: 'text-red-600', icon: ArrowDownRight },
    { label: t.netProfit, value: netProfit, color: netProfit >= 0 ? 'text-green-600' : 'text-red-600', icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">{t.reports}</h1>
          <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">{language === 'ur' ? 'کاروباری رپورٹس اور خلاصہ' : 'Business analytical summaries'}</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm active:scale-95">
            <Printer size={16} className="text-slate-400" />
            <span>{t.print}</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95">
            <Download size={16} />
            <span>{t.downloadPDF}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportItems.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</span>
              <div className={cn("p-1.5 rounded-lg italic", item.color === 'text-blue-600' ? 'bg-blue-50' : (item.color === 'text-orange-600' ? 'bg-orange-50' : (item.color === 'text-red-600' ? 'bg-rose-50' : 'bg-emerald-50')))}>
                <item.icon size={14} className={item.color} />
              </div>
            </div>
            <p className={cn("text-xl font-black tracking-tighter", item.color)}>{formatCurrency(item.value, language)}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">{language === 'ur' ? 'حالیہ تفصیلات' : 'Registry Audit Log'}</h3>
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            {['daily', 'weekly', 'monthly'].map((filter) => (
              <button
                key={filter}
                onClick={() => setDateFilter(filter)}
                className={cn(
                  "px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded transition-all",
                  dateFilter === filter ? "bg-white text-emerald-600 shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {filter === 'daily' ? t.daily : (filter === 'weekly' ? t.weekly : t.monthly)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-start">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-start">{t.date}</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-start">{language === 'ur' ? 'تفصیل' : 'Description'}</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-start">{t.category}</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-end">{t.amount}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.slice(0, 10).map((tr) => (
                <tr key={tr.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-slate-500 tracking-tighter">{formatDate(tr.date, language)}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">{tr.personName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest",
                      tr.type === 'sale' ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                    )}>
                      {tr.type === 'sale' ? t.sales : t.purchase}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-end font-black text-slate-900 tracking-tight">
                    {formatCurrency(tr.totalAmount, language)}
                  </td>
                </tr>
              ))}
              {expenses.slice(0, 10).map((ex) => (
                <tr key={ex.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-slate-500 tracking-tighter">{formatDate(ex.date, language)}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">{ex.notes || t.expenses}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest bg-rose-100 text-rose-700">
                      {t.expenses}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-end font-black text-rose-600 tracking-tight">
                    -{formatCurrency(ex.amount, language)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
