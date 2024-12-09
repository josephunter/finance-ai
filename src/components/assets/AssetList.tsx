import { useState } from 'react';
import { Asset } from '@/types/asset';
import { AssetCard } from './AssetCard';
import { AssetTable } from './AssetTable';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';

type ViewMode = 'grid' | 'list';

interface AssetListProps {
  assets: Asset[];
  onDelete: (assetId: string) => void;
}

export function AssetList({ assets, onDelete }: AssetListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-2">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          size="icon"
          onClick={() => setViewMode('grid')}
          className="relative"
        >
          <LayoutGrid className="h-4 w-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="icon"
          onClick={() => setViewMode('list')}
          className="relative"
        >
          <List className="h-4 w-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </Button>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-6">
          {assets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <AssetTable
          assets={assets}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}