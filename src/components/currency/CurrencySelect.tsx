import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUserSettings } from '@/contexts/UserSettingsContext';
import { CURRENCIES } from '@/types/currency';
import { useToast } from '@/hooks/use-toast';

export function CurrencySelect() {
  const { settings, updateMasterCurrency } = useUserSettings();
  const { toast } = useToast();
  const [isChanging, setIsChanging] = useState(false);

  const handleCurrencyChange = async (currencyCode: string) => {
    setIsChanging(true);
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
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <Select
      value={settings.masterCurrency?.code}
      onValueChange={handleCurrencyChange}
      disabled={isChanging}
    >
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Select currency" />
      </SelectTrigger>
      <SelectContent>
        {CURRENCIES.map((currency) => (
          <SelectItem key={currency.code} value={currency.code}>
            {currency.symbol} {currency.code}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}