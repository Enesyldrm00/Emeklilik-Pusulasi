const MINIMUM_PENSION_2026 = 20000;
const UPDATE_COEFFICIENT_2026 = 1.3197;
const BES_STATE_CONTRIBUTION_RATE = 0.20;
const TES_EMPLOYEE_RATE = 0.03;
const TES_EMPLOYER_RATE = 0.01;

function checkEYT(startDate) {
  const start = new Date(startDate);
  return start < new Date('1999-09-08');
}

function calculateRetirementAge(gender, insuranceType, startDate, primDays) {
  const start = new Date(startDate);
  const startYear = start.getFullYear();
  const isEYT = checkEYT(startDate);
  let retirementAge;
  let requiredPrimDays;

  if (insuranceType === '4A') {
    if (isEYT) {
      // EYT kapsamı — yaş şartı yok
      retirementAge = gender === 'female' ? 0 : 0;
      requiredPrimDays = gender === 'female' ? 5000 : 5000;
      // Sigortalılık süresi: Kadın 20 yıl, Erkek 25 yıl
      const requiredYears = gender === 'female' ? 20 : 25;
      const retirementYear = startYear + requiredYears;
      return {
        retirementAge: null,
        retirementYear,
        requiredPrimDays,
        isEYT: true,
        insuranceType,
        note: 'EYT kapsamı — yaş şartı yok'
      };
    } else if (startYear >= 1999 && startYear < 2008) {
      retirementAge = gender === 'female' ? 58 : 60;
      requiredPrimDays = 7000;
    } else {
      // 2008 sonrası
      retirementAge = gender === 'female' ? 58 : 60;
      requiredPrimDays = 7200;
    }
  } else if (insuranceType === '4B') {
    retirementAge = gender === 'female' ? 58 : 60;
    requiredPrimDays = 9000;
  } else if (insuranceType === '4C') {
    retirementAge = gender === 'female' ? 58 : 60;
    requiredPrimDays = 7200;
  } else {
    retirementAge = gender === 'female' ? 58 : 60;
    requiredPrimDays = 7200;
  }

  const currentYear = new Date().getFullYear();
  const birthYear = currentYear; // We don't know birthYear here, so retirementYear = current + difference
  // retirementYear = startYear + (retirementAge - age at start)
  // Simplified: we return the retirement age and required days
  return {
    retirementAge,
    requiredPrimDays,
    primDayDifference: primDays - requiredPrimDays,
    isEYT: false,
    insuranceType
  };
}

function calculatePension(entryYear, primDays, avgWage) {
  let abo;
  let pension;

  if (entryYear < 2000) {
    // 2000 öncesi formül
    abo = 0.60;
    const extraDays = Math.max(0, primDays - 5000);
    abo += Math.floor(extraDays / 240) * 0.01;
    abo = Math.min(abo, 0.76);
    pension = avgWage * abo * UPDATE_COEFFICIENT_2026;
  } else if (entryYear >= 2000 && entryYear < 2008) {
    // 2000-2008 formül
    abo = 0.35;
    const extraDays = Math.max(0, primDays - 5000);
    abo += Math.floor(extraDays / 360) * 0.02;
    abo = Math.min(abo, 0.66);
    pension = avgWage * abo * UPDATE_COEFFICIENT_2026;
  } else {
    // 2008 sonrası formül
    const yilSayisi = Math.floor(primDays / 360);
    abo = 0.50 + (yilSayisi * 0.02);
    abo = Math.min(abo, 0.90);
    pension = avgWage * abo * UPDATE_COEFFICIENT_2026;
  }

  return Math.max(Math.round(pension), MINIMUM_PENSION_2026);
}

function calculateBESIncome(monthlyContribution, yearsToRetirement) {
  if (!monthlyContribution || monthlyContribution <= 0) return 0;
  const annualContribution = monthlyContribution * 12;
  const stateContribution = Math.min(annualContribution * BES_STATE_CONTRIBUTION_RATE, 450 * 12); // 450 TL/ay tavan
  const totalAnnual = annualContribution + stateContribution;
  // Basit birikim (enflasyon hesaba katmadan, yaklaşık)
  const totalSavings = totalAnnual * yearsToRetirement;
  // Emeklilik ödemesi: toplam birikiminizin 120'e bölümü (10 yıl)
  return Math.round(totalSavings / 120);
}

function calculateTESDeduction(avgWage) {
  return Math.round(avgWage * TES_EMPLOYEE_RATE);
}

function getBorrowingOptions(gender, hasMilitary, hasMaternity) {
  const options = [];
  if (hasMilitary) {
    options.push('Askerlik borçlanması — sigorta giriş tarihini geriye çeker, prim günü ekler');
  }
  if (gender === 'female' && hasMaternity) {
    options.push('Doğum borçlanması — her doğum için max 2 yıl (720 gün) prim ekleme hakkı');
  }
  options.push('Yurt dışı borçlanması — yurt dışında çalışılan dönemler için');
  options.push('İsteğe bağlı sigorta — işsiz dönemlerde kendi kendine prim ödeme');
  return options;
}

module.exports = {
  calculateRetirementAge,
  calculatePension,
  calculateBESIncome,
  calculateTESDeduction,
  getBorrowingOptions,
  checkEYT,
  MINIMUM_PENSION_2026,
  UPDATE_COEFFICIENT_2026,
  BES_STATE_CONTRIBUTION_RATE,
  TES_EMPLOYEE_RATE,
  TES_EMPLOYER_RATE
};
