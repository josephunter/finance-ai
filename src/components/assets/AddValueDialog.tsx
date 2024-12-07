import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Asset } from '@/types/asset';
import { getHistoricalRate } from '@/lib/api/exchange';
import { addAssetValue } from '@/lib/services/asset-value-service';
import { useUserSettings } from '@/contexts/UserSettingsContext';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle } from 'lucide-react';
import { ValueForm, type ValueFormData } from './form/ValueForm';

interface AddValueDialogProps {
  asset: Asset;
  onValueAdded?: () => void;
}

export function AddValueDialog({ asset, onValueAdded }: AddValueDialogProps) {
  const [open, setOpen] = useState(false);
  const { settings } = useUserSettings();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (values: ValueFormData) => {
    if (!settings.masterCurrency) return;

    try {
      setIsSubmitting(true);

      // Get historical exchange rate for the value date
      const masterCurrencyValue = await getHistoricalRate(
        values.date,
        values.currency,
        settings.masterCurrency.code
      ) * parseFloat(values.value);

      await addAssetValue({
        assetId: asset.id,
        date: values.date,
        value: parseFloat(values.value),
        currency: values.currency,
        masterCurrencyValue,
      });
      
      toast({
        title: 'Success',
        description: 'Asset value has been added successfully',
      });
      
      setOpen(false);
      onValueAdded?.();
    } catch (error) {
      console.error('Error adding asset value:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add asset value. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Value
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Current Value</DialogTitle>
        </DialogHeader>
        <ValueForm 
          defaultValues={{
            currency: asset.purchaseCurrency,
          }}
          onSubmit={onSubmit}
          submitLabel={isSubmitting ? 'Adding...' : 'Add Value'}
        />
      </DialogContent>
    </Dialog>
  );
}