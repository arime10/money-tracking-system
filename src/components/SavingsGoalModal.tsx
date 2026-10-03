import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { SavingsGoal } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface SavingsGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: Omit<SavingsGoal, 'id' | 'createdAt'>, id?: string) => void;
  editingGoal?: SavingsGoal | null;
}

const AVAILABLE_COLORS = [
  '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316',
  '#06b6d4', '#e11d48', '#f59e0b', '#6366f1'
];

const AVAILABLE_ICONS = [
  'Target', 'Smartphone', 'Plane', 'Car', 'Home', 'Laptop',
  'Gift', 'Coins', 'HeartPulse', 'GraduationCap', 'Gamepad2'
];

export const SavingsGoalModal: React.FC<SavingsGoalModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingGoal,
}) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [targetDate, setTargetDate] = useState('');
  const [color, setColor] = useState('#10b981');
  const [icon, setIcon] = useState('Target');

  useEffect(() => {
    if (editingGoal) {
      setName(editingGoal.name);
      setTargetAmount(editingGoal.targetAmount.toString());
      setCurrentAmount(editingGoal.currentAmount.toString());
      setTargetDate(editingGoal.targetDate || '');
      setColor(editingGoal.color);
      setIcon(editingGoal.icon);
    } else {
      setName('');
      setTargetAmount('');
      setCurrentAmount('0');
      setTargetDate('');
      setColor('#10b981');
      setIcon('Target');
    }
  }, [editingGoal, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetAmount);
    const current = parseFloat(currentAmount) || 0;

    if (!name.trim()) {
      alert('Lütfen hedef adını girin.');
      return;
    }
    if (!target || target <= 0) {
      alert('Lütfen geçerli bir hedef tutarı girin.');
      return;
    }

    onSave(
      {
        name: name.trim(),
        targetAmount: target,
        currentAmount: current,
        targetDate: targetDate || undefined,
        color,
        icon,
      },
      editingGoal?.id
    );

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-sm"
              style={{ backgroundColor: color }}
            >
              <CategoryIcon name={icon} className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingGoal ? 'Hedefi Düzenle' : 'Yeni Birikim Hedefi Ekle'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Hedef Adı
            </label>
            <input
              type="text"
              required
              placeholder="Örn: Yeni Telefon, Yaz Tatili, Acil Fon..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Hedef Tutar (₺)
              </label>
              <input
                type="number"
                step="any"
                min="1"
                required
                placeholder="40000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full px-3 py-2.5 text-sm font-bold bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Şu An Biriken (₺)
              </label>
              <input
                type="number"
                step="any"
                min="0"
                placeholder="0"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                className="w-full px-3 py-2.5 text-sm font-bold bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Hedeflenen Tarih (Opsiyonel)
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">Renk Seç:</span>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-6 h-6 rounded-lg transition-transform ${
                    color === c ? 'ring-2 ring-offset-2 ring-emerald-500 scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">İkon Seç:</span>
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto p-1">
              {AVAILABLE_ICONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={`p-1.5 rounded-lg border text-slate-700 dark:text-slate-300 transition-all ${
                    icon === ic
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
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{editingGoal ? 'Hedefi Güncelle' : 'Hedefi Kaydet'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
