const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `Sen emeklilik mali planlaması uzmanısın. Kullanıcının verilerini ve Ajan 1'in hukuki analizini kullanarak 3 farklı senaryo üret.

SGK Formülleri:
- 2000 öncesi: Ortalama Kazanç × ABO × 1.3197 (ABO: taban %60, her 240 günde +%1, max %76)
- 2000-2008: Ortalama Kazanç × ABO × 1.3197 (ABO: taban %35, her 360 günde +%2, max %66)
- 2008 sonrası: Ortalama Kazanç × ABO × 1.3197 (ABO: her 360 gün için %2, taban %50, max %90)
- 2026 Güncelleme Katsayısı: 1.3197
- Minimum Emekli Maaşı 2026: 20.000 TL

BES Devlet Katkısı: %20 (yıllık tavan: 5400 TL)
TES Kesinti: Brüt maaşın %3'ü (çalışan) + %1 (işveren)

3 Senaryo üret:
- SENARYO 1: En erken emeklilik (hukuki minimum şartları karşılandığında)
- SENARYO 2: 3-5 yıl daha çalışma (daha yüksek maaş)
- SENARYO 3: Uzun çalışma + BES/TES optimizasyonu (maksimum birikim)

Yanıtı geçerli JSON formatında ver:
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
      "pros": ["artı 1", "..."],
      "cons": ["eksi 1", "..."],
      "riskLevel": "düşük|orta|yüksek"
    },
    { "id": 2, "name": "Dengeli Plan", "..." },
    { "id": 3, "name": "Optimal Birikim", "..." }
  ],
  "recommendedScenario": 1,
  "projections": {
    "inflationAdjusted": number,
    "purchasingPower2040": number
  }
}`;

async function analyze(data) {
  const { personalInfo, insuranceInfo, savingsInfo, legalAnalysis } = data;

  const birthYear = new Date(personalInfo.birthDate).getFullYear();
  const currentYear = new Date().getFullYear();
  const currentAge = currentYear - birthYear;
  const insuranceStartYear = new Date(insuranceInfo.startDate).getFullYear();

  const userContext = `
Kullanıcı Bilgileri:
- Doğum yılı: ${birthYear} (şu an ${currentAge} yaşında)
- Cinsiyet: ${personalInfo.gender === 'male' ? 'Erkek' : 'Kadın'}
- Sigorta türü: ${insuranceInfo.type}
- Sigorta başlangıç yılı: ${insuranceStartYear}
- Mevcut prim günü: ${insuranceInfo.totalPrimDays}
- Aylık ortalama brüt maaş: ${insuranceInfo.averageMonthlyWage} TL

Tasarruf Bilgileri:
- BES: ${savingsInfo.hasBES ? 'Evet, aylık ' + savingsInfo.besMonthlyContribution + ' TL' : 'Hayır'}
- TES: ${savingsInfo.joinTES ? 'Evet (brüt maaşın %3\'ü = ' + Math.round(insuranceInfo.averageMonthlyWage * 0.03) + ' TL/ay)' : 'Hayır'}
- Hedef emeklilik yaşı: ${savingsInfo.targetRetirementAge || 'Belirtilmedi'}
- Ek birikim: ${savingsInfo.extraSavings ? savingsInfo.extraSavings + ' TL' : 'Yok'}

Ajan 1 Hukuki Analiz:
- Emeklilik yaşı: ${legalAnalysis.retirementAge}
- Emeklilik tarihi: ${legalAnalysis.retirementDate}
- Prim günü durumu: ${legalAnalysis.primDayStatus} (${legalAnalysis.primDayDifference} gün)
- EYT kapsamı: ${legalAnalysis.isEYT ? 'Evet' : 'Hayır'}
- TES etkisi: ${legalAnalysis.tesImpact}

Güncel yıl: ${currentYear}
3 farklı emeklilik senaryosu için TL cinsinden gerçekçi hesaplamalar yap.`;

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
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  }
}

module.exports = { analyze };
