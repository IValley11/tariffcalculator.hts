import { z } from "zod";

export const tariffInputSchema = z.object({
  htsCode: z.string().min(8, "HTS Code must be 8 digits").regex(/^\d{4}\.\d{2}\.\d{2}$/, "HTS Code must be in format ####.##.##"),
  countryOrigin: z.string().min(1, "Country of origin is required"),
  declaredValue: z.number().min(0.01, "Declared value must be greater than 0"),
  shippingMethod: z.enum(["Air Freight", "Sea Freight", "Land Transport"]),
  shippingCosts: z.number().min(0, "Shipping costs must be 0 or greater"),
  cargoInsurance: z.number().min(0, "Cargo insurance must be 0 or greater"),
});

export type TariffInput = z.infer<typeof tariffInputSchema>;