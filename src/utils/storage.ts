import { Transaction, Category, AppSettings, Subscription, SavingsGoal, CategoryBudget, CreditCardSettings } from '../types';
import { DEFAULT_CATEGORIES } from '../data/defaultCategories';

const STORAGE_KEYS = {
  TRANSACTIONS: 'para_takip_transactions_v1',
  CATEGORIES: 'para_takip_categories_v1',
  SETTINGS: 'para_takip_settings_v1',
  SUBSCRIPTIONS: 'para_takip_subscriptions_v1',
  GOALS: 'para_takip_goals_v1',
  CATEGORY_BUDGETS: 'para_takip_cat_budgets_v1',
  CREDIT_CARD: 'para_takip_credit_card_v1',
};

const DEFAULT_SETTINGS: AppSettings = {
  currency: '₺',
  theme: 'dark',
};

export const DEFAULT_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub-netflix',
    name: 'Netflix',
    amount: 229.99,
    billingCycle: 'monthly',
    billingDay: 5,
    color: '#e50914',
    icon: 'Tv',
    categoryId: 'cat-eglence',
    paymentMethod: 'kart',
    isActive: true,
    createdAt: Date.now() - 100000,
  },
  {
    id: 'sub-spotify',
    name: 'Spotify Premium',
    amount: 59.99,
    billingCycle: 'monthly',
    billingDay: 14,
    color: '#1db954',
    icon: 'Music',
    categoryId: 'cat-eglence',
    paymentMethod: 'kart',
    isActive: true,
    createdAt: Date.now() - 90000,
  },
  {
    id: 'sub-youtube',
    name: 'YouTube Premium',
    amount: 79.99,
    billingCycle: 'monthly',
    billingDay: 22,
    color: '#ff0000',
    icon: 'PlaySquare',
    categoryId: 'cat-eglence',
    paymentMethod: 'kart',
    isActive: true,
    createdAt: Date.now() - 80000,
  },
  {
    id: 'sub-apple',
    name: 'Apple iCloud & Music',
    amount: 99.99,
    billingCycle: 'monthly',
    billingDay: 28,
    color: '#000000',
    icon: 'Smartphone',
    categoryId: 'cat-eglence',
    paymentMethod: 'kart',
    isActive: true,
    createdAt: Date.now() - 70000,
  },
];

export const DEFAULT_GOALS: SavingsGoal[] = [
  {
    id: 'goal-1',
    name: 'Yeni Telefon (iPhone 16 Pro)',
    targetAmount: 65000,
    currentAmount: 28500,
    color: '#3b82f6',
    icon: 'Smartphone',
    createdAt: Date.now() - 500000,
  },
  {
    id: 'goal-2',
    name: 'Yaz Tatili (Ege Turu)',
    targetAmount: 25000,
    currentAmount: 16000,
    color: '#10b981',
    icon: 'Plane',
    createdAt: Date.now() - 400000,
  },
  {
    id: 'goal-3',
    name: 'Acil Durum Güvence Fonu',
    targetAmount: 50000,
    currentAmount: 34000,
    color: '#8b5cf6',
    icon: 'ShieldCheck',
    createdAt: Date.now() - 300000,
  },
];

export const DEFAULT_CATEGORY_BUDGETS: CategoryBudget[] = [
  { categoryId: 'cat-market', monthlyLimit: 9000 },
  { categoryId: 'cat-restoran', monthlyLimit: 3500 },
  { categoryId: 'cat-ulasim', monthlyLimit: 3000 },
  { categoryId: 'cat-eglence', monthlyLimit: 2500 },
];

export const DEFAULT_CREDIT_CARD_SETTINGS: CreditCardSettings = {
  cardName: 'Bonus Platinum',
  cutOffDay: 18,
  dueDay: 28,
  cardLimit: 85000,
};

export function loadSubscriptions(): Subscription[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
    if (!raw) return DEFAULT_SUBSCRIPTIONS;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Abonelikler yüklenirken hata oluştu:', err);
    return DEFAULT_SUBSCRIPTIONS;
  }
}

export function saveSubscriptions(subscriptions: Subscription[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subscriptions));
  } catch (err) {
    console.error('Abonelikler kaydedilirken hata oluştu:', err);
  }
}

export function loadGoals(): SavingsGoal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (!raw) return DEFAULT_GOALS;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Hedefler yüklenirken hata oluştu:', err);
    return DEFAULT_GOALS;
  }
}

export function saveGoals(goals: SavingsGoal[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  } catch (err) {
    console.error('Hedefler kaydedilirken hata oluştu:', err);
  }
}

export function loadCategoryBudgets(): CategoryBudget[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORY_BUDGETS);
    if (!raw) return DEFAULT_CATEGORY_BUDGETS;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Kategori bütçeleri yüklenirken hata oluştu:', err);
    return DEFAULT_CATEGORY_BUDGETS;
  }
}

export function saveCategoryBudgets(budgets: CategoryBudget[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORY_BUDGETS, JSON.stringify(budgets));
  } catch (err) {
    console.error('Kategori bütçeleri kaydedilirken hata oluştu:', err);
  }
}

export function loadCreditCardSettings(): CreditCardSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CREDIT_CARD);
    if (!raw) return DEFAULT_CREDIT_CARD_SETTINGS;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Kredi kartı ayarları yüklenirken hata oluştu:', err);
    return DEFAULT_CREDIT_CARD_SETTINGS;
  }
}

export function saveCreditCardSettings(settings: CreditCardSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CREDIT_CARD, JSON.stringify(settings));
  } catch (err) {
    console.error('Kredi kartı ayarları kaydedilirken hata oluştu:', err);
  }
}

export function loadTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('İşlemler yüklenirken hata oluştu:', err);
    return [];
  }
}

export function saveTransactions(transactions: Transaction[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch (err) {
    console.error('İşlemler kaydedilirken hata oluştu:', err);
  }
}

export function loadCategories(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!raw) return DEFAULT_CATEGORIES;
    const parsed = JSON.parse(raw);
    return parsed.length > 0 ? parsed : DEFAULT_CATEGORIES;
  } catch (err) {
    console.error('Kategoriler yüklenirken hata oluştu:', err);
    return DEFAULT_CATEGORIES;
  }
}

export function saveCategories(categories: Category[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (err) {
    console.error('Kategoriler kaydedilirken hata oluştu:', err);
  }
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Ayarlar yüklenirken hata oluştu:', err);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Ayarlar kaydedilirken hata oluştu:', err);
  }
}

/**
 * Tüm verileri tek bir JSON dosyası olarak dışa aktar (Yedek Al)
 */
export function exportDataAsJSON(
  transactions: Transaction[],
  categories: Category[],
  settings: AppSettings,
  subscriptions?: Subscription[],
  goals?: SavingsGoal[],
  categoryBudgets?: CategoryBudget[],
  creditCardSettings?: CreditCardSettings
): void {
  const data = {
    version: '1.2',
    exportDate: new Date().toISOString(),
    transactions,
    categories,
    settings,
    subscriptions: subscriptions || [],
    goals: goals || [],
    categoryBudgets: categoryBudgets || [],
    creditCardSettings: creditCardSettings || DEFAULT_CREDIT_CARD_SETTINGS,
  };

  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `para-takip-yedek-${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * JSON dosyasından verileri içe aktar (Geri Yükle)
 */
export function parseImportJSON(fileContent: string): {
  transactions?: Transaction[];
  categories?: Category[];
  settings?: AppSettings;
  subscriptions?: Subscription[];
  goals?: SavingsGoal[];
  categoryBudgets?: CategoryBudget[];
  creditCardSettings?: CreditCardSettings;
} | null {
  try {
    const parsed = JSON.parse(fileContent);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Geçersiz JSON formatı');
    }
    return {
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : undefined,
      categories: Array.isArray(parsed.categories) ? parsed.categories : undefined,
      settings: parsed.settings && typeof parsed.settings === 'object' ? parsed.settings : undefined,
      subscriptions: Array.isArray(parsed.subscriptions) ? parsed.subscriptions : undefined,
      goals: Array.isArray(parsed.goals) ? parsed.goals : undefined,
      categoryBudgets: Array.isArray(parsed.categoryBudgets) ? parsed.categoryBudgets : undefined,
      creditCardSettings: parsed.creditCardSettings && typeof parsed.creditCardSettings === 'object' ? parsed.creditCardSettings : undefined,
    };
  } catch (err) {
    console.error('Yedek dosyası okunamadı:', err);
    return null;
  }
}
