import { useState, useEffect } from 'react';
import { Currency } from '@/types/currency';
import { getInflationData, InflationData } from '@/lib/api/inflation';

export function useInflationData(currencyCode?: Currency['code']) {
  const [inflationData, setInflationData] = useState<InflationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadInflationData() {
      if (!currencyCode) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getInflationData(currencyCode);
        setInflationData(data);
        setError(null);
      } catch (error) {
        console.error('Error loading inflation data:', error);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    }

    loadInflationData();
  }, [currencyCode]);

  return { inflationData, loading, error };
}