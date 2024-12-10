import { useToast } from '@/hooks/use-toast';
import { Asset } from '@/types/asset';
import { updateAsset } from '@/lib/services/asset-service';

interface AssetStatusToggleProps {
  asset: Asset;
  onStatusChange?: () => void;
}

export function AssetStatusToggle({ asset, onStatusChange }: AssetStatusToggleProps) {
  const { toast } = useToast();
  const isActive = asset.status === 'active';

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
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={isActive}
        onClick={() => handleStatusChange(!isActive)}
        className={`
          relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 
          focus-visible:ring-white focus-visible:ring-opacity-75
          ${isActive ? 'bg-green-500' : 'bg-gray-300'}
        `}
      >
        <span className="sr-only">
          {isActive ? 'Deactivate' : 'Activate'}
        </span>
        <span
          aria-hidden="true"
          className={`
            pointer-events-none inline-block h-6 w-6 transform rounded-full 
            bg-white shadow-lg ring-0 transition duration-200 ease-in-out
            ${isActive ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>
      <span className="text-sm font-medium text-gray-700">
        {isActive ? 'Active' : 'Inactive'}
      </span>
    </div>
  );
}