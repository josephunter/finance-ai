import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AnalyticsContent } from '@/components/analytics/AnalyticsContent';
import { getAssets } from '@/lib/services/asset-service';
import { useAuth } from '@/contexts/AuthContext';
import { Asset } from '@/types/asset';
import { useToast } from '@/hooks/use-toast';

export default function Analytics() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAssets() {
      if (!user) return;
      try {
        const userAssets = await getAssets(user.uid);
        setAssets(userAssets);
      } catch (error) {
        console.error('Error loading assets:', error);
        toast({
          title: 'Error',
          description: 'Failed to load assets. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    loadAssets();
  }, [user, toast]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Comprehensive performance analysis of your assets"
      />
      <AnalyticsContent assets={assets} />
    </div>
  );
}