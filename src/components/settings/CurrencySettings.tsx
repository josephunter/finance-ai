import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserSettings } from '@/contexts/UserSettingsContext';
import { CURRENCIES } from '@/types/currency';
import { useToast } from '@/hooks/use-toast';

export function CurrencySettings() {
  const { settings, updateMasterCurrency } = useUserSettings();
  const { toast } = useToast();

  const handleCurrencyChange = async (currencyCode: string) => {
    try {
      const currency = CURRENCIES.find((c) => c.code === currencyCode);
      if (currency) {
        await updateMasterCurrency(currency);
        toast({
          title: 'Currency Updated',
          description: `Your master currency has been set to ${currency.name}`,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update currency',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Master Currency</CardTitle>
        <CardDescription>
          Set your preferred currency for asset tracking and calculations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Select
          value={settings.masterCurrency?.code}
          onValueChange={handleCurrencyChange}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            {CURRENCIES.map((currency) => (
              <SelectItem key={currency.code} value={currency.code}>
                {currency.symbol} {currency.name} ({currency.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}