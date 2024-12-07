import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Asset, ASSET_TYPES } from '@/types/asset';
import { CURRENCIES } from '@/types/currency';
import { Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { deleteAsset } from '@/lib/services/asset-service';
import { useToast } from '@/hooks/use-toast';
import { useUserSettings } from '@/contexts/UserSettingsContext';
import { EditAssetDialog } from './EditAssetDialog';
import { AddValueDialog } from './AddValueDialog';
import { AssetValueHistory } from './AssetValueHistory';
import { AssetValueAnalytics } from './AssetValueAnalytics';
import { AssetIncomeHistory } from './AssetIncomeHistory';
import { AssetStatusToggle } from './AssetStatusToggle';
import { getAssetValues } from '@/lib/services/asset-value-service';
import { cn } from '@/lib/utils';

interface AssetCardProps {
  asset: Asset;
  onDelete: (assetId: string) => void;
  onStatusChange?: () => void;
}

export function AssetCard({ asset, onDelete, onStatusChange }: AssetCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();
  const { settings } = useUserSettings();

  const assetType = ASSET_TYPES.find(type => type.id === asset.type);
  const currency = CURRENCIES.find(c => c.code === asset.purchaseCurrency);
  const masterCurrency = CURRENCIES.find(c => c.code === settings.masterCurrency?.code);

  useEffect(() => {
    loadValues();
  }, [asset.id]);

  const loadValues = async () => {
    try {
      const assetValues = await getAssetValues(asset.id);
      setValues(assetValues);
    } catch (error) {
      console.error('Error loading asset values:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAsset(asset.id);
      onDelete(asset.id);
      toast({
        title: 'Asset Deleted',
        description: 'The asset has been successfully deleted.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete the asset. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleValueAdded = () => {
    loadValues();
  };

  const handleValueDeleted = () => {
    loadValues();
  };

  return (
    <>
      <Card className={cn(
        "w-full transition-opacity duration-200",
        asset.status === 'inactive' && "opacity-60"
      )}>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{asset.name}</h3>
                <p className="text-sm text-gray-500">{assetType?.name}</p>
                <p className="text-sm">{asset.description}</p>
              </div>
              <AssetStatusToggle asset={asset} onStatusChange={onStatusChange} />
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500">Purchase Date</p>
                <p>{format(new Date(asset.purchaseDate), 'PP')}</p>
              </div>
              <div>
                <p className="text-gray-500">Purchase Value</p>
                <p>{currency?.symbol}{asset.purchaseValue.toLocaleString()} {currency?.code}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {masterCurrency?.symbol}{asset.masterCurrencyValue.toLocaleString()} {masterCurrency?.code}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
              </div>
            ) : (
              <>
                <AssetValueHistory 
                  values={values} 
                  asset={asset} 
                  onValueDeleted={handleValueDeleted}
                />
                <AssetIncomeHistory asset={asset} />
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-center"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-2" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-2" />
                      Show More
                    </>
                  )}
                </Button>
                <div className={cn(
                  "grid transition-all",
                  isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}>
                  <div className="overflow-hidden">
                    <AssetValueAnalytics asset={asset} values={values} />
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <AddValueDialog asset={asset} onValueAdded={handleValueAdded} />
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Asset</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this asset? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardFooter>
      </Card>

      <EditAssetDialog
        asset={asset}
        open={isEditing}
        onOpenChange={setIsEditing}
        onAssetUpdated={loadValues}
      />
    </>
  );
}