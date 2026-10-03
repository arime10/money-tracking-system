import { PaymentMethod, TransactionType, Category } from '../types';

export interface ParsedQuickInput {
  amount: number;
  description: string;
  categoryId: string;
  date: string;
  paymentMethod: PaymentMethod;
  type: TransactionType;
  matchedCategoryName: string;
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'cat-restoran': [
    'yemek', 'restoran', 'lokanta', 'kahve', 'starbucks', 'döner', 'pizza',
    'burger', 'öğle', 'akşam', 'kahvaltı', 'çay', 'tatlı', 'pasta', 'kebap', 'kafe'
  ],
  'cat-market': [
    'market', 'migros', 'bim', 'a101', 'şok', 'manav', 'fırın', 'kasap',
    'bakkal', 'gıda', 'ekmek', 'süt', 'süpermarket', 'pazar', 'file'
  ],
  'cat-ulasim': [
    'benzin', 'akaryakıt', 'mazot', 'yakıt', 'otobüs', 'metro', 'marmaray',
    'akbil', 'taksi', 'uber', 'otopark', 'yol', 'bilet', 'dolmuş', 'uçak', 'tren', 'hgs', 'ogs'
  ],
  'cat-fatura': [
    'fatura', 'elektrik', 'su', 'doğalgaz', 'gaz', 'internet', 'telekom',
    'turkcell', 'vodafone', 'aidat', 'telefon'
  ],
  'cat-kira': [
    'kira', 'ev', 'konut', 'depozito'
  ],
  'cat-eglence': [
    'sinema', 'oyun', 'steam', 'ps5', 'playstation', 'konser', 'tiyatro',
    'etkinlik', 'bar', 'gece', 'eğlence', 'pub', 'spotify', 'netflix'
  ],
  'cat-saglik': [
    'eczane', 'ilaç', 'doktor', 'hastane', 'diş', 'sağlık', 'vitamin', 'muayene'
  ],
  'cat-alisveris': [
    'kıyafet', 'ayakkabı', 'giyim', 'zara', 'hm', 'mango', 'pantolon',
    'tişört', 'avm', 'alışveriş', 'trendyol', 'hepsiburada', 'amazon', 'çanta'
  ],
  'cat-egitim': [
    'kitap', 'kurs', 'udemy', 'eğitim', 'okul', 'kırtasiye', 'ders'
  ],
  'cat-maas': [
    'maaş', 'avans', 'prim', 'aylık'
  ],
  'cat-ek-gelir': [
    'freelance', 'ek gelir', 'proje', 'satış', 'harçlık', 'burs', 'hediye', 'tahsilat'
  ],
};

const INCOME_KEYWORDS = ['maaş', 'avans', 'prim', 'ek gelir', 'freelance', 'burs', 'harçlık', 'gelen', 'tahsilat', 'gelir', 'satış'];

export function parseQuickInput(
  text: string,
  categories: Category[]
): ParsedQuickInput | null {
  if (!text || !text.trim()) return null;

  const rawLower = text.toLowerCase().trim();

  // 1. Tutar Bulma (sayılar: 350, 350.50, 350,50, 1.200 vb.)
  // Önce nokta/virgüllü sayı veya düz sayı
  const amountMatch = rawLower.match(/(?:^|\s)(\d+(?:[.,]\d+)?)(?:\s*(?:tl|₺))?(?:\s|$)/);
  if (!amountMatch) return null;

  let rawNumberStr = amountMatch[1];
  // Virgülü noktaya çevir
  rawNumberStr = rawNumberStr.replace(',', '.');
  const amount = parseFloat(rawNumberStr);
  if (isNaN(amount) || amount <= 0) return null;

  // 2. Tarih Belirleme (bugün, dün)
  const today = new Date();
  let dateStr = today.toISOString().split('T')[0];

  if (rawLower.includes('dün')) {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    dateStr = yesterday.toISOString().split('T')[0];
  }

  // 3. Ödeme Yöntemi Belirleme
  let paymentMethod: PaymentMethod = 'kart';
  if (rawLower.includes('nakit') || rawLower.includes('cash') || rawLower.includes('elden')) {
    paymentMethod = 'nakit';
  } else if (rawLower.includes('havale') || rawLower.includes('eft') || rawLower.includes('iban') || rawLower.includes('fast')) {
    paymentMethod = 'havale';
  } else if (rawLower.includes('kart') || rawLower.includes('kredi')) {
    paymentMethod = 'kart';
  }

  // 4. Tür Belirleme (Gelir vs Harcama)
  let type: TransactionType = 'expense';
  for (const incWord of INCOME_KEYWORDS) {
    if (rawLower.includes(incWord)) {
      type = 'income';
      break;
    }
  }

  // 5. Kategori Eşleştirme
  let detectedCategoryId = type === 'income' ? 'cat-ek-gelir' : 'cat-diger-gider';
  let matchedCatName = 'Diğer';

  for (const [catId, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (rawLower.includes(kw)) {
        detectedCategoryId = catId;
        break;
      }
    }
    if (detectedCategoryId !== (type === 'income' ? 'cat-ek-gelir' : 'cat-diger-gider')) {
      break;
    }
  }

  // Kullanıcının mevcut kategori listesinden adını bul
  const existingCat = categories.find((c) => c.id === detectedCategoryId);
  if (existingCat) {
    matchedCatName = existingCat.name;
  }

  // 6. Açıklama Temizleme (Tutar, dün, kart vb. kelimeleri temizleyip başlığı oluştur)
  let desc = text
    .replace(amountMatch[0], ' ')
    .replace(/\b(dün|bugün|nakit|kart|kredi kartı|havale|eft|tl|₺)\b/gi, '')
    .trim();

  // Çoklu boşlukları temizle
  desc = desc.replace(/\s+/g, ' ');

  if (!desc) {
    desc = matchedCatName;
  } else {
    // İlk harfi büyük yap
    desc = desc.charAt(0).toLocaleUpperCase('tr-TR') + desc.slice(1);
  }

  return {
    amount,
    description: desc,
    categoryId: detectedCategoryId,
    date: dateStr,
    paymentMethod,
    type,
    matchedCategoryName: matchedCatName,
  };
}
