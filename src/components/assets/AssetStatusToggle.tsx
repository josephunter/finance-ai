import { Switch } from '@/components/ui/switch';
import { updateAsset } from '@/lib/services/asset-service';
import { Asset } from '@/types/asset';
import { useToast } from '@/hooks/use-toast';

interface AssetStatusToggleProps {
  asset: Asset;
  onStatusChange?: () => void;
}

export function AssetStatusToggle({ asset, onStatusChange }: AssetStatusToggleProps) {
  const { toast } = useToast();

  const handleStatusChange = async (checked: boolean) => {
    try {
      await updateAsset(asset.id, {
        status: checked ? 'active' : 'inactive'
      });
      
      toast({
        title: 'Asset Status Updated',
        description: `Asset is now ${checked ? 'active' : 'inactive'}`,
      });
      
      onStatusChange?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update asset status',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={asset.status === 'active'}
        onCheckedChange={handleStatusChange}
      />
      <span className="text-sm text-muted-foreground">
        {asset.status === 'active' ? 'Active' : 'Inactive'}
      </span>
    </div>
  );
}