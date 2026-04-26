/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Pill, 
  Users, 
  TrendingDown, 
  BarChart3, 
  Settings,
  Package,
  Menu,
  X,
  Languages
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { translations } from '../i18n';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { language, setLanguage } = useAppContext();
  const t = translations[language];

  const menuItems = [
    { icon: LayoutDashboard, label: t.dashboard, urKey: 'ڈیش بورڈ', path: '/' },
    { icon: Package, label: t.items, urKey: 'آئٹمز', path: '/items' },
    { icon: ShoppingCart, label: t.sales, urKey: 'سیل', path: '/sales' },
    { icon: Pill, label: t.purchase, urKey: 'پرچیز', path: '/purchase' },
    { icon: Users, label: t.customers, urKey: 'کسٹمرز', path: '/customers' },
    { icon: TrendingDown, label: t.expenses, urKey: 'اخراجات', path: '/expenses' },
    { icon: BarChart3, label: t.reports, urKey: 'رپورٹس', path: '/reports' },
    { icon: Settings, label: t.settings, urKey: 'سیٹنگز', path: '/settings' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={cn(
          "fixed top-0 bottom-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 transition-transform duration-300 lg:translate-x-0 lg:static border-slate-700",
          language === 'ur' ? (isOpen ? 'translate-x-0' : 'translate-x-full') : (isOpen ? 'translate-x-0' : '-translate-x-full'),
          language === 'ur' ? 'right-0 border-l' : 'left-0 border-r shadow-2xl lg:shadow-none'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-xl text-white italic">ک</div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white leading-tight">{t.appName}</span>
                <span className="text-[10px] text-emerald-400 font-normal uppercase tracking-widest">Karobar</span>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={({ isActive }) => cn(
                  "flex items-center justify-between p-3 rounded-lg transition-all duration-200 group",
                  isActive 
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20" 
                    : "hover:bg-slate-800 hover:text-white"
                )}
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <item.icon size={18} className={cn(isActive ? "text-white" : "text-slate-400 group-hover:text-emerald-400")} />
                      <span className="font-medium uppercase tracking-wide text-xs">{item.label}</span>
                    </div>
                    <span className="text-[10px] font-urdu opacity-60">{item.urKey}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-700 mt-auto">
            <button
              onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-600"
            >
              <Languages size={16} className="text-emerald-400" />
              <span>{language === 'en' ? 'اردو' : 'English'}</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};
