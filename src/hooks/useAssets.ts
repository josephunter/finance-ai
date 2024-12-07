import { useState, useEffect, useCallback } from 'react';
import { getUserAssets } from '@/lib/services/asset-service';
import { getAssetIncomes } from '@/lib/services/asset-income-service';
import { Asset } from '@/types/asset';

export function useAssets(userId: string | undefined) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadAssets = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const userAssets = await getUserAssets(userId);
      
      // Load incomes for each asset
      const assetsWithIncomes = await Promise.all(
        userAssets.map(async (asset) => {
          const incomes = await getAssetIncomes(asset.id);
          return { ...asset, incomes };
        })
      );
      
      setAssets(assetsWithIncomes);
      setError(null);
    } catch (error) {
      console.error('Error loading assets and incomes:', error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  const refreshAssets = useCallback(() => {
    loadAssets();
  }, [loadAssets]);

  return {
    assets,
    loading,
    error,
    refreshAssets,
  };
}