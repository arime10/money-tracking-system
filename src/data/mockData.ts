import { Transaction } from '../types';

export function generateMockTransactions(): Transaction[] {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed
  const currentDay = today.getDate();

  const transactions: Transaction[] = [];

  const pad = (n: number) => String(n).padStart(2, '0');
  const makeDate = (d: number) => `${year}-${pad(month + 1)}-${pad(d)}`;

  // Maaş (Ayın 1'inde)
  transactions.push({
    id: 'mock-tx-1',
    type: 'income',
    amount: 55000,
    categoryId: 'cat-maas',
    date: makeDate(1),
    description: 'Aylık Maaş Ödemesi',
    paymentMethod: 'havale',
    createdAt: new Date(year, month, 1, 9, 30).getTime(),
  });

  // Kira (Ayın 2'sinde)
  if (currentDay >= 2) {
    transactions.push({
      id: 'mock-tx-2',
      type: 'expense',
      amount: 18000,
      categoryId: 'cat-kira',
      date: makeDate(2),
      description: 'Ev Kirası',
      paymentMethod: 'havale',
      createdAt: new Date(year, month, 2, 11, 0).getTime(),
    });
  }

  // Faturalar (Ayın 4'ünde)
  if (currentDay >= 4) {
    transactions.push({
      id: 'mock-tx-3',
      type: 'expense',
      amount: 1850,
      categoryId: 'cat-fatura',
      date: makeDate(4),
      description: 'Elektrik & Su & Doğalgaz',
      paymentMethod: 'kart',
      createdAt: new Date(year, month, 4, 14, 15).getTime(),
    });
    transactions.push({
      id: 'mock-tx-4',
      type: 'expense',
      amount: 450,
      categoryId: 'cat-fatura',
      date: makeDate(4),
      description: 'Fiber İnternet Faturası',
      paymentMethod: 'kart',
      createdAt: new Date(year, month, 4, 15, 30).getTime(),
    });
  }

  // Ek gelir (Ayın 8'inde)
  if (currentDay >= 8) {
    transactions.push({
      id: 'mock-tx-5',
      type: 'income',
      amount: 12500,
      categoryId: 'cat-ek-gelir',
      date: makeDate(8),
      description: 'Freelance Proje Ödemesi',
      paymentMethod: 'havale',
      createdAt: new Date(year, month, 8, 16, 0).getTime(),
    });
  }

  // Günlük tekrarlayan harcamalar (Market, Yeme-içme, Ulaşım vb.)
  const sampleExpenses = [
    { cat: 'cat-market', desc: 'Haftalık Süpermarket Alışverişi', min: 850, max: 1400, method: 'kart' as const },
    { cat: 'cat-restoran', desc: 'Öğle Yemeği & Kahve', min: 220, max: 480, method: 'kart' as const },
    { cat: 'cat-ulasim', desc: 'Yakıt / Akaryakıt Dolumu', min: 600, max: 1100, method: 'kart' as const },
    { cat: 'cat-market', desc: 'Fırın & Manav Alışverişi', min: 140, max: 320, method: 'nakit' as const },
    { cat: 'cat-eglence', desc: 'Sinema & Dijital Platform', min: 280, max: 550, method: 'kart' as const },
    { cat: 'cat-saglik', desc: 'Eczane / Vitamin', min: 180, max: 390, method: 'kart' as const },
  ];

  for (let d = 3; d <= currentDay; d++) {
    // Bazı günlere rastgele 1-3 harcama ekleyelim
    const count = (d % 3 === 0) ? 2 : (d % 2 === 0 ? 1 : 2);
    for (let c = 0; c < count; c++) {
      const sample = sampleExpenses[(d + c * 2) % sampleExpenses.length];
      const amount = Math.floor(sample.min + ((d * 37 + c * 59) % (sample.max - sample.min)));
      transactions.push({
        id: `mock-tx-day-${d}-${c}`,
        type: 'expense',
        amount,
        categoryId: sample.cat,
        date: makeDate(d),
        description: sample.desc,
        paymentMethod: sample.method,
        createdAt: new Date(year, month, d, 12 + c * 3, (d * 13) % 60).getTime(),
      });
    }
  }

  return transactions;
}
