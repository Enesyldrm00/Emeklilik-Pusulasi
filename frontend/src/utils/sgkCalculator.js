export const MINIMUM_PENSION_2026 = 20000;
export const UPDATE_COEFFICIENT_2026 = 1.3197;
export const BES_STATE_CONTRIBUTION_RATE = 0.20;
export const TES_EMPLOYEE_RATE = 0.03;

export function calculatePension(entryYear, primDays, avgWage) {
  let abo;
  if (entryYear < 2000) {
    abo = 0.60;
    const extraDays = Math.max(0, primDays - 5000);
    abo += Math.floor(extraDays / 240) * 0.01;
    abo = Math.min(abo, 0.76);
  } else if (entryYear < 2008) {
    abo = 0.35;
    const extraDays = Math.max(0, primDays - 5000);
    abo += Math.floor(extraDays / 360) * 0.02;
    abo = Math.min(abo, 0.66);
  } else {
    const yilSayisi = Math.floor(primDays / 360);
    abo = 0.50 + (yilSayisi * 0.02);
    abo = Math.min(abo, 0.90);
  }
  return Math.max(Math.round(avgWage * abo * UPDATE_COEFFICIENT_2026), MINIMUM_PENSION_2026);
}

export function formatTL(amount) {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(amount);
}

export function getRetirementYear(birthDate, retirementAge) {
  const birthYear = new Date(birthDate).getFullYear();
  return birthYear + retirementAge;
}
