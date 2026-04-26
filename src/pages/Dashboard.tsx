/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart, 
  Wallet,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { translations } from '../i18n';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const StatCard = ({ title, value, icon: Icon, trend, color, urLabel }: any) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-2 rounded-lg text-xl font-bold flex items-center justify-center italic shadow-inner", color)}>
        <Icon size={20} />
      </div>
      <span className="text-[10px] text-slate-400 font-urdu uppercase tracking-widest font-black">{urLabel}</span>
    </div>
    <h3 className="text-xs uppercase text-slate-400 font-bold tracking-widest mb-1">{title}</h3>
    <div className="flex items-baseline justify-between gap-2">
      <p className={cn("text-2xl font-black tracking-tight", title === 'Net Profit' ? 'text-emerald-600' : 'text-slate-900')}>
        {value}
      </p>
      {trend && (
        <div className={cn(
          "text-[10px] font-black uppercase tracking-tighter", 
          trend.isPositive ? 'text-emerald-600' : 'text-rose-500'
        )}>
          {trend.isPositive ? '↑' : '↓'} {trend.value}%
        </div>
      )}
    </div>
  </div>
);

export const Dashboard = () => {
  const { language, transactions, expenses, persons } = useAppContext();
  const t = translations[language];

  const totalSales = transactions
    .filter(t => t.type === 'sale')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const totalPurchases = transactions
    .filter(t => t.type === 'purchase')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const netProfit = totalSales - totalPurchases - totalExpenses;

  const chartData = [
    { name: 'Jan', sales: 4000, expenses: 2400 },
    { name: 'Feb', sales: 3000, expenses: 1398 },
    { name: 'Mar', sales: 5000, expenses: 2100 },
    { name: 'Apr', sales: 4780, expenses: 1908 },
    { name: 'May', sales: 5890, expenses: 3200 },
    { name: 'Jun', sales: 6390, expenses: 2800 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">{t.dashboard}</h2>
          <p className="text-xs text-slate-400 font-bold tracking-widest mt-1 uppercase italic">Operational Metrics & Analytics</p>
        </div>
        <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center space-x-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95">
          <span>+ {t.addSale}</span>
          <span className="border-l border-emerald-500 pl-2 ml-2 font-urdu normal-case">سیل</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={t.totalSales} 
          urLabel="کل فروخت"
          value={formatCurrency(totalSales, language)} 
          icon={ShoppingCart} 
          color="bg-emerald-50 text-emerald-600"
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard 
          title={t.totalPurchases} 
          urLabel="کل خریداری"
          value={formatCurrency(totalPurchases, language)} 
          icon={TrendingUp} 
          color="bg-blue-50 text-blue-600"
          trend={{ value: 8, isPositive: false }}
        />
        <StatCard 
          title={t.totalExpenses} 
          urLabel="کل اخراجات"
          value={formatCurrency(totalExpenses, language)} 
          icon={TrendingDown} 
          color="bg-rose-50 text-rose-600"
          trend={{ value: 4, isPositive: true }}
        />
        <StatCard 
          title={t.netProfit} 
          urLabel="خالص منافع"
          value={formatCurrency(netProfit, language)} 
          icon={Wallet} 
          color="bg-amber-50 text-amber-600"
          trend={{ value: 15, isPositive: netProfit >= 0 }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Recent Sales Table Panel */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h4 className="font-black text-slate-800 uppercase text-[10px] tracking-[0.2em]">{t.sales} <span className="text-slate-400 font-normal ml-2">/ حالیہ سیلز</span></h4>
            <button className="text-[10px] font-black uppercase text-emerald-600 hover:text-emerald-700 tracking-widest">{language === 'ur' ? 'تمام ریکارڈز دیکھیں' : 'View All'}</button>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="p-4 text-[10px] uppercase text-slate-400 font-black tracking-widest">Date</th>
                  <th className="p-4 text-[10px] uppercase text-slate-400 font-black tracking-widest">Customer / کسٹمر</th>
                  <th className="p-4 text-[10px] uppercase text-slate-400 font-black tracking-widest">Status</th>
                  <th className="p-4 text-[10px] uppercase text-slate-400 font-black tracking-widest text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.filter(tr => tr.type === 'sale').slice(0, 5).map((tr) => (
                  <tr key={tr.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-xs font-mono text-slate-500 tracking-tighter">{formatDate(tr.date, 'en')}</td>
                    <td className="p-4">
                      <div className="text-sm font-bold text-slate-800">{tr.personName}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Verified Client</div>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                        tr.status === 'paid' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      )}>
                        {tr.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-black text-slate-900 text-right">{formatCurrency(tr.totalAmount, language)}</td>
                  </tr>
                ))}
                {transactions.filter(tr => tr.type === 'sale').length === 0 && (
                   <tr className="flex items-center justify-center p-12 text-slate-400 uppercase text-[10px] font-bold tracking-[0.2em] w-full absolute">
                      <td colSpan={4}>No Recent Transactions</td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Balance Panel */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h4 className="font-black text-slate-800 uppercase text-[10px] tracking-[0.2em]">Balances / بقایا جات</h4>
          </div>
          <div className="p-6 space-y-5 overflow-y-auto min-h-[300px]">
            {persons.slice(0, 4).map(p => (
              <div key={p.id} className="flex items-center justify-between group">
                <div>
                  <p className="text-xs font-black text-slate-800 uppercase tracking-tight group-hover:text-emerald-600 transition-colors">{p.name}</p>
                  <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">{p.type}</p>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "text-xs font-black tracking-tighter", 
                    p.balance > 0 ? "text-rose-600" : "text-emerald-600"
                  )}>
                    {p.balance > 0 ? '-' : '+'} {formatCurrency(Math.abs(p.balance), language)}
                  </p>
                  <p className="text-[9px] text-slate-400 uppercase font-bold">{p.balance > 0 ? 'Payable' : 'Receivable'}</p>
                </div>
              </div>
            ))}
            <div className="h-[1px] bg-slate-50 my-2"></div>
          </div>
          <div className="mt-auto p-4 bg-slate-50/30 border-t border-slate-100">
             <button className="w-full py-2.5 border-2 border-dashed border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all active:scale-[0.98]">
               Manage Directory
             </button>
          </div>
        </div>
      </div>
      
      {/* Chart Section Panel */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-xs font-black uppercase text-slate-500 tracking-[0.2em]">Financial Performance Curve</h3>
           <div className="flex gap-2">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Revenue</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-200"></div><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Outflow</span></div>
           </div>
        </div>
        <div className="h-64">
           <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={chartData}>
               <defs>
                 <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                   <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                 </linearGradient>
               </defs>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
               <XAxis 
                 dataKey="name" 
                 axisLine={false} 
                 tickLine={false} 
                 tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }}
               />
               <YAxis 
                 axisLine={false} 
                 tickLine={false} 
                 tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }}
                 tickFormatter={(val) => `₨${val}`}
               />
               <Tooltip 
                 contentStyle={{ 
                   borderRadius: '8px', 
                   border: '1px solid #e2e8f0', 
                   boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                   fontSize: '10px',
                   fontWeight: '800'
                 }} 
               />
               <Area 
                 type="monotone" 
                 dataKey="sales" 
                 stroke="#10b981" 
                 strokeWidth={2}
                 fillOpacity={1} 
                 fill="url(#colorSales)" 
               />
             </AreaChart>
           </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
