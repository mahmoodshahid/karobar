/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'en' | 'ur';

export enum EntityType {
  CUSTOMER = 'customer',
  SUPPLIER = 'supplier',
}

export interface Person {
  id: string;
  name: string;
  phone: string;
  address: string;
  balance: number;
  type: EntityType;
  createdAt: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  costPrice: number;
  quantity: number;
}

export interface InvoiceItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export enum TransactionType {
  SALE = 'sale',
  PURCHASE = 'purchase',
}

export interface Transaction {
  id: string;
  date: number;
  type: TransactionType;
  personId: string;
  personName: string;
  items: InvoiceItem[];
  totalAmount: number;
  paidAmount: number;
  status: 'paid' | 'partial' | 'unpaid';
  notes?: string;
}

export enum ExpenseCategory {
  RENT = 'Rent',
  TRANSPORT = 'Transport',
  UTILITY = 'Utility',
  SALARY = 'Salary',
  OTHER = 'Other',
}

export interface Expense {
  id: string;
  date: number;
  category: ExpenseCategory;
  amount: number;
  notes: string;
}

export interface AppState {
  language: Language;
  persons: Person[];
  products: Product[];
  transactions: Transaction[];
  expenses: Expense[];
}
