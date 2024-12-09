import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getHistoricalRate } from '@/lib/api/exchange';
import { createAsset } from '@/lib/services/asset-service';
import { useAuth } from '@/contexts/AuthContext';
import { useUserSettings } from '@/contexts/UserSettingsContext';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';
import { AssetForm, type AssetFormData } from './form/AssetForm';
import { cn } from '@/lib/utils';

interface AddAssetDialogProps {
  className?: string;
  onAssetAdded?: () => void;
}

export function AddAssetDialog({ className, onAssetAdded }: AddAssetDialogProps) {
  const [open, setOpen] = useState(false);
  const { settings } = useUserSettings();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (values: AssetFormData) => {
    if (!user || !settings.masterCurrency) return;
    
    try {
      setIsSubmitting(true);

      // Get historical exchange rate for the purchase date
      const masterCurrencyValue = await getHistoricalRate(
        values.purchaseDate,
        values.purchaseCurrency,
        settings.masterCurrency.code
      ) * parseFloat(values.purchaseValue);

      const assetId = await createAsset(user.uid, {
        name: values.name,
        type: values.type,
        purchaseDate: values.purchaseDate,
        purchaseValue: parseFloat(values.purchaseValue),
        purchaseCurrency: values.purchaseCurrency,
        masterCurrencyValue,
        description: values.description,
        status: 'active',
      });
      
      toast({
        title: 'Success',
        description: 'Asset has been added successfully',
      });
      
      setOpen(false);
      onAssetAdded?.();
    } catch (error) {
      console.error('Error adding asset:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add asset. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="default"
          className={cn(
            "flex items-center",
            "dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700",
            className
          )}
        >
          <Plus className="h-4 w-4" />
          <span className="ml-2">Add Asset</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Asset</DialogTitle>
        </DialogHeader>
        <AssetForm 
          onSubmit={onSubmit}
          submitLabel={isSubmitting ? 'Adding...' : 'Add Asset'}
        />
      </DialogContent>
    </Dialog>
  );
}