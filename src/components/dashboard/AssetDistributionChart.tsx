import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Asset, ASSET_TYPES } from '@/types/asset';
import { CURRENCIES } from '@/types/currency';
import { useUserSettings } from '@/contexts/UserSettingsContext';

interface AssetDistributionChartProps {
  assets: Asset[];
}

export function AssetDistributionChart({ assets }: AssetDistributionChartProps) {
  const { settings } = useUserSettings();
  const masterCurrency = CURRENCIES.find(c => c.code === settings.masterCurrency?.code);

  const data = useMemo(() => {
    const activeAssets = assets.filter(asset => asset.status === 'active');
    
    const distribution = ASSET_TYPES.reduce((acc, type) => {
      const typeAssets = activeAssets.filter(asset => asset.type === type.id);
      const totalValue = typeAssets.reduce((sum, asset) => {
        const latestValue = asset.values?.[0]?.masterCurrencyValue || asset.masterCurrencyValue;
        return sum + latestValue;
      }, 0);

      if (totalValue > 0) {
        acc.push({
          name: type.name,
          value: totalValue,
        });
      }

      return acc;
    }, [] as { name: string; value: number }[]);

    return distribution.sort((a, b) => b.value - a.value);
  }, [assets]);

  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ];

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Asset Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const data = payload[0].payload;
                  const percentage = ((data.value / totalValue) * 100).toFixed(1);
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            {data.name}
                          </span>
                          <span className="font-bold">
                            {masterCurrency?.symbol}
                            {Math.round(data.value).toLocaleString()}
                            {' '}
                            ({percentage}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-xs text-muted-foreground">
                  {((item.value / totalValue) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}