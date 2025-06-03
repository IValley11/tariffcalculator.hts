import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatPercentage, type TariffCalculationResult } from '@/lib/tariff-calculations';

interface ResultsPanelProps {
  results: TariffCalculationResult | null;
}

export function ResultsPanel({ results }: ResultsPanelProps) {
  if (!results) {
    return (
      <Card className="w-full md:sticky md:top-8">
        <CardHeader className="bg-accent text-accent-foreground">
          <CardTitle className="text-lg md:text-xl">Quick Results</CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="space-y-3 md:space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-xs md:text-sm font-medium text-muted-foreground">Customs Value:</span>
              <span className="text-base md:text-lg font-semibold text-foreground">$0.00</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-xs md:text-sm font-medium text-muted-foreground">Total Combined Duty Tariff Rate:</span>
              <span className="text-base md:text-lg font-semibold text-foreground">0.00%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-xs md:text-sm font-medium text-muted-foreground">Duty/(Tariff) amount (USD):</span>
              <span className="text-base md:text-lg font-semibold text-foreground">$0.00</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-xs md:text-sm font-medium text-muted-foreground">MPF Fee:</span>
              <span className="text-base md:text-lg font-semibold text-foreground">$0.00</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-xs md:text-sm font-medium text-muted-foreground">HMF Fee:</span>
              <span className="text-base md:text-lg font-semibold text-foreground">$0.00</span>
            </div>
            <div className="bg-secondary text-secondary-foreground p-3 md:p-4 rounded-lg mt-4 md:mt-6">
              <div className="flex justify-between items-center">
                <span className="text-base md:text-lg font-semibold">Total Estimated Cost:</span>
                <span className="text-xl md:text-2xl font-bold">$0.00</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full md:sticky md:top-8">
      <CardHeader className="bg-accent text-accent-foreground">
        <CardTitle className="text-lg md:text-xl">Quick Results</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="space-y-3 md:space-y-4">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-xs md:text-sm font-medium text-muted-foreground">Customs Value:</span>
            <span className="text-base md:text-lg font-semibold text-foreground">{formatCurrency(results.customsValue)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-xs md:text-sm font-medium text-muted-foreground">Total Combined Duty Tariff Rate:</span>
            <span className="text-base md:text-lg font-semibold text-foreground">{formatPercentage(results.combinedTariffRate)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-xs md:text-sm font-medium text-muted-foreground">Duty/(Tariff) amount (USD):</span>
            <span className="text-base md:text-lg font-semibold text-foreground">{formatCurrency(results.dutyAmount)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-xs md:text-sm font-medium text-muted-foreground">MPF Fee:</span>
            <span className="text-base md:text-lg font-semibold text-foreground">{formatCurrency(results.mpfFee)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-xs md:text-sm font-medium text-muted-foreground">HMF Fee:</span>
            <span className="text-base md:text-lg font-semibold text-foreground">{formatCurrency(results.hmfFee)}</span>
          </div>
          <div className="bg-secondary text-secondary-foreground p-3 md:p-4 rounded-lg mt-4 md:mt-6">
            <div className="flex justify-between items-center">
              <span className="text-base md:text-lg font-semibold">Total Estimated Cost:</span>
              <span className="text-xl md:text-2xl font-bold">{formatCurrency(results.totalCost)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
