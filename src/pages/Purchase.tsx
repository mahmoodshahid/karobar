/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  PlusCircle, 
  Search, 
  Pill, 
  Trash2, 
  Download, 
  MinusCircle,
  Plus,
  ShoppingBag
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { translations } from '../i18n';
import { TransactionType, InvoiceItem } from '../types';
import { Modal } from '../components/Modal';
import { formatCurrency, formatDate, cn } from '../lib/utils';

export const Purchase = () => {
  const { language, transactions, persons, products, addTransaction, updateProduct } = useAppContext();
  const t = translations[language];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    personId: '',
    date: new Date().toISOString().split('T')[0],
    items: [] as InvoiceItem[],
    paidAmount: 0,
    notes: '',
  });

  const [newItem, setNewItem] = useState({
    productId: '',
    quantity: 1,
    price: 0,
  });

  const purchaseTransactions = transactions
    .filter(t => t.type === TransactionType.PURCHASE)
    .sort((a, b) => b.date - a.date);

  const filteredPurchases = purchaseTransactions.filter(t => 
    t.personName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.includes(searchTerm)
  );

  const addItemToInvoice = () => {
    if (!newItem.productId || newItem.quantity <= 0) return;
    const product = products.find(p => p.id === newItem.productId);
    if (!product) return;

    const item: InvoiceItem = {
      productId: product.id,
      name: product.name,
      quantity: newItem.quantity,
      price: newItem.price || product.costPrice,
      total: newItem.quantity * (newItem.price || product.costPrice),
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, item]
    }));
    setNewItem({ productId: '', quantity: 1, price: 0 });
  };

  const removeItemFromInvoice = (id: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.productId !== id)
    }));
  };

  const totalAmount = formData.items.reduce((acc, curr) => acc + curr.total, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.personId || formData.items.length === 0) return;

    const person = persons.find(p => p.id === formData.personId);
    
    addTransaction({
      type: TransactionType.PURCHASE,
      date: new Date(formData.date).getTime(),
      personId: formData.personId,
      personName: person?.name || 'Unknown',
      items: formData.items,
      totalAmount,
      paidAmount: formData.paidAmount,
      status: formData.paidAmount >= totalAmount ? 'paid' : (formData.paidAmount > 0 ? 'partial' : 'unpaid'),
      notes: formData.notes,
    });

    // Update product quantities (increase stock)
    formData.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        updateProduct({
          ...product,
          quantity: product.quantity + item.quantity,
          costPrice: item.price // Update cost price to latest purchase price
        });
      }
    });

    setIsModalOpen(false);
    setFormData({ personId: '', date: new Date().toISOString().split('T')[0], items: [], paidAmount: 0, notes: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.purchase}</h1>
          <p className="text-sm text-gray-500">{language === 'ur' ? 'حالیہ پرچیز ٹرانزیکشنز' : 'Recent purchase transactions'}</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 text-xs font-black uppercase tracking-widest active:scale-95"
        >
          <PlusCircle size={18} />
          <span>{t.addPurchase}</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder={t.search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredPurchases.map((purchase) => (
          <div key={purchase.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-lg italic font-black shadow-inner">
                <ShoppingBag size={22} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 uppercase tracking-tight">{purchase.personName}</h3>
                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  <span className="font-mono tracking-tighter text-slate-300">#{purchase.id.substring(0, 8)}</span>
                  <span>•</span>
                  <span>{formatDate(purchase.date, language)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-8">
              <div className="text-start md:text-end">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{t.amount}</p>
                <p className="text-lg font-black text-slate-900 tracking-tighter">{formatCurrency(purchase.totalAmount, language)}</p>
              </div>
              
              <div className="text-start md:text-end">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{t.status}</p>
                <span className={cn(
                  "inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mt-1 shadow-sm border",
                  purchase.status === 'paid' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : (purchase.status === 'partial' ? "bg-orange-50 text-orange-700 border-orange-100" : "bg-rose-50 text-rose-700 border-rose-100")
                )}>
                  {purchase.status}
                </span>
              </div>

              <div className="flex gap-2">
                <button className="p-2 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all active:scale-90">
                  <Download size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredPurchases.length === 0 && (
          <div className="bg-white p-16 text-center text-slate-300 uppercase text-[10px] font-black tracking-widest rounded-xl border border-dashed border-slate-200">
            {t.noRecords}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t.addPurchase}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.supplier}</label>
                <select
                  required
                  value={formData.personId}
                  onChange={(e) => setFormData(prev => ({ ...prev, personId: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="">{language === 'ur' ? 'سپلائر منتخب کریں' : 'Select Supplier'}</option>
                  {persons.filter(p => p.type === 'supplier').map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.phone})</option>
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
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl space-y-3 border border-slate-200 italic">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.items}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <select
                  value={newItem.productId}
                  onChange={(e) => {
                    const prod = products.find(p => p.id === e.target.value);
                    setNewItem(prev => ({ 
                      ...prev, 
                      productId: e.target.value,
                      price: prod ? prod.costPrice : 0
                    }));
                  }}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white font-bold outline-none focus:ring-1 focus:ring-orange-500"
                >
                  <option value="">{language === 'ur' ? 'آئٹم منتخب کریں' : 'Select Item'}</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({t.stock}: {p.quantity})</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Qty"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                    className="w-20 px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold"
                  />
                  <input
                    type="number"
                    placeholder="Cost"
                    value={newItem.price}
                    onChange={(e) => setNewItem(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold"
                  />
                  <button
                    type="button"
                    onClick={addItemToInvoice}
                    className="p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-sm active:scale-95"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                {formData.items.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200 text-sm">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.quantity} x {item.price}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold">{item.total}</span>
                      <button 
                        type="button"
                        onClick={() => removeItemFromInvoice(item.productId)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <MinusCircle size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">{t.total}</label>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount, language)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'ur' ? 'ادا شدہ رقم' : 'Paid Amount'}</label>
                <input
                  type="number"
                  value={formData.paidAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, paidAmount: Number(e.target.value) }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={formData.items.length === 0 || !formData.personId}
              className="flex-1 px-4 py-3.5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t.save}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
