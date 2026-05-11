const express = require('express');
const router = express.Router();
const sgkRules = require('../utils/sgkRules');
const legalAgent = require('../agents/legalAgent');
const financialAgent = require('../agents/financialAgent');
const advisorAgent = require('../agents/advisorAgent');

router.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

router.post('/calculate', async (req, res) => {
  try {
    const { personalInfo, insuranceInfo, savingsInfo } = req.body;

    if (!personalInfo || !insuranceInfo || !savingsInfo) {
      return res.status(400).json({ error: 'Eksik veri: personalInfo, insuranceInfo ve savingsInfo gerekli.' });
    }
    if (!personalInfo.birthDate || !personalInfo.gender) {
      return res.status(400).json({ error: 'Kişisel bilgiler eksik.' });
    }
    if (!insuranceInfo.type || !insuranceInfo.startDate || !insuranceInfo.totalPrimDays || !insuranceInfo.averageMonthlyWage) {
      return res.status(400).json({ error: 'Sigorta bilgileri eksik.' });
    }

    // 1. SGK kuralları ile ön hesaplama (API çağrısı yok)
    const calculatedBase = sgkRules.calculateRetirementAge(
      personalInfo.gender,
      insuranceInfo.type,
      insuranceInfo.startDate,
      insuranceInfo.totalPrimDays
    );

    const entryYear = new Date(insuranceInfo.startDate).getFullYear();
    const basePension = sgkRules.calculatePension(
      entryYear,
      insuranceInfo.totalPrimDays,
      insuranceInfo.averageMonthlyWage
    );

    calculatedBase.basePension = basePension;
    calculatedBase.borrowingOptions = sgkRules.getBorrowingOptions(
      personalInfo.gender,
      insuranceInfo.militaryService,
      insuranceInfo.maternityLeave
    );

    // 2. Ajan 1: Hukuki analiz
    const legalResult = await legalAgent.analyze({
      personalInfo,
      insuranceInfo,
      savingsInfo,
      calculatedBase
    });

    // 3. Ajan 2: Mali hesaplama (Ajan 1 çıktısını kullanır)
    const financialResult = await financialAgent.analyze({
      personalInfo,
      insuranceInfo,
      savingsInfo,
      legalAnalysis: legalResult
    });

    // 4. Ajan 3: Danışmanlık (Ajan 1 + 2 çıktısını kullanır)
    const advisorResult = await advisorAgent.analyze({
      personalInfo,
      insuranceInfo,
      savingsInfo,
      legalAnalysis: legalResult,
      financialAnalysis: financialResult
    });

    res.json({
      agent1: legalResult,
      agent2: financialResult,
      agent3: advisorResult,
      calculatedAt: new Date().toISOString()
    });

  } catch (err) {
    console.error('Hesaplama hatası:', err);
    if (err.message && err.message.includes('API_KEY')) {
      return res.status(500).json({ error: 'Gemini API anahtarı geçersiz veya eksik.' });
    }
    res.status(500).json({ error: 'Hesaplama sırasında hata oluştu. Lütfen tekrar deneyin.' });
  }
});

module.exports = router;
