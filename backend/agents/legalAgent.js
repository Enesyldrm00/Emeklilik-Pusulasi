const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `Sen Türkiye SGK mevzuatı uzmanısın. 5510 Sayılı Sosyal Sigortalar ve Genel Sağlık Sigortası Kanunu'na göre kullanıcının emeklilik durumunu analiz ediyorsun.

Analiz şunları içermeli:
1. Ne zaman emekli olabilir (kesin yaş ve tarih)
2. Kaç prim günü eksik/fazla
3. Borçlanma seçenekleri (askerlik, doğum, yurt dışı)
4. EYT kapsamına giriyor mu?
5. TES 2026 etkisi
6. Uyarılar ve riskler

Yanıtı geçerli JSON formatında ver:
{
  "retirementAge": number,
  "retirementDate": "YYYY",
  "primDayStatus": "eksik|yeterli|fazla",
  "primDayDifference": number,
  "borrowingOptions": ["askerlik borçlanması", "..."],
  "isEYT": boolean,
  "tesImpact": "TES hakkında açıklama",
  "warnings": ["uyarı 1", "..."],
  "legalBasis": "5510 sayılı Kanun Madde X"
}`;

async function analyze(data) {
  const { personalInfo, insuranceInfo, savingsInfo, calculatedBase } = data;

  const birthYear = new Date(personalInfo.birthDate).getFullYear();
  const currentYear = new Date().getFullYear();
  const currentAge = currentYear - birthYear;
  const insuranceStartYear = new Date(insuranceInfo.startDate).getFullYear();

  const userContext = `
Kullanıcı Bilgileri:
- Doğum tarihi: ${personalInfo.birthDate} (şu an ${currentAge} yaşında)
- Cinsiyet: ${personalInfo.gender === 'male' ? 'Erkek' : 'Kadın'}
- Şehir: ${personalInfo.city || 'Belirtilmedi'}

Sigorta Bilgileri:
- Sigorta türü: ${insuranceInfo.type} (${insuranceInfo.type === '4A' ? 'SSK - Özel Sektör' : insuranceInfo.type === '4B' ? 'Bağ-Kur - Esnaf/Serbest Meslek' : 'Emekli Sandığı - Devlet Memuru'})
- İlk sigorta tarihi: ${insuranceInfo.startDate} (${insuranceStartYear})
- Toplam prim günü: ${insuranceInfo.totalPrimDays}
- Aylık ortalama brüt maaş: ${insuranceInfo.averageMonthlyWage} TL
- Askerlik borçlanması: ${insuranceInfo.militaryService ? 'Evet' : 'Hayır'}
- Doğum borçlanması: ${insuranceInfo.maternityLeave ? 'Evet' : 'Hayır'}

Tasarruf Bilgileri:
- BES katılımı: ${savingsInfo.hasBES ? 'Evet' : 'Hayır'}
- TES'e dahil olacak: ${savingsInfo.joinTES ? 'Evet' : 'Hayır'}

Ön Hesaplama Sonuçları (sgkRules.js):
- Gerekli emeklilik yaşı: ${calculatedBase.retirementAge || 'EYT kapsamı — yaş şartı yok'}
- Gerekli prim günü: ${calculatedBase.requiredPrimDays}
- Prim günü farkı: ${calculatedBase.primDayDifference > 0 ? '+' + calculatedBase.primDayDifference + ' fazla' : calculatedBase.primDayDifference + ' eksik'}
- EYT kapsamı: ${calculatedBase.isEYT ? 'Evet' : 'Hayır'}`;

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      responseMimeType: 'application/json'
    }
  });

  const result = await model.generateContent(userContext);
  const text = result.response.text();

  try {
    return JSON.parse(text);
  } catch {
    // JSON parse başarısız olursa temizleyip tekrar dene
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  }
}

module.exports = { analyze };
