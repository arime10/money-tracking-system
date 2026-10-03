import React, { useState } from 'react';
import { X, Plus, Trash2, Tag } from 'lucide-react';
import { Category, TransactionType } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onAddCategory: (cat: Omit<Category, 'id'>) => void;
  onDeleteCategory: (id: string) => void;
}

const AVAILABLE_COLORS = [
  '#10b981', '#059669', '#3b82f6', '#2563eb', '#6366f1',
  '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#f59e0b',
  '#06b6d4', '#14b8a6', '#64748b', '#78716c'
];

const AVAILABLE_ICONS = [
  'ShoppingCart', 'Home', 'Zap', 'Utensils', 'Car', 'Film',
  'HeartPulse', 'Shirt', 'GraduationCap', 'Briefcase', 'Laptop',
  'TrendingUp', 'Gift', 'Coffee', 'Plane', 'Smartphone', 'Dumbbell',
  'BookOpen', 'Baby', 'Dog', 'Music'
];

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
  categories,
  onAddCategory,
  onDeleteCategory,
}) => {
  const [activeTab, setActiveTab] = useState<TransactionType>('expense');
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(AVAILABLE_ICONS[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddCategory({
      name: name.trim(),
      color: selectedColor,
      icon: selectedIcon,
      type: activeTab,
      isCustom: true,
    });

    setName('');
  };

  const filtered = categories.filter((c) => c.type === activeTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-emerald-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Kategori Yönetimi
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Tab */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setActiveTab('expense')}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'expense'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Harcama Kategorileri
            </button>
            <button
              onClick={() => setActiveTab('income')}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'income'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Gelir Kategorileri
            </button>
          </div>

          {/* New Category Form */}
          <form onSubmit={handleSubmit} className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              + Yeni Kategori Ekle
            </div>
            <input
              type="text"
              required
              placeholder="Kategori Adı (Örn: Evcil Hayvan)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            {/* Color picker */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">Renk Seç:</span>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-6 h-6 rounded-lg transition-transform ${
                      selectedColor === c ? 'ring-2 ring-offset-2 ring-emerald-500 scale-110' : 'opacity-80 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Icon picker */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">İkon Seç:</span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1">
                {AVAILABLE_ICONS.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setSelectedIcon(ic)}
                    className={`p-1.5 rounded-lg border text-slate-700 dark:text-slate-300 transition-all ${
                      selectedIcon === ic
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <CategoryIcon name={ic} className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Kategoriyi Ekle
            </button>
          </form>

          {/* Existing Categories List */}
          <div className="space-y-1.5">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Mevcut Kategoriler ({filtered.length})
            </div>
            <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
              {filtered.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs"
                      style={{ backgroundColor: cat.color }}
                    >
                      <CategoryIcon name={cat.icon} className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                      {cat.name}
                    </span>
                  </div>

                  {cat.isCustom && (
                    <button
                      onClick={() => onDeleteCategory(cat.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                      title="Kategoriyi Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
