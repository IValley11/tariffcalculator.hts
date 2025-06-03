import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { countries } from '@/lib/tariff-data';
import { formatHTSCode } from '@/lib/tariff-calculations';
import { tariffInputSchema, type TariffInput } from '@/types/tariff';

interface TariffFormProps {
  onCalculate: (input: TariffInput) => void;
}

export function TariffForm({ onCalculate }: TariffFormProps) {
  const [showHTSTooltip, setShowHTSTooltip] = useState(false);

  const form = useForm<TariffInput>({
    resolver: zodResolver(tariffInputSchema),
    defaultValues: {
      htsCode: '',
      countryOrigin: '',
      declaredValue: 0,
      shippingMethod: 'Air Freight',
      shippingCosts: 0,
      cargoInsurance: 0,
    },
    mode: 'onChange'
  });

  const watchedValues = form.watch();

  useEffect(() => {
    // Auto-calculate when form values change and form is valid
    if (form.formState.isValid && watchedValues.htsCode && watchedValues.countryOrigin && watchedValues.declaredValue > 0) {
      onCalculate(watchedValues);
    }
  }, [watchedValues, form.formState.isValid, onCalculate]);

  const handleHTSCodeChange = (value: string) => {
    const formatted = formatHTSCode(value);
    form.setValue('htsCode', formatted, { shouldValidate: true });
  };

  const openHTSLookup = () => {
    window.open('https://hts.usitc.gov/', '_blank');
  };

  const handleSubmit = (data: TariffInput) => {
    onCalculate(data);
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-primary-foreground" style={{ background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 25%, #3b82f6 50%, #06b6d4 75%, #22d3ee 100%)' }}>
        <CardTitle className="text-lg md:text-xl">Duty Tariff Look up</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 md:space-y-6">
            {/* HTS Code Field */}
            <FormField
              control={form.control}
              name="htsCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-foreground">
                    HTS Code <span className="text-destructive">*</span>
                    <span className="text-xs text-muted-foreground font-normal ml-1">(must contain 8 digits)</span>
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter 8-digit HTS code"
                        maxLength={10}
                        className="pr-12"
                        onChange={(e) => handleHTSCodeChange(e.target.value)}
                        onFocus={() => setShowHTSTooltip(true)}
                        onBlur={() => setTimeout(() => setShowHTSTooltip(false), 200)}
                      />
                    </FormControl>
                    <Tooltip open={showHTSTooltip}>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-auto text-accent hover:text-primary"
                          onClick={openHTSLookup}
                        >
                          <Search className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-primary text-primary-foreground max-w-xs">
                        <p className="text-sm">
                          Please click on the magnifying glass to go to the "Harmonized Tariff Schedule" and look up your HTS code. The Code must be 8 numerical digits.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Country of Origin */}
            <FormField
              control={form.control}
              name="countryOrigin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-foreground">
                    Country of Origin <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Declared Value */}
            <FormField
              control={form.control}
              name="declaredValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-foreground">
                    Declared Value <span className="text-destructive">*</span>
                    <span className="text-xs text-muted-foreground font-normal ml-1">(USD)</span>
                  </FormLabel>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className="pl-8"
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Shipping Information Section */}
            <div className="border-t pt-4 md:pt-6">
              <h3 className="text-base md:text-lg font-semibold text-secondary mb-3 md:mb-4">Shipping Information:</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {/* Shipping Method */}
                <FormField
                  control={form.control}
                  name="shippingMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-foreground">
                        Shipping Method <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Air Freight">Air Freight</SelectItem>
                          <SelectItem value="Sea Freight">Sea Freight</SelectItem>
                          <SelectItem value="Land Transport">Land Transport</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Shipping Costs */}
                <FormField
                  control={form.control}
                  name="shippingCosts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-foreground">
                        Shipping Costs <span className="text-destructive">*</span>
                        <span className="text-xs text-muted-foreground font-normal ml-1">(USD)</span>
                      </FormLabel>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="0.00"
                            className="pl-8"
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9.]/g, '');
                              field.onChange(parseFloat(value) || 0);
                            }}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Cargo Insurance */}
            <FormField
              control={form.control}
              name="cargoInsurance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-foreground">
                    Cargo Insurance Costs <span className="text-destructive">*</span>
                    <span className="text-xs text-muted-foreground font-normal ml-1">(USD)</span>
                  </FormLabel>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="0.00"
                        className="pl-8"
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9.]/g, '');
                          field.onChange(parseFloat(value) || 0);
                        }}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Calculate Button */}
            <div className="pt-4 border-t">
              <Button 
                type="submit" 
                className="w-full bg-secondary hover:bg-primary text-secondary-foreground font-semibold py-2 md:py-3 text-base md:text-lg"
              >
                Calculate Tariffs & Duties
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
