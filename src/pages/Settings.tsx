/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Languages, Database, CloudOff, ShieldCheck, Github, Smartphone } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { translations } from '../i18n';
import { cn } from '../lib/utils';

export const Settings = () => {
  const { language, setLanguage } = useAppContext();
  const t = translations[language];

  const sections = [
    {
      title: t.language,
      icon: Languages,
      description: language === 'ur' ? 'ایپ کی زبان تبدیل کریں' : 'Change the application language',
      content: (
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => setLanguage('en')}
            className={cn(
              "flex-1 px-4 py-3 rounded-xl border text-[10px] font-black uppercase tracking-[0.2em] transition-all",
              language === 'en' ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20" : "bg-white text-slate-400 border-slate-200 hover:border-emerald-400 hover:text-emerald-600"
            )}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('ur')}
            className={cn(
              "flex-1 px-4 py-3 rounded-xl border font-urdu font-black transition-all",
              language === 'ur' ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20" : "bg-white text-slate-400 border-slate-200 hover:border-emerald-400 hover:text-emerald-600"
            )}
          >
            اردو
          </button>
        </div>
      )
    },
    {
      title: language === 'ur' ? 'ڈیٹا اسٹوریج' : 'Data Architecture',
      icon: Database,
      description: language === 'ur' ? 'آپ کا ڈیٹا محفوظ ہے' : 'How your information is structured',
      content: (
        <div className="mt-6 p-5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-4">
          <div className="p-2.5 bg-white rounded-lg shadow-sm text-emerald-500 border border-slate-100">
            <CloudOff size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-800">{language === 'ur' ? 'آف لائن موڈ' : 'Local Host Integrity'}</p>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed font-bold uppercase tracking-tighter opacity-80">
              {language === 'ur' 
                ? 'فی حال آپ کا ڈیٹا آپ کے براؤزر میں محفوظ کیا جا رہا ہے۔ کلاؤڈ سنک جلد دستیاب ہوگا۔' 
                : 'Data persistence is restricted to browser memory. Cloud parity is in development.'}
            </p>
          </div>
        </div>
      )
    },
    {
      title: language === 'ur' ? 'ایپ کے بارے میں' : 'System Information',
      icon: ShieldCheck,
      description: 'KAROBAR CORE v1.0.0',
      content: (
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
            <div className="flex items-center gap-3">
              <Smartphone size={16} className="text-slate-400" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{language === 'ur' ? 'ورژن' : 'Build Version'}</span>
            </div>
            <span className="text-[10px] font-black text-emerald-600 tracking-widest bg-emerald-50 px-2 py-1 rounded">V1.0.0</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
            <div className="flex items-center gap-3">
              <Github size={16} className="text-slate-400" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{language === 'ur' ? 'ڈویلپر' : 'Core Developer'}</span>
            </div>
            <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">MAHMOOD</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center lg:text-start">
        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">{t.settings}</h1>
        <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase mt-1">{language === 'ur' ? 'اپنی ترجیحات سیٹ کریں' : 'Configure Application Environment'}</p>
      </div>

      <div className="space-y-6">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-white p-6 lg:p-10 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-5 mb-2">
              <div className="p-3 bg-slate-50 text-emerald-600 rounded-xl shadow-inner italic border border-slate-100">
                <section.icon size={22} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">{section.title}</h3>
                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-1">{section.description}</p>
              </div>
            </div>
            {section.content}
          </div>
        ))}
      </div>
      
      <div className="text-center pt-10 border-t border-slate-200">
        <p className="text-[9px] text-slate-300 font-black tracking-[0.3em] uppercase">
          {language === 'ur' ? 'پاکستان میں محبت کے ساتھ بنایا گیا' : 'Precision Engineered in Pakistan'}
        </p>
      </div>
    </div>
  );
};
