import { useMemo } from 'react';
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import { Currency } from '@/types/currency';
import { InflationData } from '@/lib/api/inflation';
import { calculateInflationAdjustedValue } from '@/lib/utils/inflation';

interface MonthlyData {
  month: string;
  value: number;
  date: string;
}

interface ValueChartProps {
  data: MonthlyData[];
  currency?: Currency;
  inflationData: InflationData[];
  initialDate: string;
  initialValue: number;
}

export function ValueChart({ 
  data, 
  currency, 
  inflationData,
  initialDate,
  initialValue 
}: ValueChartProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map(item => {
      const inflationAdjustedValue = calculateInflationAdjustedValue(
        initialValue,
        new Date(initialDate),
        new Date(item.date),
        inflationData
      );

      return {
        month: item.month,
        nominal: item.value,
        real: inflationAdjustedValue,
      };
    }).reverse();
  }, [data, inflationData, initialDate, initialValue]);

  if (!data || data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Value Over Time</h3>
        <p className="text-center text-gray-500">No value history available</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Value Over Time</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="month" 
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#888888' }}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#888888' }}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${currency?.symbol}${Math.round(value).toLocaleString()}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const data = payload[0].payload;
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Month
                        </span>
                        <span className="font-bold text-muted-foreground">
                          {data.month}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Nominal Value
                        </span>
                        <span className="font-bold">
                          {currency?.symbol}
                          {Math.round(data.nominal).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Real Value
                        </span>
                        <span className="font-bold text-blue-500">
                          {currency?.symbol}
                          {Math.round(data.real).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Line
              type="monotone"
              dataKey="nominal"
              strokeWidth={2}
              activeDot={{ r: 4, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
              dot={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, r: 3 }}
              stroke="hsl(var(--primary))"
            />
            <Line
              type="monotone"
              dataKey="real"
              strokeWidth={2}
              activeDot={{ r: 4, stroke: 'hsl(217, 91%, 60%)', strokeWidth: 2 }}
              dot={{ stroke: 'hsl(217, 91%, 60%)', strokeWidth: 2, r: 3 }}
              stroke="hsl(217, 91%, 60%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}