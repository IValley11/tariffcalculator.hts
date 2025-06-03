import { useState } from 'react';
import { TariffForm } from '@/components/tariff-form';
import { ResultsPanel } from '@/components/results-panel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateTariffs, formatCurrency, formatPercentage, type TariffCalculationResult } from '@/lib/tariff-calculations';
import type { TariffInput } from '@/types/tariff';

export default function TariffCalculator() {
  const [results, setResults] = useState<TariffCalculationResult | null>(null);

  const handleCalculate = (input: TariffInput) => {
    const calculationResults = calculateTariffs(input);
    setResults(calculationResults);
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="py-4 md:py-6 px-4" style={{ background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 25%, #3b82f6 50%, #06b6d4 75%, #22d3ee 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl lg:text-3xl font-bold text-white" style={{ fontFamily: 'Arial, sans-serif' }}>Tariff/Duty Calculator</h1>
          <p className="text-white/90 mt-1 text-lg md:text-xl font-medium italic" style={{ fontFamily: 'Arial, sans-serif' }}>"Know your costs before you import."</p>
          <div className="mt-3 p-3 border border-white/30 bg-white/10 rounded-md">
            <p className="text-white text-sm md:text-base" style={{ fontFamily: 'Arial, sans-serif' }}>
              <span className="font-bold">Special Note:</span> Tariff Rates are based on rates published on The Harmonized Tariff Schedule by the USITC as of <span className="font-bold">5/25/2025</span>.
            </p>
          </div>
          <p className="text-white/70 mt-2 text-sm" style={{ fontFamily: 'Arial, sans-serif' }}>
            Brought to you by{' '}
            <a 
              href="https://www.swift.cpa" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-white/90 underline"
            >
              www.Swift.CPA
            </a>
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Calculator Form */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            <TariffForm onCalculate={handleCalculate} />
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-1">
            <ResultsPanel results={results} />
          </div>
        </div>

        {/* Detailed Calculation Breakdown - Full Width */}
        <div className="mt-6 md:mt-8">
          <Card>
            <CardHeader className="text-background" style={{ background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 30%, #374151 70%, #1f2937 100%)' }}>
              <CardTitle className="text-lg md:text-xl">Detailed Calculation Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              {results ? (
                <div className="space-y-6">
                  {/* Tariff Rate Breakdown with Visual Indicators */}
                  <div>
                    <h4 className="font-semibold text-secondary mb-4 text-base">Tariff Rate Components Calculation:</h4>
                    <div className="space-y-3">
                      {/* Base Duty Rate */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border-l-4 border-blue-500">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium text-blue-700 dark:text-blue-300">Base Duty Rate</span>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">From HTS Code classification</p>
                          </div>
                          <span className="font-semibold text-blue-700 dark:text-blue-300 text-lg">
                            {formatPercentage(results.breakdown.baseDutyRate)}
                          </span>
                        </div>
                      </div>

                      {/* Plus Symbol */}
                      <div className="flex justify-center">
                        <span className="text-2xl font-bold text-muted-foreground">+</span>
                      </div>

                      {/* Reciprocal Tariff */}
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border-l-4 border-orange-500">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium text-orange-700 dark:text-orange-300">Reciprocal Tariff</span>
                            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Based on country of origin</p>
                          </div>
                          <span className="font-semibold text-orange-700 dark:text-orange-300 text-lg">
                            {formatPercentage(results.breakdown.reciprocalTariff)}
                          </span>
                        </div>
                      </div>

                      {/* Plus Symbol */}
                      {results.breakdown.section301Tariff !== 0 && (
                        <>
                          <div className="flex justify-center">
                            <span className="text-2xl font-bold text-muted-foreground">+</span>
                          </div>

                          {/* Section 301 Tariff */}
                          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border-l-4 border-red-500">
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-medium text-red-700 dark:text-red-300">Section 301 Tariff</span>
                                <p className="text-xs text-red-600 dark:text-red-400 mt-1">Additional tariff for China</p>
                              </div>
                              <span className="font-semibold text-red-700 dark:text-red-300 text-lg">
                                {formatPercentage(results.breakdown.section301Tariff)}
                              </span>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Plus Symbol */}
                      {results.breakdown.globalBaselineTariff !== 0 && (
                        <>
                          <div className="flex justify-center">
                            <span className="text-2xl font-bold text-muted-foreground">+</span>
                          </div>

                          {/* Global Baseline Tariff */}
                          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border-l-4 border-purple-500">
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-medium text-purple-700 dark:text-purple-300">Global Baseline Tariff</span>
                                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Standard 10% (not Canada/Mexico)</p>
                              </div>
                              <span className="font-semibold text-purple-700 dark:text-purple-300 text-lg">
                                {formatPercentage(results.breakdown.globalBaselineTariff)}
                              </span>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Equals Symbol */}
                      <div className="flex justify-center">
                        <span className="text-2xl font-bold text-muted-foreground">=</span>
                      </div>

                      {/* Combined Rate */}
                      <div className="bg-secondary p-4 rounded-lg border-2 border-secondary">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-secondary-foreground text-lg">Total Combined Tariff Rate:</span>
                          <span className="font-bold text-secondary-foreground text-2xl">
                            {formatPercentage(results.combinedTariffRate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cost Breakdown */}
                  <div className="border-t pt-6">
                    <h4 className="font-semibold text-secondary mb-4 text-base">Cost Breakdown:</h4>
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-green-700 dark:text-green-300">Customs Value:</span>
                            <span className="font-semibold text-green-700 dark:text-green-300">{formatCurrency(results.customsValue)}</span>
                          </div>
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1">Declared Value + Shipping + Insurance</p>
                        </div>
                        
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-amber-700 dark:text-amber-300">Duty Amount:</span>
                            <span className="font-semibold text-amber-700 dark:text-amber-300">{formatCurrency(results.dutyAmount)}</span>
                          </div>
                          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Customs Value × Combined Tariff Rate</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="bg-slate-50 dark:bg-slate-900/20 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-slate-700 dark:text-slate-300">MPF Fee:</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(results.mpfFee)}</span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Merchandise Processing Fee (0.3464%)</p>
                        </div>
                        
                        <div className="bg-cyan-50 dark:bg-cyan-900/20 p-3 rounded-lg border border-cyan-200 dark:border-cyan-800">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-cyan-700 dark:text-cyan-300">HMF Fee:</span>
                            <span className="font-semibold text-cyan-700 dark:text-cyan-300">{formatCurrency(results.hmfFee)}</span>
                          </div>
                          <p className="text-xs text-cyan-600 dark:text-cyan-400 mt-1">Harbor Maintenance Fee (0.125% for sea freight)</p>
                        </div>
                      </div>
                    </div>

                    {/* Total Cost Summary */}
                    <div className="mt-4 bg-primary text-primary-foreground p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xl">Total Estimated Cost:</span>
                        <span className="font-bold text-2xl">{formatCurrency(results.totalCost)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted-foreground italic">
                  Enter values above to see detailed calculations
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Disclaimer Section */}
        <div className="mt-6 md:mt-8 bg-destructive/10 border-l-4 border-destructive p-4 md:p-6 rounded-r-lg">
          <h3 className="text-lg font-bold text-destructive mb-4">Disclaimer</h3>
          <div className="text-destructive space-y-3 text-sm leading-relaxed">
            <p>
              This publication and calculator is provided for general information purposes and does not constitute legal, tax or other professional advice from Swift.CPA, Accounting Business Optimization LLC, or its subsidiaries and its affiliates, and it is not intended as a substitute for obtaining advice from a financial advisor or any other professional.
            </p>
            
            <p>
              This calculator provides estimates only. Final import duties and fees may vary based on actual customs valuation and current regulations. Always consult with licensed customs brokers or trade professionals for official determinations.
            </p>
            
            <p>
              <strong>Special Note:</strong> This calculator does not include the following duties in its calculation. Please research independently of this calculator if these additional duties apply to the product you are assessing:
            </p>
            
            <ul className="list-disc pl-6 space-y-1">
              <li>Section 232 Duties (National Security Tariffs) – applies to certain steel and aluminum products</li>
              <li>Section 201 Safeguard Duties</li>
              <li>Anti-Dumping Duties (ADD)</li>
              <li>Countervailing Duties (CVD)</li>
            </ul>
            
            <p>
              The calculator also does not consider tariff calculations for countries of origin without a NTR status such as North Korea, Cuba, Russia and Belarus.
            </p>
            
            <p>
              This calculator does not account or provide calculations for any countries with special or free trade agreements with the United States.
            </p>
            
            <p>
              <strong>Important:</strong> This calculator does not calculate all HTS codes. When the tariff of an HTS code cannot be calculated the calculator will state the rate as "Not Found."
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
