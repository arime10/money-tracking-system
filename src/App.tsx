import { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  LayoutDashboard,
  ReceiptText,
  PieChart,
  Calculator,
  Tag,
  TrendingDown,
  TrendingUp,
  Tv,
  Bot,
  Target,
} from 'lucide-react';
import {
  Transaction,
  Category,
  AppSettings,
  TransactionType,
  Subscription,
  SavingsGoal,
  CategoryBudget,
  CreditCardSettings,
} from './types';
import {
  loadTransactions,
  saveTransactions,
  loadCategories,
  saveCategories,
  loadSettings,
  saveSettings,
  loadSubscriptions,
  saveSubscriptions,
  loadGoals,
  saveGoals,
  loadCategoryBudgets,
  saveCategoryBudgets,
  loadCreditCardSettings,
  saveCreditCardSettings,
} from './utils/storage';
import { calculateMetrics } from './utils/financeCalculators';
import { Navbar } from './components/Navbar';
import { StatCards } from './components/StatCards';
import { RunwaySimulator } from './components/RunwaySimulator';
import { TransactionModal } from './components/TransactionModal';
import { TransactionList } from './components/TransactionList';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { CategoryManagerModal } from './components/CategoryManagerModal';
import { SubscriptionsView } from './components/SubscriptionsView';
import { SubscriptionModal } from './components/SubscriptionModal';
import { AdvisorRobotView } from './components/AdvisorRobotView';
import { QuickInputBar } from './components/QuickInputBar';
import { SavingsGoalsView } from './components/SavingsGoalsView';
import { SavingsGoalModal } from './components/SavingsGoalModal';
import { BudgetLimitsModal } from './components/BudgetLimitsModal';
import { CreditCardTracker } from './components/CreditCardTracker';
import { FinancialReportCardModal } from './components/FinancialReportCardModal';
import { generateMockTransactions } from './data/mockData';

export function App() {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [categories, setCategories] = useState<Category[]>(() => loadCategories());
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => loadSubscriptions());
  const [goals, setGoals] = useState<SavingsGoal[]>(() => loadGoals());
  const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget[]>(() => loadCategoryBudgets());
  const [creditCardSettings, setCreditCardSettings] = useState<CreditCardSettings>(() => loadCreditCardSettings());

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const loaded = loadTransactions();
    if (loaded.length === 0) {
      const demo = generateMockTransactions();
      saveTransactions(demo);
      return demo;
    }
    return loaded;
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'simulator' | 'advisor' | 'goals' | 'subscriptions' | 'transactions' | 'charts'>('overview');
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [txModalDefaultType, setTxModalDefaultType] = useState<TransactionType>('expense');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Subscriptions state
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);

  // Savings Goals state
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);

  // Budget Limits and Report Card state
  const [isBudgetLimitsModalOpen, setIsBudgetLimitsModalOpen] = useState(false);
  const [isReportCardModalOpen, setIsReportCardModalOpen] = useState(false);

  // Sync settings with HTML root class for dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    saveSettings(settings);
  }, [settings]);

  // Persist state
  useEffect(() => { saveTransactions(transactions); }, [transactions]);
  useEffect(() => { saveCategories(categories); }, [categories]);
  useEffect(() => { saveSubscriptions(subscriptions); }, [subscriptions]);
  useEffect(() => { saveGoals(goals); }, [goals]);
  useEffect(() => { saveCategoryBudgets(categoryBudgets); }, [categoryBudgets]);
  useEffect(() => { saveCreditCardSettings(creditCardSettings); }, [creditCardSettings]);

  // Calculate live financial metrics
  const metrics = useMemo(() => {
    return calculateMetrics(transactions);
  }, [transactions]);

  // Handlers for transactions
  const handleSaveTransaction = (
    txData: Omit<Transaction, 'id' | 'createdAt'>,
    id?: string
  ) => {
    if (id) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...txData } : t))
      );
    } else {
      const newTx: Transaction = {
        ...txData,
        id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: Date.now(),
      };
      setTransactions((prev) => [newTx, ...prev]);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Bu işlemi silmek istediğinize emin misiniz?')) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleOpenAddModal = (type: TransactionType = 'expense') => {
    setEditingTransaction(null);
    setTxModalDefaultType(type);
    setIsTxModalOpen(true);
  };

  const handleEditTransaction = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsTxModalOpen(true);
  };

  // Handlers for categories
  const handleAddCategory = (newCat: Omit<Category, 'id'>) => {
    const cat: Category = {
      ...newCat,
      id: `cat-custom-${Date.now()}`,
    };
    setCategories((prev) => [...prev, cat]);
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  // Handlers for subscriptions
  const handleSaveSubscription = (
    subData: Omit<Subscription, 'id' | 'createdAt'>,
    id?: string
  ) => {
    if (id) {
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...subData } : s))
      );
    } else {
      const newSub: Subscription = {
        ...subData,
        id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: Date.now(),
      };
      setSubscriptions((prev) => [newSub, ...prev]);
    }
  };

  const handleDeleteSubscription = (id: string) => {
    if (window.confirm('Bu aboneliği silmek istediğinize emin misiniz?')) {
      setSubscriptions((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleToggleSubscriptionActive = (id: string) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  const handleLogSubscriptionAsExpense = (sub: Subscription) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newTx: Transaction = {
      id: `tx-sub-${Date.now()}`,
      type: 'expense',
      amount: sub.amount,
      categoryId: sub.categoryId,
      date: todayStr,
      description: `${sub.name} Abonelik Faturası`,
      paymentMethod: sub.paymentMethod,
      createdAt: Date.now(),
    };
    setTransactions((prev) => [newTx, ...prev]);
    alert(`${sub.name} faturası (${sub.amount} ${settings.currency}) bugünün harcamalarına eklendi!`);
  };

  // Handlers for Savings Goals
  const handleSaveGoal = (goalData: Omit<SavingsGoal, 'id' | 'createdAt'>, id?: string) => {
    if (id) {
      setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...goalData } : g)));
    } else {
      const newGoal: SavingsGoal = {
        ...goalData,
        id: `goal-${Date.now()}`,
        createdAt: Date.now(),
      };
      setGoals((prev) => [...prev, newGoal]);
    }
  };

  const handleDeleteGoal = (id: string) => {
    if (window.confirm('Bu birikim hedefini silmek istediğinize emin misiniz?')) {
      setGoals((prev) => prev.filter((g) => g.id !== id));
    }
  };

  const handleUpdateGoalAmount = (goalId: string, delta: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          return { ...g, currentAmount: Math.max(0, g.currentAmount + delta) };
        }
        return g;
      })
    );
  };

  // Backup Import Handler
  const handleImportData = (
    newTxs: Transaction[],
    newCats?: Category[],
    newSubs?: Subscription[],
    newGoals?: SavingsGoal[],
    newBudgets?: CategoryBudget[],
    newCardSettings?: CreditCardSettings
  ) => {
    setTransactions(newTxs);
    if (newCats && newCats.length > 0) setCategories(newCats);
    if (newSubs && newSubs.length > 0) setSubscriptions(newSubs);
    if (newGoals && newGoals.length > 0) setGoals(newGoals);
    if (newBudgets && newBudgets.length > 0) setCategoryBudgets(newBudgets);
    if (newCardSettings) setCreditCardSettings(newCardSettings);
  };

  const handleClearAll = () => {
    if (
      window.confirm(
        'TÜM işlemleriniz ve verileriniz silinecektir! Devam etmeden önce yedek almak isteyebilirsiniz. Onaylıyor musunuz?'
      )
    ) {
      setTransactions([]);
    }
  };

  const isDarkMode = settings.theme === 'dark';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      {/* Top Navigation */}
      <Navbar
        settings={settings}
        onUpdateSettings={setSettings}
        transactions={transactions}
        categories={categories}
        subscriptions={subscriptions}
        goals={goals}
        categoryBudgets={categoryBudgets}
        creditCardSettings={creditCardSettings}
        onImportData={handleImportData}
        onOpenAddModal={handleOpenAddModal}
        onOpenReportCard={() => setIsReportCardModalOpen(true)}
        onOpenBudgetLimits={() => setIsBudgetLimitsModalOpen(true)}
        onClearAll={handleClearAll}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24">
        {/* ⚡ Hızlı Doğal Dil Girişi Çubuğu */}
        <QuickInputBar
          categories={categories}
          currency={settings.currency}
          onAddTransaction={handleSaveTransaction}
        />

        {/* Quick Summary Cards (Always accessible) */}
        <StatCards metrics={metrics} currency={settings.currency} />

        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap gap-3">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 flex-wrap">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                activeTab === 'overview'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-500" />
              <span>Genel Bakış</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                activeTab === 'simulator'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Calculator className="w-4 h-4 text-teal-500" />
              <span>Para Ne Kadar Yeter?</span>
            </button>

            {/* 🤖 KARAR ROBOTU TABİ */}
            <button
              onClick={() => setActiveTab('advisor')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                activeTab === 'advisor'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Bot className="w-4 h-4 text-emerald-500" />
              <span>Karar Robotu</span>
            </button>

            {/* 🎯 BİRİKİM KUMBARASI TABİ */}
            <button
              onClick={() => setActiveTab('goals')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                activeTab === 'goals'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Target className="w-4 h-4 text-blue-500" />
              <span>Kumbara / Hedefler</span>
              {goals.length > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-extrabold">
                  {goals.length}
                </span>
              )}
            </button>

            {/* ABONELİKLER TABİ */}
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                activeTab === 'subscriptions'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Tv className="w-4 h-4 text-rose-500" />
              <span>Abonelikler</span>
              {subscriptions.filter((s) => s.isActive).length > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-extrabold">
                  {subscriptions.filter((s) => s.isActive).length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                activeTab === 'transactions'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ReceiptText className="w-4 h-4 text-amber-500" />
              <span>Günlük Harcamalar</span>
            </button>

            <button
              onClick={() => setActiveTab('charts')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                activeTab === 'charts'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <PieChart className="w-4 h-4 text-purple-500" />
              <span>Kategorik Grafikler</span>
            </button>
          </div>

          {/* Additional tools button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all shadow-sm"
            >
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span>Kategorileri Düzenle</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Interactive Runway Simulator on top */}
            <RunwaySimulator metrics={metrics} currency={settings.currency} />

            {/* Kredi Kartı Ekstre & Nakit Dengesi */}
            <CreditCardTracker
              transactions={transactions}
              metrics={metrics}
              currency={settings.currency}
              settings={creditCardSettings}
              onUpdateSettings={setCreditCardSettings}
            />

            {/* Visual Charts & Kategori Bütçe Radarı */}
            <AnalyticsCharts
              transactions={transactions}
              categories={categories}
              categoryBudgets={categoryBudgets}
              currency={settings.currency}
              isDarkMode={isDarkMode}
              onOpenBudgetLimits={() => setIsBudgetLimitsModalOpen(true)}
            />

            {/* Daily grouped transaction stream */}
            <TransactionList
              transactions={transactions}
              categories={categories}
              currency={settings.currency}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
              onOpenAddModal={() => handleOpenAddModal('expense')}
            />
          </div>
        )}

        {/* Tab 2: Dedicated Runway Simulator View */}
        {activeTab === 'simulator' && (
          <div className="space-y-6">
            <RunwaySimulator metrics={metrics} currency={settings.currency} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center font-bold text-sm mb-3">
                  1
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  Mevcut Harcama Hızı (Burn Rate)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Bu ay yaptığınız harcamalar ayın bugününe bölünerek hesaplanır. Günlük alışkanlıklarınızı en gerçekçi yansıtan göstergedir.
                </p>
              </div>

              <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 flex items-center justify-center font-bold text-sm mb-3">
                  2
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  Önceden Tedbir Alın
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  "Günde X TL harcarsam ne kadar yeter?" simülatörünü kullanarak ay ortasında bütçenizi ne kadar sıkılaştırmanız gerektiğini önceden görebilirsiniz.
                </p>
              </div>

              <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 flex items-center justify-center font-bold text-sm mb-3">
                  3
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  Maaşa Kadar Günlük Limit
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Bir sonraki maaş gününüze kalan süreyi "Hedef Gün" olarak seçip gün başına harcayabileceğiniz tavan limiti anında sabitleyebilirsiniz.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Karar Robotu View */}
        {activeTab === 'advisor' && (
          <AdvisorRobotView
            metrics={metrics}
            categories={categories}
            currency={settings.currency}
            onAddTransaction={(tx) => {
              const newTx: Transaction = {
                ...tx,
                id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                createdAt: Date.now(),
              };
              setTransactions((prev) => [newTx, ...prev]);
            }}
          />
        )}

        {/* Tab 4: Kumbara / Birikim Hedefleri */}
        {activeTab === 'goals' && (
          <SavingsGoalsView
            goals={goals}
            metrics={metrics}
            currency={settings.currency}
            onOpenAddModal={() => {
              setEditingGoal(null);
              setIsGoalModalOpen(true);
            }}
            onEditGoal={(goal) => {
              setEditingGoal(goal);
              setIsGoalModalOpen(true);
            }}
            onDeleteGoal={handleDeleteGoal}
            onUpdateAmount={handleUpdateGoalAmount}
          />
        )}

        {/* Tab 5: Subscriptions View */}
        {activeTab === 'subscriptions' && (
          <SubscriptionsView
            subscriptions={subscriptions}
            categories={categories}
            currency={settings.currency}
            onOpenAddModal={() => {
              setEditingSubscription(null);
              setIsSubscriptionModalOpen(true);
            }}
            onEdit={(sub) => {
              setEditingSubscription(sub);
              setIsSubscriptionModalOpen(true);
            }}
            onDelete={handleDeleteSubscription}
            onToggleActive={handleToggleSubscriptionActive}
            onLogAsExpense={handleLogSubscriptionAsExpense}
          />
        )}

        {/* Tab 6: Detailed Transactions */}
        {activeTab === 'transactions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenAddModal('expense')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                >
                  <TrendingDown className="w-4 h-4" />
                  + Harcama Gir
                </button>
                <button
                  onClick={() => handleOpenAddModal('income')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                >
                  <TrendingUp className="w-4 h-4" />
                  + Gelir Gir
                </button>
              </div>
            </div>

            <TransactionList
              transactions={transactions}
              categories={categories}
              currency={settings.currency}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
              onOpenAddModal={() => handleOpenAddModal('expense')}
            />
          </div>
        )}

        {/* Tab 7: Detailed Charts */}
        {activeTab === 'charts' && (
          <div className="space-y-6">
            <AnalyticsCharts
              transactions={transactions}
              categories={categories}
              categoryBudgets={categoryBudgets}
              currency={settings.currency}
              isDarkMode={isDarkMode}
              onOpenBudgetLimits={() => setIsBudgetLimitsModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Floating Action Buttons for quick mobile input */}
      <div className="fixed bottom-5 right-5 sm:hidden flex flex-col gap-2 z-40">
        <button
          onClick={() => handleOpenAddModal('income')}
          className="w-12 h-12 rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          title="Gelir Ekle"
        >
          <TrendingUp className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleOpenAddModal('expense')}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 text-white shadow-xl shadow-rose-600/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          title="Harcama Ekle"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>

      {/* Transaction Modal (Add / Edit) */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        onSave={handleSaveTransaction}
        categories={categories}
        editingTransaction={editingTransaction}
        defaultType={txModalDefaultType}
      />

      {/* Subscription Modal (Add / Edit) */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        onSave={handleSaveSubscription}
        categories={categories}
        editingSubscription={editingSubscription}
      />

      {/* Savings Goal Modal (Add / Edit) */}
      <SavingsGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSave={handleSaveGoal}
        editingGoal={editingGoal}
      />

      {/* Category Budget Limits Modal */}
      <BudgetLimitsModal
        isOpen={isBudgetLimitsModalOpen}
        onClose={() => setIsBudgetLimitsModalOpen(false)}
        categories={categories}
        budgets={categoryBudgets}
        onSaveBudgets={setCategoryBudgets}
        currency={settings.currency}
      />

      {/* Financial Report Card Modal (Wrapped) */}
      <FinancialReportCardModal
        isOpen={isReportCardModalOpen}
        onClose={() => setIsReportCardModalOpen(false)}
        transactions={transactions}
        categories={categories}
        metrics={metrics}
        currency={settings.currency}
      />

      {/* Category Manager Modal */}
      <CategoryManagerModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
      />
    </div>
  );
}
export default App;
