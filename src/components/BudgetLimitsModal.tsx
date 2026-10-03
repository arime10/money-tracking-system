import React, { useState } from 'react';
import { X, Check, ShieldAlert, Sliders } from 'lucide-react';
import { Category, CategoryBudget } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface BudgetLimitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  budgets: CategoryBudget[];
  onSaveBudgets: (budgets: CategoryBudget[]) => void;
  currency: string;
}

export const BudgetLimitsModal: React.FC<BudgetLimitsModalProps> = ({
  isOpen,
  onClose,
  categories,
  budgets,
  onSaveBudgets,
  currency,
}) => {
  const [limits, setLimits] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    budgets.forEach((b) => {
      map[b.categoryId] = b.monthlyLimit.toString();
    });
    return map;
  });

  if (!isOpen) return null;

  const expenseCategories = categories.filter((c) => c.type === 'expense');

  const handleLimitChange = (catId: string, value: string) => {
    setLimits((prev) => ({
      ...prev,
      [catId]: value,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newBudgets: CategoryBudget[] = [];

    Object.entries(limits).forEach(([catId, val]) => {
      const num = parseFloat(val);
      if (num && num > 0) {
        newBudgets.push({
          categoryId: catId,
          monthlyLimit: num,
        });
      }
    });

    onSaveBudgets(newBudgets);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-500" />
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Kategori Bütçe Limitleri
              </h3>
              <p className="text-xs text-slate-400">
                Ay içinde aşmak istemediğiniz tavan harcama tutarları
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-4 overflow-y-auto">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              Burada belirlediğiniz limitlerin %75'ine yaklaştığınızda sarı uyarı, limiti aştığınızda kırmızı alarm verilecektir.
            </span>
          </div>

          <div className="space-y-3">
            {expenseCategories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                  >
                    <CategoryIcon name={cat.icon} className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {cat.name}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <input
                    type="number"
                    min={0}
                    step={50}
                    placeholder="Limit yok"
                    value={limits[cat.id] || ''}
                    onChange={(e) => handleLimitChange(cat.id, e.target.value)}
                    className="w-28 px-2.5 py-1.5 text-xs text-right font-bold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-slate-400 font-semibold">{currency}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Limitleri Kaydet</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
