/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Menu, User, Bell } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { translations } from '../i18n';
import { cn } from '../lib/utils';

export const Header = ({ onOpenSidebar }: { onOpenSidebar: () => void }) => {
  const { language } = useAppContext();
  const t = translations[language];

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8 shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSidebar}
          className="p-2 text-slate-500 hover:bg-slate-100 rounded-md lg:hidden"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-baseline gap-2">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Business Overview</h1>
          <span className="text-slate-400 font-normal text-sm border-l border-slate-200 pl-2 ml-1">
            {language === 'ur' ? 'اکتوبر 2023 - ڈیش بورڈ' : 'October 2023 - Dashboard'}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-4 lg:space-x-6">
        <div className="hidden sm:flex bg-slate-100 rounded-lg p-1">
          <button 
            disabled={language === 'en'}
            className={cn(
              "px-4 py-1 text-xs font-bold rounded shadow-sm transition-all",
              language === 'en' ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            English
          </button>
          <button 
            disabled={language === 'ur'}
            className={cn(
              "px-4 py-1 text-xs font-bold rounded transition-all",
              language === 'ur' ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            اردو
          </button>
        </div>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
              <User size={18} />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="hidden lg:block leading-tight">
            <p className="text-sm font-bold text-slate-800 tracking-tight">Admin User</p>
            <p className="text-[10px] text-slate-400 uppercase font-black">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};
