import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
import { X } from 'lucide-react';

export function CurrencySetupDialog() {
  const { settings, updateMasterCurrency } = useUserSettings();
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      const currency = CURRENCIES.find((c) => c.code === selectedCurrency);
      if (currency) {
        await updateMasterCurrency(currency);
        toast({
          title: 'Currency Set',
          description: `Your master currency has been set to ${currency.name}`,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to set currency',
        variant: 'destructive',
      });
    }
  };

  if (settings.masterCurrency) {
    return null;
  }

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogClose className="absolute right-4 top-4">
          <X className="h-4 w-4 text-gray-500 hover:text-gray-900 transition-colors" />
        </DialogClose>
        <DialogHeader>
          <DialogTitle>Select Your Master Currency</DialogTitle>
          <DialogDescription>
            Choose the main currency for tracking your assets. You can change this later.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <SelectTrigger>
              <SelectValue placeholder="Select a currency" />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.name} ({currency.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={!selectedCurrency}
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}