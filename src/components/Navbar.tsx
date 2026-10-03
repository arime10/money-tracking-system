import React, { useRef } from 'react';
import {
  Wallet,
  PlusCircle,
  Download,
  Upload,
  Sparkles,
  Sun,
  Moon,
  Trash2,
  Trophy,
  Sliders,
} from 'lucide-react';
import {
  AppSettings,
  Transaction,
  Category,
  Subscription,
  SavingsGoal,
  CategoryBudget,
  CreditCardSettings,
} from '../types';
import { exportDataAsJSON, parseImportJSON } from '../utils/storage';
import { generateMockTransactions } from '../data/mockData';

interface NavbarProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  transactions: Transaction[];
  categories: Category[];
  subscriptions: Subscription[];
  goals: SavingsGoal[];
  categoryBudgets: CategoryBudget[];
  creditCardSettings: CreditCardSettings;
  onImportData: (
    transactions: Transaction[],
    categories?: Category[],
    subscriptions?: Subscription[],
    goals?: SavingsGoal[],
    categoryBudgets?: CategoryBudget[],
    creditCardSettings?: CreditCardSettings
  ) => void;
  onOpenAddModal: (type?: 'expense' | 'income') => void;
  onOpenReportCard: () => void;
  onOpenBudgetLimits: () => void;
  onClearAll: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onUpdateSettings,
  transactions,
  categories,
  subscriptions,
  goals,
  categoryBudgets,
  creditCardSettings,
  onImportData,
  onOpenAddModal,
  onOpenReportCard,
  onOpenBudgetLimits,
  onClearAll,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    onUpdateSettings({ ...settings, theme: nextTheme });
  };

  const handleExport = () => {
    exportDataAsJSON(
      transactions,
      categories,
      settings,
      subscriptions,
      goals,
      categoryBudgets,
      creditCardSettings
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const data = parseImportJSON(content);
      if (data && data.transactions) {
        onImportData(
          data.transactions,
          data.categories,
          data.subscriptions,
          data.goals,
          data.categoryBudgets,
          data.creditCardSettings
        );
        alert(`Başarıyla ${data.transactions.length} işlem ve tüm finans verileri içe aktarıldı!`);
      } else {
        alert('Geçersiz dosya içeriği. Lütfen geçerli bir yedek dosyası seçin.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleLoadDemo = () => {
    if (
      transactions.length > 0 &&
      !window.confirm('Mevcut işlemleriniz örnek veriler ile değiştirilecek. Onaylıyor musunuz?')
    ) {
      return;
    }
    const mockTxs = generateMockTransactions();
    onImportData(mockTxs);
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 ring-2 ring-emerald-500/30">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                Finans Radarı
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800">
                Kişisel Asistan
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden md:block">
              Harcama, Kumbara, Bütçe & Karar Simülatörü
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Finansal Karne (Wrapped) Button */}
          <button
            onClick={onOpenReportCard}
            title="Aylık Finansal Sağlık Karnesi (Wrapped)"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-900 dark:text-amber-200 bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-300 dark:from-amber-900/80 dark:to-yellow-900/60 hover:brightness-105 active:scale-95 border border-amber-300 dark:border-amber-700 rounded-xl shadow-xs transition-all"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-700 dark:text-amber-300" />
            <span className="hidden sm:inline">Karnem</span>
          </button>

          {/* Kategori Limitleri Button */}
          <button
            onClick={onOpenBudgetLimits}
            title="Kategori Harcama Limitlerini Ayarla"
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Demo Data Button */}
          <button
            onClick={handleLoadDemo}
            title="Sistemi denemek için örnek veriler yükle"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden md:inline">Demo</span>
          </button>

          {/* Export JSON */}
          <button
            onClick={handleExport}
            title="Yedek Al (JSON indir)"
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Import JSON */}
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Yedek Yükle (JSON içe aktar)"
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <Upload className="w-4 h-4" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          {/* Clear All */}
          {transactions.length > 0 && (
            <button
              onClick={onClearAll}
              title="Tüm İşlemleri Sıfırla"
              className="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={settings.theme === 'dark' ? 'Açık Mod' : 'Koyu Mod'}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            {settings.theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Add Transaction Button */}
          <button
            onClick={() => onOpenAddModal('expense')}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 shadow-md shadow-emerald-600/25 rounded-xl transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden xs:inline">İşlem Ekle</span>
          </button>
        </div>
      </div>
    </header>
  );
};
