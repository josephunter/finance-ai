import { Asset } from '@/types/asset';

export function useAssetIncomes(assets: Asset[]) {
  const activeAssets = assets.filter(asset => asset.status === 'active');

  const getTotalMonthlyIncome = () => {
    return activeAssets.reduce((total, asset) => {
      if (!asset.incomes) return total;
      
      return total + asset.incomes.reduce((assetTotal, income) => {
        if (income.status !== 'active') return assetTotal;
        const amount = income.masterCurrencyAmount;
        return assetTotal + (income.frequency === 'yearly' ? amount / 12 : amount);
      }, 0);
    }, 0);
  };

  const getTotalAccumulatedIncome = () => {
    return activeAssets.reduce((total, asset) => {
      if (!asset.incomes) return total;
      return total + asset.incomes.reduce((assetTotal, income) => {
        if (income.status !== 'active') return assetTotal;
        
        // Calculate accumulated income based on frequency and duration
        const startDate = new Date(income.startDate);
        const endDate = income.endDate ? new Date(income.endDate) : new Date();
        const monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                         (endDate.getMonth() - startDate.getMonth());
        
        const amount = income.masterCurrencyAmount;
        if (income.frequency === 'yearly') {
          return assetTotal + (amount * (monthsDiff / 12));
        }
        return assetTotal + (amount * monthsDiff);
      }, 0);
    }, 0);
  };

  return {
    getTotalMonthlyIncome,
    getTotalAccumulatedIncome,
  };
}