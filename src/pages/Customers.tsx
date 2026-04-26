/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserPlus, Search, Phone, MapPin, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { translations } from '../i18n';
import { EntityType, Person } from '../types';
import { Modal } from '../components/Modal';
import { formatCurrency, cn } from '../lib/utils';

export const Customers = () => {
  const { language, persons, addPerson, updatePerson, deletePerson } = useAppContext();
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<EntityType>(EntityType.CUSTOMER);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    balance: 0,
  });

  const filteredPersons = persons.filter(p => 
    p.type === activeTab && 
    (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     p.phone.includes(searchTerm))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPerson) {
      updatePerson({ ...editingPerson, ...formData });
    } else {
      addPerson({ ...formData, type: activeTab });
    }
    closeModal();
  };

  const openModal = (person?: Person) => {
    if (person) {
      setEditingPerson(person);
      setFormData({
        name: person.name,
        phone: person.phone,
        address: person.address,
        balance: person.balance,
      });
    } else {
      setEditingPerson(null);
      setFormData({ name: '', phone: '', address: '', balance: 0 });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPerson(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {activeTab === EntityType.CUSTOMER ? t.customers : t.suppliers}
          </h1>
          <p className="text-sm text-gray-500">
            {language === 'ur' ? 'کل ریکارڈز' : 'Total records'}: {filteredPersons.length}
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 text-xs font-black uppercase tracking-widest active:scale-95"
        >
          <UserPlus size={18} />
          <span>{activeTab === EntityType.CUSTOMER ? t.addCustomer : t.addSupplier}</span>
        </button>
      </div>

      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 max-w-xs">
        <button
          onClick={() => setActiveTab(EntityType.CUSTOMER)}
          className={cn(
            "flex-1 py-1.5 px-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
            activeTab === EntityType.CUSTOMER ? "bg-white text-emerald-600 shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600"
          )}
        >
          {t.customers}
        </button>
        <button
          onClick={() => setActiveTab(EntityType.SUPPLIER)}
          className={cn(
            "flex-1 py-1.5 px-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
            activeTab === EntityType.SUPPLIER ? "bg-white text-emerald-600 shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600"
          )}
        >
          {t.suppliers}
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
        {filteredPersons.map((person) => (
          <div key={person.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center font-black text-xl italic shadow-inner">
                  {person.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{person.name}</h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                    <Phone size={12} className="text-emerald-500" />
                    <span>{person.phone}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openModal(person)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => deletePerson(person.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="space-y-3 pt-3 border-t border-gray-50">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={16} className="text-gray-400 shrink-0" />
                <span className="truncate">{person.address || (language === 'ur' ? 'پتہ نہیں ہے' : 'No address')}</span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{t.balance}</span>
                <span className={cn(
                  "font-bold",
                  person.balance > 0 ? "text-red-600" : "text-green-600"
                )}>
                  {formatCurrency(person.balance, language)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingPerson ? t.edit : (activeTab === EntityType.CUSTOMER ? t.addCustomer : t.addSupplier)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.name}</label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.phone}</label>
            <input
              required
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.address}</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none h-24"
            />
          </div>
          {!editingPerson && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.balance}</label>
              <input
                type="number"
                value={formData.balance}
                onChange={(e) => setFormData(prev => ({ ...prev, balance: Number(e.target.value) }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          )}
          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
            >
              {t.save}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
