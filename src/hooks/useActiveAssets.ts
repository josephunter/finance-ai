import { Asset } from '@/types/asset';

export function useActiveAssets(assets: Asset[]) {
  const activeAssets = assets.filter(asset => asset.status === 'active');

  const getTotalInitialValue = () => {
    return activeAssets.reduce((sum, asset) => sum + asset.masterCurrencyValue, 0);
  };

  const getTotalCurrentValue = () => {
    return activeAssets.reduce((sum, asset) => {
      const latestValue = asset.values?.[0]?.masterCurrencyValue || asset.masterCurrencyValue;
      return sum + latestValue;
    }, 0);
  };

  const getValueChange = () => {
    const initialValue = getTotalInitialValue();
    const currentValue = getTotalCurrentValue();
    const change = currentValue - initialValue;
    const percentageChange = initialValue > 0 
      ? ((currentValue - initialValue) / initialValue) * 100 
      : 0;

    return {
      absolute: change,
      percentage: percentageChange,
      isPositive: change >= 0,
    };
  };

  return {
    activeAssets,
    getTotalInitialValue,
    getTotalCurrentValue,
    getValueChange,
  };
}