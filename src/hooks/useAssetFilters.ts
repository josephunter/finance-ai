import { useState, useMemo } from 'react';
import { Asset } from '@/types/asset';

export function useAssetFilters(assets: Asset[]) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [type, setType] = useState('all');

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      // Search filter
      const matchesSearch = asset.name.toLowerCase().includes(search.toLowerCase()) ||
                          asset.description?.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;

      // Status filter
      if (status !== 'all' && asset.status !== status) return false;

      // Type filter
      if (type !== 'all' && asset.type !== type) return false;

      return true;
    });
  }, [assets, search, status, type]);

  return {
    search,
    setSearch,
    status,
    setStatus,
    type,
    setType,
    filteredAssets,
  };
}