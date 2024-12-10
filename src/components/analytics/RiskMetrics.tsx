import React, { useMemo } from 'react';
import { Asset } from '../../types/asset';
import { Shield, AlertTriangle, TrendingUp } from 'lucide-react';
import { useCurrency } from '../../contexts/CurrencyContext';

interface RiskMetricsProps {
  assets: Asset[];
}

const RiskMetrics: React.FC<RiskMetricsProps> = ({ assets }) => {
  const { masterCurrency } = useCurrency();

  const metrics = useMemo(() => {
    const totalValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
    
    // Calculate concentration risk (percentage of largest asset)
    const largestAsset = assets.reduce((max, asset) => 
      asset.currentValue > max.currentValue ? asset : max
    , { currentValue: 0 });
    const concentrationRisk = (largestAsset.currentValue / totalValue) * 100;

    // Calculate diversification score (number of different asset types)
    const assetTypes = new Set(assets.map(asset => asset.type));
    const diversificationScore = (assetTypes.size / 11) * 100; // 11 is total number of asset types

    // Calculate volatility (standard deviation of returns)
    const returns = assets.map(asset => 
      ((asset.currentValue - asset.masterCurrencyValue) / asset.masterCurrencyValue) * 100
    );
    const meanReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - meanReturn, 2), 0) / returns.length;
    const volatility = Math.sqrt(variance);

    return {
      concentrationRisk,
      diversificationScore,
      volatility
    };
  }, [assets]);

  const getRiskLevel = (value: number, type: 'concentration' | 'diversification' | 'volatility') => {
    switch (type) {
      case 'concentration':
        if (value <= 20) return 'Low';
        if (value <= 40) return 'Medium';
        return 'High';
      case 'diversification':
        if (value >= 70) return 'High';
        if (value >= 40) return 'Medium';
        return 'Low';
      case 'volatility':
        if (value <= 10) return 'Low';
        if (value <= 20) return 'Medium';
        return 'High';
      default:
        return 'Unknown';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low':
        return 'text-green-600 dark:text-green-400';
      case 'Medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'High':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Risk Analysis</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Concentration Risk</h4>
            </div>
            <span className={`text-sm font-medium ${getRiskColor(getRiskLevel(metrics.concentrationRisk, 'concentration'))}`}>
              {getRiskLevel(metrics.concentrationRisk, 'concentration')}
            </span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {metrics.concentrationRisk.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Largest single asset exposure
          </p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-blue-500 mr-2" />
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Diversification Score</h4>
            </div>
            <span className={`text-sm font-medium ${getRiskColor(getRiskLevel(metrics.diversificationScore, 'diversification'))}`}>
              {getRiskLevel(metrics.diversificationScore, 'diversification')}
            </span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {metrics.diversificationScore.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Portfolio diversification level
          </p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-purple-500 mr-2" />
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Portfolio Volatility</h4>
            </div>
            <span className={`text-sm font-medium ${getRiskColor(getRiskLevel(metrics.volatility, 'volatility'))}`}>
              {getRiskLevel(metrics.volatility, 'volatility')}
            </span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {metrics.volatility.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Return volatility
          </p>
        </div>
      </div>
    </div>
  );
};

export default RiskMetrics;