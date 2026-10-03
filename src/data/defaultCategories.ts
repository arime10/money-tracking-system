import { Category } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  // Gider Kategorileri
  { id: 'cat-market', name: 'Market & Gıda', icon: 'ShoppingCart', color: '#10b981', type: 'expense' },
  { id: 'cat-kira', name: 'Kira & Konut', icon: 'Home', color: '#3b82f6', type: 'expense' },
  { id: 'cat-fatura', name: 'Faturalar & Aidat', icon: 'Zap', color: '#f59e0b', type: 'expense' },
  { id: 'cat-restoran', name: 'Yeme - İçme & Kafe', icon: 'Utensils', color: '#f97316', type: 'expense' },
  { id: 'cat-ulasim', name: 'Ulaşım & Yakıt', icon: 'Car', color: '#6366f1', type: 'expense' },
  { id: 'cat-eglence', name: 'Eğlence & Abonelikler', icon: 'Film', color: '#ec4899', type: 'expense' },
  { id: 'cat-saglik', name: 'Sağlık & Eczane', icon: 'HeartPulse', color: '#ef4444', type: 'expense' },
  { id: 'cat-alisveris', name: 'Alışveriş & Giyim', icon: 'Shirt', color: '#8b5cf6', type: 'expense' },
  { id: 'cat-egitim', name: 'Eğitim & Kurslar', icon: 'GraduationCap', color: '#06b6d4', type: 'expense' },
  { id: 'cat-diger-gider', name: 'Diğer Harcamalar', icon: 'MoreHorizontal', color: '#64748b', type: 'expense' },

  // Gelir Kategorileri
  { id: 'cat-maas', name: 'Maaş', icon: 'Briefcase', color: '#059669', type: 'income' },
  { id: 'cat-ek-gelir', name: 'Serbest Çalışma / Ek Gelir', icon: 'Laptop', color: '#2563eb', type: 'income' },
  { id: 'cat-yatirim', name: 'Yatırım / Temettü', icon: 'TrendingUp', color: '#7c3aed', type: 'income' },
  { id: 'cat-harclik', name: 'Burs / Destek / Hediye', icon: 'Gift', color: '#db2777', type: 'income' },
  { id: 'cat-diger-gelir', name: 'Diğer Gelirler', icon: 'PlusCircle', color: '#0d9488', type: 'income' },
];
