/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(timestamp: number, language: 'en' | 'ur') {
  return new Date(timestamp).toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function formatCurrency(amount: number, language: 'en' | 'ur') {
  return new Intl.NumberFormat(language === 'ur' ? 'ur-PK' : 'en-US', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0
  }).format(amount);
}
