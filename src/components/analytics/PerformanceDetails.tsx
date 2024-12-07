import { useState } from 'react';
import { Asset } from '@/types/asset';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';
import { AssetPerformanceTable } from './AssetPerformanceTable';
import { AssetPerformanceGrid } from './AssetPerformanceGrid';

interface PerformanceDetailsProps {
  assets: Asset[];
}

export function PerformanceDetails({ assets }: PerformanceDetailsProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Asset Performance</CardTitle>
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('table')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === 'table' ? (
          <AssetPerformanceTable assets={assets} />
        ) : (
          <AssetPerformanceGrid assets={assets} />
        )}
      </CardContent>
    </Card>
  );
}