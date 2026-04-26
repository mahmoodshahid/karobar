/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, Language, Person, Transaction, Expense, Product } from '../types';

interface AppContextType extends AppState {
  setLanguage: (lang: Language) => void;
  addPerson: (person: Omit<Person, 'id' | 'createdAt'>) => void;
  updatePerson: (person: Person) => void;
  deletePerson: (id: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
  deleteExpense: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'karobar_data';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const defaults: AppState = {
      language: 'ur',
      persons: [],
      products: [],
      transactions: [],
      expenses: [],
    };

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...defaults, ...parsed };
      } catch (e) {
        console.error('Failed to parse saved state', e);
        return defaults;
      }
    }
    return defaults;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setLanguage = (language: Language) => {
    setState(prev => ({ ...prev, language }));
  };

  const addPerson = (personData: Omit<Person, 'id' | 'createdAt'>) => {
    const newPerson: Person = {
      ...personData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setState(prev => ({ ...prev, persons: [...prev.persons, newPerson] }));
  };

  const updatePerson = (updated: Person) => {
    setState(prev => ({
      ...prev,
      persons: prev.persons.map(p => p.id === updated.id ? updated : p)
    }));
  };

  const deletePerson = (id: string) => {
    setState(prev => ({
      ...prev,
      persons: prev.persons.filter(p => p.id !== id)
    }));
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: crypto.randomUUID(),
    };
    setState(prev => ({ ...prev, products: [...prev.products, newProduct] }));
  };

  const updateProduct = (updated: Product) => {
    setState(prev => ({
      ...prev,
      products: prev.products.map(p => p.id === updated.id ? updated : p)
    }));
  };

  const deleteProduct = (id: string) => {
    setState(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== id)
    }));
  };

  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: crypto.randomUUID(),
      date: Date.now(),
    };
    
    // Update person balance
    setState(prev => {
      const updatedPersons = prev.persons.map(p => {
        if (p.id === transactionData.personId) {
          const balanceChange = transactionData.totalAmount - transactionData.paidAmount;
          return { ...p, balance: p.balance + balanceChange };
        }
        return p;
      });
      return {
        ...prev,
        persons: updatedPersons,
        transactions: [...prev.transactions, newTransaction]
      };
    });
  };

  const addExpense = (expenseData: Omit<Expense, 'id' | 'date'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: crypto.randomUUID(),
      date: Date.now(),
    };
    setState(prev => ({ ...prev, expenses: [...prev.expenses, newExpense] }));
  };

  const deleteExpense = (id: string) => {
    setState(prev => ({
      ...prev,
      expenses: prev.expenses.filter(e => e.id !== id)
    }));
  };

  return (
    <AppContext.Provider value={{ 
      ...state, 
      setLanguage, 
      addPerson, 
      updatePerson, 
      deletePerson, 
      addProduct,
      updateProduct,
      deleteProduct,
      addTransaction, 
      addExpense,
      deleteExpense
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
