import { htsCodeTable, reciprocalTariffTable, section301TariffTable } from './tariff-data';
import type { TariffInput } from '@/types/tariff';

export interface TariffCalculationResult {
  customsValue: number;
  combinedTariffRate: number | string;
  dutyAmount: number | string;
  mpfFee: number;
  hmfFee: number;
  totalCost: number | string;
  breakdown: {
    baseDutyRate: number | string;
    globalBaselineTariff: number;
    reciprocalTariff: number;
    section301Tariff: number | string;
  };
}

export function calculateTariffs(input: TariffInput): TariffCalculationResult {
  // Calculate customs value (Total Landed Cost)
  const customsValue = input.declaredValue + input.shippingCosts + input.cargoInsurance;

  // Get base duty rate from HTS code
  const baseDutyRate = htsCodeTable[input.htsCode]?.baseDutyRate ?? "Not Found";

  // Global Baseline Tariff (10% except for Canada/Mexico)
  const globalBaselineTariff = (input.countryOrigin === 'Canada' || input.countryOrigin === 'Mexico') ? 0 : 0.10;

  // Reciprocal Tariff
  const reciprocalTariff = reciprocalTariffTable[input.countryOrigin] || 0;

  // Section 301 Tariff (only applies to China and specific HTS codes)
  let section301Tariff: number | string = 0;
  if (input.countryOrigin === 'China') {
    const section301Rate = section301TariffTable[input.htsCode];
    if (section301Rate !== undefined) {
      section301Tariff = section301Rate;
    } else if (baseDutyRate !== "Not Found") {
      section301Tariff = "Not Found";
    }
  }

  // Check if we can calculate rates
  if (baseDutyRate === "Not Found" || (input.countryOrigin === 'China' && section301Tariff === "Not Found")) {
    return {
      customsValue,
      combinedTariffRate: "Not Found",
      dutyAmount: "Not Found",
      mpfFee: 0,
      hmfFee: 0,
      totalCost: "Not Found",
      breakdown: {
        baseDutyRate,
        globalBaselineTariff,
        reciprocalTariff,
        section301Tariff,
      }
    };
  }

  // Total Combined Tariff Rate (only if all rates are found)
  // Following your example: 2.8% + 34% + 7.5% + 10% = 54.3% for China
  const combinedTariffRate = (baseDutyRate as number) + globalBaselineTariff + reciprocalTariff + (section301Tariff as number);

  // Total Tariff/Duty Cost
  const dutyAmount = customsValue * combinedTariffRate;

  // MPF Fee calculation
  const mpfRate = 0.003464; // 0.3464%
  let mpfFee = input.declaredValue * mpfRate;
  mpfFee = Math.max(32.71, Math.min(634.62, mpfFee)); // Min $32.71, Max $634.62

  // HMF Fee calculation (only for Sea Freight)
  const hmfFee = input.shippingMethod === 'Sea Freight' 
    ? input.declaredValue * 0.00125 // 0.125%
    : 0;

  // Total Estimated Cost
  const totalCost = customsValue + dutyAmount + mpfFee + hmfFee;

  return {
    customsValue,
    combinedTariffRate,
    dutyAmount,
    mpfFee,
    hmfFee,
    totalCost,
    breakdown: {
      baseDutyRate,
      globalBaselineTariff,
      reciprocalTariff,
      section301Tariff,
    }
  };
}

export function formatCurrency(amount: number | string): string {
  if (typeof amount === 'string') return amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercentage(rate: number | string): string {
  if (typeof rate === 'string') return rate;
  return `${(rate * 100).toFixed(2)}%`;
}

export function formatHTSCode(input: string): string {
  // Remove all non-digit characters
  const digits = input.replace(/\D/g, '');
  
  // Limit to 8 digits
  const limitedDigits = digits.substring(0, 8);
  
  // Format as ####.##.## when we have 8 digits
  if (limitedDigits.length === 8) {
    return limitedDigits.substring(0, 4) + '.' + limitedDigits.substring(4, 6) + '.' + limitedDigits.substring(6, 8);
  }
  
  // For less than 8 digits, show progress formatting
  if (limitedDigits.length >= 4) {
    let formatted = limitedDigits.substring(0, 4);
    if (limitedDigits.length > 4) {
      formatted += '.' + limitedDigits.substring(4, 6);
      if (limitedDigits.length > 6) {
        formatted += '.' + limitedDigits.substring(6);
      }
    }
    return formatted;
  }
  
  return limitedDigits;
}
