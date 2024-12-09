import { useState, useEffect } from 'react';
import { getAssets } from '@/lib/services/asset-service';
import { Asset } from '@/types/asset';

interface UseAssetsReturn {
  assets: Asset[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useAssets(userId: string | undefined): UseAssetsReturn {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAssets = async () => {
    if (!userId) {
      setAssets([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getAssets(userId);
      setAssets(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch assets'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [userId]);

  return {
    assets,
    loading,
    error,
    refetch: fetchAssets
  };
}