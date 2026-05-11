const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `Sen kişisel finans danışmanısın. Ajan 1'in hukuki ve Ajan 2'nin mali analizini kullanarak kullanıcıya Türkçe, anlaşılır, kişisel tavsiye veriyorsun.

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

Yanıtı geçerli JSON formatında ver:
{
  "recommendation": "Senaryo X öneriyoruz çünkü...",
  "tesSuggestion": {
    "shouldJoin": boolean,
    "reason": "açıklama",
    "monthlyDeduction": number
  },
  "besSuggestion": {
    "monthlyAmount": number,
    "reason": "açıklama",
    "stateContribution": number
  },
  "actionPlan": [
    { "priority": 1, "action": "yapılacak iş", "deadline": "ne zamana kadar", "impact": "etki açıklaması" }
  ],
  "lifeQuality": {
    "scenario1": "yetersiz|yeterli|rahat|konforlu",
    "scenario2": "yetersiz|yeterli|rahat|konforlu",
    "scenario3": "yetersiz|yeterli|rahat|konforlu"
  },
  "motivationalMessage": "teşvik edici mesaj"
}`;

async function analyze(data) {
  const { personalInfo, insuranceInfo, savingsInfo, legalAnalysis, financialAnalysis } = data;

  const birthYear = new Date(personalInfo.birthDate).getFullYear();
  const currentYear = new Date().getFullYear();
  const currentAge = currentYear - birthYear;

  const userContext = `
Kullanıcı Profili:
- Yaş: ${currentAge}, Cinsiyet: ${personalInfo.gender === 'male' ? 'Erkek' : 'Kadın'}, Şehir: ${personalInfo.city || 'Belirtilmedi'}
- Sigorta: ${insuranceInfo.type}, Maaş: ${insuranceInfo.averageMonthlyWage} TL/ay
- BES: ${savingsInfo.hasBES ? 'Evet (' + savingsInfo.besMonthlyContribution + ' TL/ay)' : 'Hayır'}
- TES tercih: ${savingsInfo.joinTES ? 'Evet' : 'Hayır'}

Ajan 1 Hukuki Sonuçlar:
${JSON.stringify(legalAnalysis, null, 2)}

Ajan 2 Mali Senaryolar:
${JSON.stringify(financialAnalysis, null, 2)}

Bu verilere dayanarak kişiselleştirilmiş, uygulanabilir tavsiyeler ver.
Özellikle TES 2026'nın bu kullanıcı için anlamını açıkla.
Aksiyon planını öncelik sırasına göre listele (en önemli önce).`;

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
