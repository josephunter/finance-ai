import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Asset, ASSET_TYPES } from '@/types/asset';
import { CURRENCIES } from '@/types/currency';
import { convertAmount } from '@/lib/api/exchange';
import { addAssetIncome } from '@/lib/services/asset-income-service';
import { useUserSettings } from '@/contexts/UserSettingsContext';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle } from 'lucide-react';

const formSchema = z.object({
  type: z.string(),
  amount: z.string(),
  currency: z.string(),
  frequency: z.enum(['monthly', 'yearly']),
  startDate: z.string(),
  endDate: z.string().optional().nullable(),
});

interface AddIncomeDialogProps {
  asset: Asset;
  onIncomeAdded?: () => void;
}

export function AddIncomeDialog({ asset, onIncomeAdded }: AddIncomeDialogProps) {
  const [open, setOpen] = useState(false);
  const { settings } = useUserSettings();
  const { toast } = useToast();
  
  const assetType = ASSET_TYPES.find(type => type.id === asset.type);
  const incomeTypes = assetType?.incomeTypes || [];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: '',
      amount: '',
      currency: asset.purchaseCurrency,
      frequency: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
      endDate: null,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const masterCurrencyAmount = await convertAmount(
        parseFloat(values.amount),
        values.currency,
        settings.masterCurrency?.code || 'USD'
      );

      await addAssetIncome({
        assetId: asset.id,
        type: values.type,
        amount: parseFloat(values.amount),
        currency: values.currency,
        masterCurrencyAmount,
        frequency: values.frequency,
        startDate: values.startDate,
        endDate: values.endDate || null,
        status: 'active',
      });
      
      toast({
        title: 'Success',
        description: 'Income has been added successfully',
      });
      
      setOpen(false);
      form.reset();
      onIncomeAdded?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add income. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Income
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Income Stream</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Income Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select income type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {incomeTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CURRENCIES.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.symbol} {currency.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value || null);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full">Add Income</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}