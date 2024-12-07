import { useAuth } from '@/contexts/AuthContext';
import { useAssets } from '@/hooks/useAssets';
import { useAssetFilters } from '@/hooks/useAssetFilters';
import { AssetList } from '@/components/assets/AssetList';
import { AssetFilters } from '@/components/assets/AssetFilters';
import { AddAssetDialog } from '@/components/assets/AddAssetDialog';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function Assets() {
  const { user } = useAuth();
  const { assets, loading, error, refreshAssets } = useAssets(user?.uid);
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
    <div className="py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Assets</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your assets and track their performance
          </p>
        </div>
        <AddAssetDialog onAssetAdded={refreshAssets} />
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
        onDelete={refreshAssets}
      />
    </div>
  );
}