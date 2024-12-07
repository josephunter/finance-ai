import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Asset } from '@/types/asset';
import { Currency } from '@/types/currency';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

interface PerformanceChartProps {
  asset: Asset;
  metrics: {
    initialValue: number;
    currentValue: number;
    totalIncome: number;
  };
  currency?: Currency;
}

export function PerformanceChart({ asset, metrics, currency }: PerformanceChartProps) {
  const chartData = useMemo(() => {
    const data = [
      {
        date: asset.purchaseDate,
        value: metrics.initialValue,
        income: 0,
        total: metrics.initialValue,
      },
      ...(asset.values || []).map(value => ({
        date: value.date,
        value: value.masterCurrencyValue,
        income: metrics.totalIncome,
        total: value.masterCurrencyValue + metrics.totalIncome,
      })),
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return data;
  }, [asset, metrics]);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Performance Over Time</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => format(parseISO(date), 'MMM yyyy')}
              stroke="#888888"
              fontSize={12}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickFormatter={(value) => `${currency?.symbol}${Math.round(value / 1000)}k`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          {format(parseISO(label), 'PP')}
                        </span>
                      </div>
                      {payload.map((entry) => (
                        <div key={entry.name} className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            {entry.name}
                          </span>
                          <span className="font-bold">
                            {currency?.symbol}
                            {Math.round(entry.value).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }}
            />
            <Line
              name="Asset Value"
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
            />
            <Line
              name="Total Return"
              type="monotone"
              dataKey="total"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={{ stroke: 'hsl(var(--chart-1))', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}