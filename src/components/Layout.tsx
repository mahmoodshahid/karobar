/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Printer, Settings } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAppContext } from '../context/AppContext';

export const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { language } = useAppContext();

  useEffect(() => {
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800 antialiased">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="mx-auto max-w-7xl pb-10">
            <Outlet />
          </div>
        </main>
        
        {/* Quick Action Footer */}
        <footer className="bg-white border-t border-slate-200 px-8 py-3 flex justify-between items-center text-slate-500 shrink-0">
          <div className="flex space-x-6 text-[10px] font-bold uppercase tracking-widest">
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span> Server Sync Active</span>
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span> System Ready</span>
          </div>
          <div className="flex space-x-3 text-slate-400">
            <button className="p-1.5 hover:bg-slate-100 hover:text-slate-600 rounded transition-colors" title="Print Report">
              <Printer size={16} />
            </button>
            <button className="p-1.5 hover:bg-slate-100 hover:text-slate-600 rounded transition-colors" title="Settings">
              <Settings size={16} />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
