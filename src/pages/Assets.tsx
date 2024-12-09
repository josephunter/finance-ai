import { useAuth } from '@/contexts/AuthContext';
import { useAssets } from '@/hooks/useAssets';
import { useAssetFilters } from '@/hooks/useAssetFilters';
import { AssetList } from '@/components/assets/AssetList';
import { AssetFilters } from '@/components/assets/AssetFilters';
import { AddAssetDialog } from '@/components/assets/AddAssetDialog';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PageHeader } from '@/components/ui/page-header';

export default function Assets() {
  const { user } = useAuth();
  const { assets, loading, error, refetch } = useAssets(user?.uid);
  const {
    search,
    setSearch,
    status,
    setStatus,
    type,
    setType,
    filteredAssets,
  } = useAssetFilters(assets);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="py-6">
        <div className="text-center text-red-500">
          <p>Error loading assets.</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <PageHeader
          title="Assets"
          description="Manage your assets and track their performance"
        />
        <AddAssetDialog onAssetAdded={refetch} />
      </div>

      <AssetFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        type={type}
        onTypeChange={setType}
      />

      <AssetList
        assets={filteredAssets}
        onDelete={refetch}
      />
    </div>
  );
}