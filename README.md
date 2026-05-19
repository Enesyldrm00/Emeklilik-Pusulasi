# 🧭 Emeklilik Pusulası

> Türkiye'deki çalışanlara kişiselleştirilmiş emeklilik planı sunan, 3 aşamalı yapay zeka ajanı mimarisine sahip web uygulaması.

Emeklilik Pusulası; kullanıcının SGK bilgilerini, maaşını ve tasarruf durumunu alarak 5510 sayılı Kanun çerçevesinde hukuki analiz yapar, 3 farklı mali senaryo üretir ve öncelikli aksiyon planı oluşturur. Tüm bu süreç Gemini tabanlı 3 ajan tarafından sıralı olarak yürütülür.

---

## 🤖 Ajan Mimarisi

Uygulama **agentic** bir yapıya sahiptir: her ajan bir öncekinin çıktısını girdi olarak alır ve üzerine inşa eder.

```
[ Kullanıcı Formu ]
        │
        ▼
┌───────────────────────────────────────┐
│  AJAN 1 — Hukuki Analiz               │
│                                       │
│  5510 sayılı Kanun'a göre:            │
│  · Emeklilik yaşı ve tahmini tarihi   │
│  · Prim günü yeterliliği              │
│  · EYT kapsamına girip girmediği      │
│  · Askerlik / doğum borçlanma hakları │
│  · TES 2026'nın kullanıcıya etkisi    │
└──────────────────┬────────────────────┘
                   │ hukuki analiz sonucu
                   ▼
┌───────────────────────────────────────┐
│  AJAN 2 — Mali Hesaplama              │
│                                       │
│  Ajan 1 çıktısını kullanarak:         │
│  · Senaryo 1: En erken emeklilik      │
│  · Senaryo 2: 3-5 yıl daha çalışma   │
│  · Senaryo 3: Uzun çalışma + BES/TES │
│                                       │
│  Her senaryo için:                    │
│  · SGK maaşı (dönem formülüyle)       │
│  · BES birikimi (%20 devlet katkılı)  │
│  · TES geliri (brüt %3 + işveren %1) │
│  · Risk seviyesi ve yıllık gelir      │
└──────────────────┬────────────────────┘
                   │ hukuki + mali sonuç
                   ▼
┌───────────────────────────────────────┐
│  AJAN 3 — Kişisel Danışmanlık         │
│                                       │
│  Ajan 1 + 2 çıktısını kullanarak:    │
│  · Hangi senaryo önerilir ve neden    │
│  · TES'e katılmalı mı?               │
│  · BES'e aylık ne kadar yatırmalı?   │
│  · Öncelik sıralı aksiyon listesi     │
│  · Yaşam kalitesi tahmini            │
│    (İstanbul/Ankara maliyet referansı)│
└───────────────────────────────────────┘
                   │
                   ▼
        [ Sonuç Ekranı + PDF ]
```

---

## ✨ Ne Yapıyor?

Kullanıcı 3 adımlı formu doldurur (kişisel bilgiler → sigorta durumu → tasarruf tercihleri). Gönderim sonrasında 3 ajan sırayla çalışır ve sonuçlar tek bir dashboard'da gösterilir:

- **Emeklilik yaşı ve tarihi** — Hukuki minimum şartlara göre
- **Prim günü durumu** — Eksik/fazla, borçlanma seçenekleriyle birlikte
- **3 Karşılaştırmalı Senaryo** — Risk seviyesi, aylık gelir, artı/eksiler
- **Görsel Grafikler** — Maaş karşılaştırma (bar) ve emeklilik zaman çizelgesi (line)
- **Risk ve Yaşam Kalitesi Analizi** — Türkiye 2026 yaşam maliyetiyle kıyaslamalı
- **Aksiyon Planı** — TES, BES ve prim tamamlama önerileri
- **PDF Raporu** — Tüm analiz tek sayfada indirilebilir

---

## 🏗️ Teknoloji Stack

### Frontend
| | |
|---|---|
| React 18 + Vite | UI |
| Tailwind CSS | Stillendirme |
| Recharts | Grafikler |
| React Router | Yönlendirme |
| Axios | API iletişimi |
| jsPDF + jspdf-autotable | PDF üretimi |

### Backend
| | |
|---|---|
| Node.js + Express | REST API sunucusu |
| @google/generative-ai | Gemini SDK |
| helmet + express-rate-limit | Güvenlik |
| dotenv | Ortam değişkenleri |

### Yapay Zeka
| | |
|---|---|
| Model | Gemini 2.5 Flash |
| Mimari | Sequential agentic chain |
| Çıktı formatı | Structured JSON (responseMimeType) |

---

## 📊 SGK Hesaplama Temeli

Uygulamadaki formüller 5510 sayılı SSGSSK'dan hard-code edilmiştir — harici API kullanılmaz.

| Dönem | ABO Tabanı | Artış | Maksimum |
|-------|-----------|-------|----------|
| 2000 öncesi | %60 | Her 240 günde +%1 | %76 |
| 2000 – 2008 | %35 | Her 360 günde +%2 | %66 |
| 2008 sonrası | %50 | Her 360 günde +%2 | %90 |

**2026 sabit değerleri:**
- Güncelleme katsayısı: `1.3197`
- Minimum emekli maaşı: `20.000 TL`
- BES devlet katkısı: `%20`
- TES çalışan kesintisi: `Brüt maaşın %3'ü`

---

## ⚙️ Kurulum

### Gereksinimler
- Node.js 18+
- Gemini API anahtarı — [aistudio.google.com](https://aistudio.google.com)

### Backend

```bash
cd backend
npm install
```

`.env` dosyası oluştur:

```env
GEMINI_API_KEY=your_key_here
PORT=3001
FRONTEND_URL=http://localhost:5173
```

```bash
node server.js
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

`http://localhost:5173` adresinde açılır.

---

## 🗂️ Proje Yapısı

```
emeklilik-pusulasi/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Form/              # FormStep1, 2, 3
│       │   ├── Results/           # Dashboard, ScenarioCard, grafikler
│       │   ├── AgentProgress.jsx  # Ajan çalışma animasyonu
│       │   └── PDFExport.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Calculate.jsx
│       │   └── Results.jsx
│       └── utils/
│           └── sgkCalculator.js
│
└── backend/
    ├── agents/
    │   ├── legalAgent.js          # Ajan 1 — Hukuki analiz
    │   ├── financialAgent.js      # Ajan 2 — Mali hesaplama
    │   └── advisorAgent.js        # Ajan 3 — Danışmanlık
    ├── routes/
    │   └── calculate.js           # POST /api/calculate
    ├── utils/
    │   └── sgkRules.js            # SGK formülleri
    └── server.js
```

---

## ⚠️ Yasal Uyarı

Bu uygulama yalnızca **bilgilendirme amaçlıdır**. Hesaplamalar 2026 yılı başı itibarıyla yürürlükteki mevzuata dayanmaktadır. Kesin sonuçlar için SGK'ya veya yetkili bir mali müşavire başvurun.
