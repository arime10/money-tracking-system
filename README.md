# 💰 Para Takip & Akıllı Bütçe Radarı (Money Tracking System)

Modern, yapay zeka destekli karar motoru ve canlı simülatörlere sahip **Kişisel Finans, Harcama Takibi ve Servet Yönetimi Uygulaması**.

🌐 **Canlı Demo (Canlı Web Sitesi):** [https://finans-radari-takip.netlify.app](https://finans-radari-takip.netlify.app)

---

## ✨ Öne Çıkan Özellikler

### 1. ⚡ Akıllı Doğal Dil Girişi (Smart Quick Input)
Form doldurmaya son! Tek satır yazıp Enter'a basarak harcama kaydedin:
- `dün akşam yemek 350 kart`
- `benzin 900`
- `maaş 55000 havale`

### 2. ⏳ "Param Ne Kadar Yeter?" İnteraktif Simülatörü (Runway Calculator)
- **"Günde X TL harcarsam param kaç gün yeter?"**: Anlık takvim bitiş tarihi simülasyonu.
- **Hedef Gün Limiti**: Bir sonraki maaşa veya hedef güne kadar günde en fazla kaç TL harcayabileceğinizi otomatik belirler.
- **Ay Sonu Kurtarma Planı**: Ayı eksiye düşmeden kapatmak için bugünden itibaren günlük tavan bütçe.

### 3. 🤖 "Bu Harcama Mantıklı mı?" Karar Robotu (AI Purchase Advisor)
Almayı düşündüğünüz bir şeyi (örn. *3.000 ₺'ye Oyun, Kulaklık*) yazın; robot bütçenizi, nakit oranınızı, runway kaybınızı ve çalışma saati karşılığını hesaplayıp net karar versin:
- 🟢 *Gönül Rahatlığıyla Alabilirsin!*
- 🟡 *Alabilirsin Ama Bütçeni Sıkmalısın!*
- 🔴 *Şu An Hiç Mantıklı Değil, Ertelemelisin!*

### 4. 🎯 Birikim Kumbarası & Hedefler (Savings Goals)
- Hayalini kurduğunuz şeyler için hedefler belirleyin (*iPhone 16 Pro, Yaz Tatili, Acil Fon*).
- Tek tıkla `+500 ₺`, `+1.000 ₺` ekleyin.
- Günlük tasarruf hızınıza göre hedefe tam kaç gün sonra ulaşacağınızı canlı görün.

### 5. 📺 Dijital Abonelikler (Subscriptions)
- **Hazır Şablonlar**: Netflix, Spotify, YouTube Premium, Apple (iCloud & Music), Amazon Prime, Disney+, ChatGPT Plus...
- Yaklaşan ödemeler için 7 günlük alarm bildirimi.
- Fatura günü tek tıkla ana bütçeye harcama olarak aktarma.

### 6. 💳 Kredi Kartı Ekstre & Nakit Kalkanı
- Bu ay kartla yapılan toplam borcu otomatik hesaplar.
- Nakit karşılama oranı ile kart borcunu tek seferde kapatma gücünüzü analiz eder.
- Hesap kesim ve son ödeme gününe kalan süre sayacı.

### 7. 🚨 Kategori Bütçe Limitleri & Aşım Radarı
- Kategorilere aylık tavan bütçeler koyun (*Market 9.000 ₺, Restoran 3.500 ₺*).
- %75'te sarı uyarı, limit aşıldığında kırmızı alarm.

### 8. 🏆 Spotify Wrapped Tarzı "Finansal Sağlık Karnesi"
- Ay sonu finansal disiplin notunuz (**A+ / A / B / C**).
- Şampiyon harcama kategorisi, ayın rekor faturası ve en masraflı gün analizi.

---

## 🛠 Kullanılan Teknolojiler

- **Frontend:** React 18, TypeScript, Vite
- **Stil & Tasarım:** Tailwind CSS, Lucide React Icons
- **Grafikler:** Chart.js, React-Chartjs-2
- **Depolama:** Tarayıcı Yerel Depolaması (LocalStorage) + JSON Yedek Al/Yükle
- **Canlı Dağıtım:** Netlify

---

## 🚀 Yerel Kurulum ve Çalıştırma

Projeyi kendi bilgisayarınızda çalıştırmak için:

```bash
# 1. Repoyu klonlayın
git clone https://github.com/arime10/money-tracking-system.git

# 2. Proje dizinine girin
cd money-tracking-system

# 3. Bağımlılıkları yükleyin
npm install

# 4. Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcınızda `http://localhost:3000` adresini açarak uygulamayı kullanmaya başlayabilirsiniz.
