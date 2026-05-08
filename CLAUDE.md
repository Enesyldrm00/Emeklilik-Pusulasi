# 🎯 RetireSmart TR — Claude Code Proje Dökümanı

> **Bu dosya Claude Code'a projenin tamamını anlatır.**
> Kod yazmadan önce bu dosyayı tamamen oku.

---

## 📌 PROJE ÖZETİ

**İsim:** RetireSmart TR  
**Tagline:** "Sadece ne zaman değil, ne yapmalısın da."  
**Amaç:** Türkiye'deki çalışanların emeklilik planlamasını yapan, 3 Gemini ajanıyla çalışan agentic web uygulaması.  
**Hedef Kullanıcı:** 25-55 yaş arası Türkiye'de çalışan herkes (45M+ potansiyel)  
**Hackathon:** BTK Hackathon 2026 — Finans teması  
**Süre:** 8-19 Mayıs 2026 (10 gün)

---

## 🏗️ TEKNOLOJİ STACKİ

### Frontend
```
- React 18 (Vite ile)
- Tailwind CSS (styling)
- Recharts (grafikler — emeklilik timeline, senaryo karşılaştırması)
- React Router (sayfa yönlendirme)
- Axios (API çağrıları)
- jsPDF (PDF export)
```

### Backend
```
- Node.js + Express
- @google/generative-ai (Gemini SDK)
- cors, dotenv, helmet
- express-rate-limit (API abuse koruması)
```

### Deploy
```
- Frontend: Vercel (ücretsiz)
- Backend: Render veya Railway (ücretsiz tier)
- Domain: retiresmart-tr.vercel.app
```

### AI
```
- Model: gemini-2.0-flash (hız için)
- Kullanım: 3 ayrı ajan, sequential çağrı
- API Key: .env dosyasında GEMINI_API_KEY
```

---

## 📁 KLASÖR YAPISI

```
retiresmart-tr/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Form/
│   │   │   │   ├── UserInputForm.jsx      # Ana form
│   │   │   │   ├── FormStep1.jsx          # Kişisel bilgiler
│   │   │   │   ├── FormStep2.jsx          # Sigorta bilgileri
│   │   │   │   └── FormStep3.jsx          # Tasarruf bilgileri
│   │   │   ├── Results/
│   │   │   │   ├── ResultsDashboard.jsx   # Ana sonuç sayfası
│   │   │   │   ├── ScenarioCard.jsx       # 3 senaryo kartı
│   │   │   │   ├── RetirementTimeline.jsx # Zaman çizelgesi grafiği
│   │   │   │   ├── PensionChart.jsx       # Maaş karşılaştırma grafiği
│   │   │   │   ├── RiskMatrix.jsx         # Risk analizi
│   │   │   │   └── ActionPlan.jsx         # Aksiyon planı
│   │   │   ├── AgentProgress.jsx          # 3 ajanın çalışma animasyonu
│   │   │   ├── PDFExport.jsx             # PDF indirme
│   │   │   └── Header.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Calculate.jsx
│   │   │   └── Results.jsx
│   │   ├── utils/
│   │   │   └── sgkCalculator.js           # SGK hesaplama motoru (hard-coded)
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── routes/
│   │   └── calculate.js                   # Ana hesaplama endpoint
│   ├── agents/
│   │   ├── legalAgent.js                  # Ajan 1: Hukuki analiz
│   │   ├── financialAgent.js              # Ajan 2: Mali hesaplama
│   │   └── advisorAgent.js                # Ajan 3: Danışmanlık
│   ├── utils/
│   │   └── sgkRules.js                    # SGK kuralları (sabit veriler)
│   ├── server.js
│   └── package.json
│
├── RETIRESMART_PROJECT.md                 # Bu dosya
└── README.md
```

---

## 🔄 UYGULAMA AKIŞI

```
1. KULLANICI FORMU DOLDURUR
   ├── Step 1: Kişisel (yaş, cinsiyet, doğum tarihi)
   ├── Step 2: Sigorta (4A/4B/4C, giriş tarihi, prim günü, ortalama maaş)
   └── Step 3: Tasarruf (BES var mı?, aylık ne kadar?, TES'e dahil mi?)

2. BACKEND'E GÖNDERİR (POST /api/calculate)

3. 3 AJAN SIRAYLA ÇALIŞIR
   ├── Ajan 1 (Hukuki): "Emeklilik yaşın X, prim günün Y eksik/fazla, borçlanma seçeneklerin şunlar"
   ├── Ajan 2 (Mali): "3 senaryo: Şimdi=15K TL, 3 yıl sonra=18K TL, BES ile=25K TL"
   └── Ajan 3 (Danışman): "Senaryo 2 öneriyorum çünkü... TES'e katıl çünkü..."

4. FRONTEND SONUÇLARI GÖSTERIR
   ├── Timeline grafiği (emeklilik yolculuğu)
   ├── 3 senaryo kartları (karşılaştırmalı)
   ├── Risk matrisi
   ├── Aksiyon planı listesi
   └── PDF export butonu
```

---

## 🤖 3 AJAN DETAYI

### AJAN 1: Hukuki Analiz Ajanı
**Dosya:** `backend/agents/legalAgent.js`  
**Görevi:** SGK mevzuatını uygular, emeklilik hakkını analiz eder

**System Prompt:**
```
Sen Türkiye SGK mevzuatı uzmanısın. 5510 Sayılı Sosyal Sigortalar ve Genel Sağlık Sigortası Kanunu'na göre kullanıcının emeklilik durumunu analiz ediyorsun. 

Analiz şunları içermeli:
1. Ne zaman emekli olabilir (kesin yaş ve tarih)
2. Kaç prim günü eksik/fazla
3. Borçlanma seçenekleri (askerlik, doğum, yurt dışı)
4. EYT kapsamına giriyor mu?
5. TES 2026 etkisi
6. Uyarılar ve riskler

Yanıtı JSON formatında ver:
{
  "retirementAge": number,
  "retirementDate": "YYYY",
  "primDayStatus": "eksik|yeterli|fazla",
  "primDayDifference": number,
  "borrowingOptions": ["askerlik borçlanması", ...],
  "isEYT": boolean,
  "tesImpact": string,
  "warnings": [string],
  "legalBasis": "5510 sayılı Kanun Madde X"
}
```

---

### AJAN 2: Mali Hesaplama Ajanı
**Dosya:** `backend/agents/financialAgent.js`  
**Görevi:** 3 farklı emeklilik senaryosu üretir

**System Prompt:**
```
Sen emeklilik mali planlaması uzmanısın. Kullanıcının verilerini ve Ajan 1'in hukuki analizini kullanarak 3 farklı senaryo üret.

SGK Formülleri (bunları kullan):
- 2000 öncesi: Gösterge × ABO × Katsayı (ABO: ilk 5000 gün için %60, her 240 günde +%1, max %76)
- 2000-2008: Ortalama Kazanç × ABO × Güncelleme Katsayısı (ABO: ilk 5000 gün için %35, her 360 günde +%2, max %66)
- 2008 sonrası: Ortalama Kazanç × ABO (her 360 gün için %2, taban %50, max %90)
- 2026 Güncelleme Katsayısı: 1.3197
- Minimum Emekli Maaşı 2026: 20.000 TL

BES Devlet Katkısı: %20 (yıllık brüt asgari ücretin %3'ü tavan)
TES Kesinti: Brüt maaşın %3'ü (çalışan) + %1 (işveren)

3 Senaryo:
- SENARYO 1: En erken emeklilik (hukuki minimum)
- SENARYO 2: 3-5 yıl daha çalışma
- SENARYO 3: Uzun çalışma + BES/TES optimizasyonu

Yanıtı JSON formatında ver:
{
  "scenarios": [
    {
      "id": 1,
      "name": "Erken Emeklilik",
      "retirementAge": number,
      "retirementYear": number,
      "monthlyPension": {
        "sgk": number,
        "bes": number,
        "tes": number,
        "total": number
      },
      "annualIncome": number,
      "pros": [string],
      "cons": [string],
      "riskLevel": "düşük|orta|yüksek"
    }
  ],
  "recommendedScenario": 1|2|3,
  "projections": {
    "inflationAdjusted": number,
    "purchasingPower2040": number
  }
}
```

---

### AJAN 3: Danışmanlık Ajanı
**Dosya:** `backend/agents/advisorAgent.js`  
**Görevi:** Kişiye özel tavsiye, aksiyon planı ve TES analizi

**System Prompt:**
```
Sen kişisel finans danışmanısın. Ajan 1'in hukuki ve Ajan 2'nin mali analizini kullanarak kullanıcıya Türkçe, anlaşılır, kişisel tavsiye veriyorsun.

Tavsiyeler şunları içermeli:
1. Hangi senaryo önerilir ve neden
2. TES'e katılmalı mı? (2026'da başlıyor, brüt maaştan %3 kesinti)
3. BES'e aylık ne kadar yatırmalı?
4. Prim günü tamamlama önerileri
5. Acil aksiyon listesi (öncelikli sıraya göre)
6. Yaşam kalitesi tahmini (Türkiye'deki yaşam maliyetiyle karşılaştır)

Türkiye 2026 yaşam maliyeti referans:
- Ankara/İstanbul tek kişi aylık min: 15.000 TL
- İkisi birlikte: 22.000 TL
- Rahat yaşam: 30.000 TL+

Yanıtı JSON formatında ver:
{
  "recommendation": "Senaryo X öneriyoruz çünkü...",
  "tesSuggestion": {
    "shouldJoin": boolean,
    "reason": string,
    "monthlyDeduction": number
  },
  "besSuggestion": {
    "monthlyAmount": number,
    "reason": string,
    "stateContribution": number
  },
  "actionPlan": [
    { "priority": 1, "action": string, "deadline": string, "impact": string }
  ],
  "lifeQuality": {
    "scenario1": "yetersiz|yeterli|rahat|konforlu",
    "scenario2": "yetersiz|yeterli|rahat|konforlu",
    "scenario3": "yetersiz|yeterli|rahat|konforlu"
  },
  "motivationalMessage": string
}
```

---

## 📊 SGK HESAPLAMA KURALLARI (HARD-CODED)

Bu kurallar 5510 sayılı Kanun'dan alınmıştır. API'ye gerek yok, bunları kod içinde uygula.

### EMEKLİLİK YAŞ ŞARTLARI

#### 4A (SSK - Özel Sektör İşçisi)

**1999 ÖNCESİ GİRİŞ (EYT Kapsamı):**
- Yaş şartı YOK
- Kadın: 20 yıl sigortalılık + 5000-5975 prim günü (kademeli)
- Erkek: 25 yıl sigortalılık + 5000-5975 prim günü (kademeli)

**1999-2008 ARASI GİRİŞ:**
- Kadın: 58 yaş + 7000 gün VEYA 25 yıl sigortalılık + 4500 gün + 58 yaş
- Erkek: 60 yaş + 7000 gün VEYA 25 yıl sigortalılık + 4500 gün + 60 yaş

**2008 SONRASI GİRİŞ:**
- Kadın: 58 yaş + 7200 gün (2036'ya kadar, sonra kademeli 65'e çıkar)
- Erkek: 60 yaş + 7200 gün (2036'ya kadar, sonra kademeli 65'e çıkar)
- 2036-2048 arası: Her yıl 1 yaş artış (max 65)

#### 4B (Bağ-Kur - Esnaf/Serbest Meslek)
- Kadın: 58 yaş + 9000 gün
- Erkek: 60 yaş + 9000 gün
- 4A'dan 5 yıl daha fazla prim gerekiyor

#### 4C (Emekli Sandığı - Devlet Memuru)
- Erkek: 60 yaş + 7200 gün (veya 25 yıl hizmet)
- Kadın: 58 yaş + 7200 gün

### EMEKLİ MAAŞI HESAPLAMA FORMÜLLERI

#### 2000 Öncesi Dönem
```javascript
// ABO hesabı
let abo = 0.60; // Taban %60
const extraDays = Math.max(0, primGun - 5000);
abo += Math.floor(extraDays / 240) * 0.01;
abo = Math.min(abo, 0.76); // Max %76

// Maaş
const maas = ortalamaKazanc * abo * 1.3197; // 2026 katsayısı
```

#### 2000-2008 Arası Dönem
```javascript
let abo = 0.35; // Taban %35
const extraDays = Math.max(0, primGun - 5000);
abo += Math.floor(extraDays / 360) * 0.02;
abo = Math.min(abo, 0.66); // Max %66

const maas = ortalamaKazanc * abo * 1.3197;
```

#### 2008 Sonrası Dönem
```javascript
const yilSayisi = Math.floor(primGun / 360);
let abo = 0.50 + (yilSayisi * 0.02); // Her yıl +%2
abo = Math.min(abo, 0.90); // Max %90

const maas = ortalamaKazanc * abo * 1.3197;
```

#### Minimum Maaş Kontrolü
```javascript
const MINIMUM_PENSION_2026 = 20000; // TL
const finalMaas = Math.max(hesaplananMaas, MINIMUM_PENSION_2026);
```

### BES (BİREYSEL EMEKLİLİK SİSTEMİ)
- Devlet katkısı: Ödenen tutarın **%20'si**
- Tavan: Yıllık brüt asgari ücretin **%3'ü** (~5400 TL/yıl = 450 TL/ay)
- Min 10 yıl + 56 yaş şartı ile BES'ten emekli olunur
- Vergi avantajı: Katkıların %15'i vergiden düşülür

### TES (TAMAMLAYICI EMEKLİLİK SİSTEMİ) — 2026 YENİLİĞİ
- **Ne zaman başlıyor:** 2026 yılının 2. yarısı (planlandı)
- **Kimler dahil:** Özel sektör çalışanları (4A) — zorunlu
- **Kesinti:** Brüt maaşın **%3'ü** (çalışan) + **%1** (işveren)
- **Devlet katkısı:** Başlangıçta belirsiz
- **Çıkış:** En az 10 yıl + kadın 58, erkek 60 yaş
- **Kısmi çıkış:** Evlilik, işsizlik, ilk konut, ağır hastalıkta (%10-20)
- **OKS'tan farklı:** Zorunlu, çıkamazsın
- **Mevcut OKS:** Otomatik TES'e geçer
- **Önemli:** Sisteme girmeden önce çıkmak isteyenler 2026 bitmeden OKS'tan çıkmalı

### BORÇLANMA SEÇENEKLERİ
```
1. Askerlik Borçlanması
   - Sigortalı olmadan önce askerlik yapanlar prim günü ekleyebilir
   - Sigorta giriş tarihini geriye çeker
   - Hesaplama: Günlük Prim × Askerlik Günü

2. Doğum Borçlanması (Kadınlar)
   - Sigortalı olduktan sonra her doğum için max 2 yıl
   - Çalışmayan dönem sigortadan sayılır

3. Yurt Dışı Borçlanması
   - Yurt dışında çalışılan her gün için borçlanma yapılabilir
   - Sigorta giriş tarihini geriye çekebilir

4. İsteğe Bağlı Sigorta
   - İşsiz dönemlerde kendi kendine prim ödeme
   - Günlük prim: Asgari × belirli oran
```

---

## 🎨 FRONTEND - KULLANICI DENEYİMİ

### Sayfa 1: Home (/)
```
- Hero section: "Emekliliğin için doğru planı yap"
- 3 özellik kartı: Hukuki Analiz, 3 Senaryo, Aksiyon Planı
- "Hesaplamayı Başlat" CTA butonu
- Güven işaretleri: "SGK 5510 Kanunu'na göre", "Ücretsiz", "Veri saklanmaz"
```

### Sayfa 2: Calculate (/calculate)
```
STEP 1 - Kişisel Bilgiler:
  - Doğum tarihi (date picker)
  - Cinsiyet (Kadın/Erkek radio)
  - Şehir (dropdown — yaşam maliyeti için)

STEP 2 - Sigorta Bilgileri:
  - Sigorta türü (4A SSK / 4B Bağ-Kur / 4C Memur)
  - İlk sigorta giriş tarihi (date picker)
  - Toplam prim gün sayısı (number input)
    → Yardım tooltip: "e-Devlet'ten öğrenebilirsiniz"
  - Aylık ortalama brüt maaş (number input)
  - Askerlik borçlanması yaptın mı? (boolean)
  - Doğum borçlanması yaptın mı? (boolean, sadece kadınlarda)

STEP 3 - Tasarruf Bilgileri:
  - BES'e katılıyor musun? (boolean)
  - BES aylık katkı (number, BES=true ise)
  - TES'e dahil olacak mısın? (boolean, açıklama ile)
  - Ek birikim/yatırım var mı? (number, opsiyonel)
  - Hedef emeklilik yaşı (slider, 50-70)

FORM VALIDASYON:
  - Prim günü: 0-15000 arası
  - Maaş: 0 olamaz
  - Sigorta tarihi: Bugünden önce olmalı
  - Yaş: 18-70 arası
```

### Sayfa 3: Results (/results)
```
LOADING STATE (AgentProgress.jsx):
  ████░░░░ Ajan 1: Hukuki durum analiz ediliyor...
  ████████ Ajan 2: 3 senaryo hesaplanıyor...
  ████████ Ajan 3: Kişisel tavsiye oluşturuluyor...

RESULTS LAYOUT:
  ┌─────────────────────────────────────┐
  │  EMEKLİLİK DURUMUN                  │
  │  58 yaşında emekli olabilirsin      │
  │  Tahmini: 2047                      │
  └─────────────────────────────────────┘
  
  ┌──────────┐ ┌──────────┐ ┌──────────┐
  │SENARYO 1 │ │SENARYO 2 │ │SENARYO 3 │
  │Erken     │ │Dengeli ⭐│ │Optimal   │
  │15.000 TL │ │18.500 TL │ │25.000 TL │
  └──────────┘ └──────────┘ └──────────┘
  
  [Zaman Çizelgesi Grafiği - Recharts]
  [Maaş Karşılaştırma Bar Chart]
  [Risk Matrisi]
  [Aksiyon Planı Listesi]
  [PDF İndir Butonu]
```

---

## 🔗 API ENDPOINTLERİ

### POST /api/calculate
```json
Request:
{
  "personalInfo": {
    "birthDate": "1985-03-15",
    "gender": "male",
    "city": "Ankara"
  },
  "insuranceInfo": {
    "type": "4A",
    "startDate": "2005-06-01",
    "totalPrimDays": 6500,
    "averageMonthlyWage": 12000,
    "militaryService": false,
    "maternityLeave": false
  },
  "savingsInfo": {
    "hasBES": true,
    "besMonthlyContribution": 500,
    "joinTES": true,
    "extraSavings": 0,
    "targetRetirementAge": 60
  }
}

Response:
{
  "agent1": { /* Hukuki analiz */ },
  "agent2": { /* 3 senaryo */ },
  "agent3": { /* Tavsiye + aksiyon planı */ },
  "calculatedAt": "2026-05-13T10:00:00Z"
}
```

### GET /api/health
```json
{ "status": "ok", "version": "1.0.0" }
```

---

## ⚙️ ENVIRONMENT VARIABLES

```env
# backend/.env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

## 🚀 KURULUM VE ÇALIŞTIRMA

```bash
# Backend
cd backend
npm install
cp .env.example .env
# .env'e GEMINI_API_KEY ekle
node server.js

# Frontend (ayrı terminal)
cd frontend
npm install
npm run dev

# Build
cd frontend && npm run build
```

---

## 🎯 HACKATHON KRİTERLERİ — NASIL KARŞILIYORUZ?

### ✅ Gemini Zorunluluğu
- 3 ajanın hepsi Gemini API kullanıyor
- Model: gemini-2.0-flash
- Her ajan için ayrı system prompt

### ✅ Agentic Yapı (BONUS PUAN)
- Ajan 1 → Ajan 2 → Ajan 3 sequential chain
- Her ajan bir öncekinin çıktısını kullanıyor
- Kendi kendine karar veren yapı

### ✅ Finans Teması
- SGK emeklilik sistemi
- BES/TES finansal planlama
- 3 senaryo mali analizi

### ✅ Sıfırdan Geliştirme (8-19 Mayıs)
- İlk commit: 8 Mayıs 2026
- Public GitHub repo

### ✅ Teslim Materyalleri
- GitHub repo (public)
- Kısa açıklama
- 1 dakika demo video
- Canlı link (Vercel)

---

## 📋 GELİŞTİRME TAKVİMİ

```
Gün 1-2 (8-9 Mayıs):
  ✓ Proje kurulumu (Vite + Express)
  ✓ SGK hesaplama motoru (sgkRules.js)
  ✓ Form UI (3 step)
  ✓ Gemini bağlantısı test

Gün 3-4 (10-11 Mayıs):
  ✓ 3 Ajan entegrasyonu
  ✓ Results dashboard
  ✓ Recharts grafikler

Gün 5-6 (12-13 Mayıs):
  ✓ PDF export
  ✓ Mobile responsive
  ✓ Bug fix

Gün 7-8 (14-15 Mayıs):
  ✓ Vercel/Render deploy
  ✓ Test senaryoları
  ✓ Edge case'ler

Gün 9 (16 Mayıs):
  ✓ Demo video çekimi
  ✓ GitHub README
  ✓ Son bug fix

Gün 10 (17-19 Mayıs):
  ✓ Buffer / Son düzeltmeler
  ✓ Teslim
```

---

## 📚 YASAL REFERANSLAR

Kodda kullanılan kuralların kaynakları:

1. **5510 Sayılı SSGSSK** — Ana emeklilik kanunu
   - https://www.mevzuat.gov.tr/MevzuatMetin/1.5.5510.pdf

2. **SGK Resmi Emeklilik Tablosu**
   - https://www.sgk.gov.tr/Content/Post/785eac3b...

3. **TES (Tamamlayıcı Emeklilik Sistemi) 2026**
   - Yürürlük: 2026 2. yarısı
   - Kaynak: Orta Vadeli Program 2026

4. **BES Devlet Katkısı**
   - %20 devlet katkısı
   - Kaynak: 4632 Sayılı BES Kanunu

5. **2026 Güncelleme Katsayısı: 1.3197**
   - Kaynak: TÜFE %30.89 + GSYH %3.6'nın %30'u

6. **Minimum Emekli Maaşı 2026: 20.000 TL**
   - Kaynak: Ocak 2026 yasal düzenleme

---

## ⚠️ ÖNEMLİ NOTLAR

1. **Yasal Uyarı:** Uygulama bilgilendirme amaçlıdır. Kesin sonuçlar için SGK'ya başvurun.

2. **Veri Gizliliği:** Kullanıcı verileri backend'de saklanmaz. Her istek stateless.

3. **Doğruluk:** 2026 Ocak itibariyle geçerli mevzuata göre hesaplanır. Mevzuat değişirse güncelleme gerekir.

4. **Demo için Test Senaryosu:**
   ```
   - Doğum: 1985
   - Cinsiyet: Erkek
   - Sigorta: 4A (SSK)
   - Giriş: 2005-01-01
   - Prim: 6500 gün
   - Maaş: 12.000 TL
   - BES: Evet, 500 TL/ay
   - TES: Evet
   Beklenen: ~2045'te emekli, 3 senaryo, Senaryo 2 önerisi
   ```

5. **Jüriye söylenecek:** "SGK API'si mevcut değil. Formülleri 5510 sayılı Kanun'dan hard-code ettik. e-Devlet'te kontrol edilebilir."

---

## 🏆 PROJE BAŞARISI İÇİN KRİTİK NOKTALAR

1. **Demo akışı sorunsuz çalışmalı** — Test senaryosunu her zaman çalıştır
2. **3 ajan görünür olmalı** — Loading state'te hangi ajan çalışıyor göster
3. **Grafikler etkileyici olmalı** — Recharts ile güzel timeline
4. **PDF export çalışmalı** — Jüri PDF'i indirebilmeli
5. **Mobile responsive** — Jüri telefonda test edebilmeli
6. **Deploy çalışır durumda** — Vercel link her zaman aktif

---

*Son güncelleme: 13 Mayıs 2026*
*Geliştirici: [Senin adın]*
*Hackathon: BTK 2026*
