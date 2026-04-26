/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Package, Search, Plus, Edit2, Trash2, Tag, Archive } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { translations } from '../i18n';
import { Product } from '../types';
import { Modal } from '../components/Modal';
import { formatCurrency, cn } from '../lib/utils';

export const Items = () => {
  const { language, products, addProduct, updateProduct, deleteProduct } = useAppContext();
  const t = translations[language];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    costPrice: 0,
    quantity: 0,
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct({ ...editingProduct, ...formData });
    } else {
      addProduct(formData);
    }
    closeModal();
  };

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        costPrice: product.costPrice,
        quantity: product.quantity,
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', price: 0, costPrice: 0, quantity: 0 });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
            {t.items}
          </h1>
          <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase mt-1">
            {language === 'ur' ? 'انوینٹری منیجمنٹ' : 'Product Inventory Management'}
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 text-xs font-black uppercase tracking-widest active:scale-95"
        >
          <Plus size={18} />
          <span>{t.addItem}</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder={t.search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-sm font-bold placeholder:text-slate-300 shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 text-emerald-600 rounded-lg flex items-center justify-center italic shadow-inner border border-slate-100">
                    <Package size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{product.name}</h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                      <Tag size={12} className="text-emerald-500" />
                      <span>{t.salePrice}: {formatCurrency(product.price, language)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openModal(product)}
                    className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="block text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">{t.stock}</span>
                  <div className="flex items-center gap-2">
                    <Archive size={14} className="text-slate-400" />
                    <span className={cn(
                      "text-sm font-black italic",
                      product.quantity < 5 ? "text-red-500" : "text-slate-700"
                    )}>
                      {product.quantity}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="block text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">{t.costPrice}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black italic text-slate-700">
                      {formatCurrency(product.costPrice, language)}
                    </span>
                  </div>
                </div>
              </div>

              {product.quantity < 5 && (
                <div className="absolute top-0 right-0">
                  <div className="bg-red-500 text-white text-[8px] font-black uppercase tracking-widest px-8 py-1 rotate-45 translate-x-[24px] translate-y-[8px] shadow-sm">
                    Low Stock
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200">
            <Package size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{t.noRecords}</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingProduct ? (language === 'ur' ? 'آئٹم ایڈٹ کریں' : 'Edit Item') : t.addItem}
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t.name}</label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-bold text-slate-700"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t.costPrice}</label>
              <input
                required
                type="number"
                value={formData.costPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, costPrice: Number(e.target.value) }))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-bold text-slate-700"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t.salePrice}</label>
              <input
                required
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-bold text-slate-700"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t.quantity}</label>
            <input
              required
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-bold text-slate-700"
            />
          </div>
          
          <div className="flex gap-3 pt-8">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 px-4 py-3.5 border border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3.5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
            >
              {t.save}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
