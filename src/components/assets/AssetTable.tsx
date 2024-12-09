import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Asset, ASSET_TYPES } from '@/types/asset';
import { CURRENCIES } from '@/types/currency';
import { Pencil, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';
import { deleteAsset } from '@/lib/services/asset-service';
import { useToast } from '@/hooks/use-toast';
import { useUserSettings } from '@/contexts/UserSettingsContext';
import { EditAssetDialog } from './EditAssetDialog';

interface AssetTableProps {
  assets: Asset[];
  onDelete: (assetId: string) => void;
}

export function AssetTable({ assets, onDelete }: AssetTableProps) {
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const { toast } = useToast();
  const { settings } = useUserSettings();

  const handleDelete = async (assetId: string) => {
    try {
      await deleteAsset(assetId);
      onDelete(assetId);
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

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Purchase Info</TableHead>
            <TableHead>Latest Value</TableHead>
            <TableHead>Change</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => {
            const assetType = ASSET_TYPES.find(type => type.id === asset.type);
            const purchaseCurrency = CURRENCIES.find(c => c.code === asset.purchaseCurrency);
            const masterCurrency = CURRENCIES.find(c => c.code === settings.masterCurrency?.code);
            
            // Get latest value
            const latestValue = asset.values?.[0];
            
            // Calculate changes from initial value
            const valueChange = latestValue 
              ? latestValue.masterCurrencyValue - asset.masterCurrencyValue
              : 0;
            
            const percentageChange = latestValue
              ? ((latestValue.masterCurrencyValue - asset.masterCurrencyValue) / asset.masterCurrencyValue) * 100
              : 0;

            const isPositive = valueChange >= 0;
            const TrendIcon = isPositive ? TrendingUp : TrendingDown;
            const trendColor = isPositive ? 'text-green-500' : 'text-red-500';

            return (
              <TableRow key={asset.id}>
                <TableCell className="font-medium">{asset.name}</TableCell>
                <TableCell>{assetType?.name}</TableCell>
                <TableCell>
                  <div>
                    {purchaseCurrency?.symbol}
                    {asset.purchaseValue.toLocaleString()} 
                    {purchaseCurrency?.code}
                  </div>
                  <div className="text-xs text-gray-500">
                    {masterCurrency?.symbol}
                    {asset.masterCurrencyValue.toLocaleString()} 
                    {masterCurrency?.code}
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(new Date(asset.purchaseDate), 'PP')}
                  </div>
                </TableCell>
                <TableCell>
                  {latestValue ? (
                    <>
                      {masterCurrency?.symbol}
                      {latestValue.masterCurrencyValue.toLocaleString()} 
                      {masterCurrency?.code}
                      <div className="text-xs text-gray-500">
                        {format(new Date(latestValue.date), 'PP')}
                      </div>
                    </>
                  ) : (
                    <>
                      {masterCurrency?.symbol}
                      {asset.masterCurrencyValue.toLocaleString()} 
                      {masterCurrency?.code}
                      <div className="text-xs text-gray-500">
                        {format(new Date(asset.purchaseDate), 'PP')}
                      </div>
                    </>
                  )}
                </TableCell>
                <TableCell>
                  <div className={`flex items-center ${trendColor}`}>
                    <TrendIcon className="h-4 w-4 mr-1" />
                    <div className="flex flex-col">
                      <span>
                        {percentageChange >= 0 ? '+' : ''}
                        {percentageChange.toFixed(2)}%
                      </span>
                      <span className="text-xs">
                        {valueChange >= 0 ? '+' : ''}
                        {masterCurrency?.symbol}
                        {Math.abs(valueChange).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingAsset(asset)}
                  >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4">
                      <Pencil className="h-full w-full" />
                    </div>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4">
                          <Trash2 className="h-full w-full text-red-500" />
                        </div>
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
                        <AlertDialogAction onClick={() => handleDelete(asset.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <EditAssetDialog
        asset={editingAsset}
        open={!!editingAsset}
        onOpenChange={(open) => !open && setEditingAsset(null)}
      />
    </>
  );
}