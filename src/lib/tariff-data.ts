export interface HTSCodeData {
  description: string;
  baseDutyRate: number;
}

export interface ReciprocalTariffData {
  [country: string]: number;
}

export interface Section301TariffData {
  [htsCode: string]: number;
}

// Import authentic data from converted TypeScript modules
import { htsCodeTable as htsCodesData } from '../data/hts-codes';
import { reciprocalTariffTable as reciprocalTariffsData } from '../data/reciprocal-tariffs';
import { section301TariffTable as section301TariffsData } from '../data/section301-tariffs';

export const htsCodeTable: { [code: string]: HTSCodeData } = htsCodesData;

export const reciprocalTariffTable: ReciprocalTariffData = reciprocalTariffsData;

export const section301TariffTable: Section301TariffData = section301TariffsData;

export const countries = Object.keys(reciprocalTariffsData).sort();