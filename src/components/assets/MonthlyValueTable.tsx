import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Currency } from '@/types/currency';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { calculateInflationBetweenDates } from '@/lib/utils/inflation';
import { InflationData } from '@/lib/api/inflation';
import { useState } from 'react';
import { MonthlyInflationDialog } from '@/components/analytics/MonthlyInflationDialog';

interface MonthlyData {
  month: string;
  value: number;
  date: string;
}

interface MonthlyValueTableProps {
  data: MonthlyData[];
  inflationData: InflationData[];
  currency?: Currency;
  initialValue: number;
  initialDate: string;
}

export function MonthlyValueTable({ 
  data, 
  inflationData,
  currency, 
  initialValue,
  initialDate,
}: MonthlyValueTableProps) {
  const [selectedInflationData, setSelectedInflationData] = useState<{
    monthlyRates: { date: string; rate: number }[];
    cumulativeRate: number;
    startDate: string;
    endDate: string;
  } | null>(null);

  const handleShowInflationDetails = (startDate: Date, endDate: Date) => {
    const { monthlyRates, cumulativeRate } = calculateInflationBetweenDates(
      startDate,
      endDate,
      inflationData
    );

    setSelectedInflationData({
      monthlyRates,
      cumulativeRate,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Month</TableHead>
            <TableHead>Nominal Value</TableHead>
            <TableHead>Real Value</TableHead>
            <TableHead>From Initial</TableHead>
            <TableHead>Monthly Change</TableHead>
            <TableHead>Cumulative Inflation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => {
            // Calculate inflation from initial date to current value date
            const { cumulativeRate } = calculateInflationBetweenDates(
              new Date(initialDate),
              new Date(row.date),
              inflationData
            );

            // Calculate real value adjusted for inflation
            const realValue = initialValue * (1 + cumulativeRate / 100);

            // Calculate nominal changes
            const nominalChangeFromInitial = row.value - initialValue;
            const nominalPercentageFromInitial = ((row.value - initialValue) / initialValue) * 100;

            // Calculate month-to-month changes
            const previousValue = index < data.length - 1 ? data[index + 1].value : row.value;
            const monthlyChange = row.value - previousValue;
            const monthlyPercentageChange = ((row.value - previousValue) / previousValue) * 100;

            return (
              <TableRow key={row.month}>
                <TableCell>{format(new Date(row.date), 'MMM yyyy')}</TableCell>
                
                {/* Nominal Value */}
                <TableCell>
                  {currency?.symbol}
                  {Math.round(row.value).toLocaleString()} {currency?.code}
                </TableCell>

                {/* Real Value */}
                <TableCell>
                  {currency?.symbol}
                  {Math.round(realValue).toLocaleString()} {currency?.code}
                </TableCell>

                {/* From Initial */}
                <TableCell className={nominalChangeFromInitial >= 0 ? 'text-green-500' : 'text-red-500'}>
                  <div className="flex items-center">
                    {nominalChangeFromInitial >= 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    {nominalPercentageFromInitial >= 0 ? '+' : ''}
                    {nominalPercentageFromInitial.toFixed(2)}%
                  </div>
                </TableCell>

                {/* Monthly Change */}
                <TableCell className={monthlyChange >= 0 ? 'text-green-500' : 'text-red-500'}>
                  <div className="flex items-center">
                    {monthlyChange >= 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    {monthlyPercentageChange >= 0 ? '+' : ''}
                    {monthlyPercentageChange.toFixed(2)}%
                  </div>
                </TableCell>

                {/* Cumulative Inflation */}
                <TableCell>
                  <Button
                    variant="ghost"
                    className="text-sm text-blue-500 p-0 h-auto hover:text-blue-700"
                    onClick={() => handleShowInflationDetails(
                      new Date(initialDate),
                      new Date(row.date)
                    )}
                  >
                    {cumulativeRate > 0 ? '+' : ''}
                    {cumulativeRate.toFixed(2)}%
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {selectedInflationData && (
        <MonthlyInflationDialog
          open={!!selectedInflationData}
          onOpenChange={(open) => !open && setSelectedInflationData(null)}
          monthlyRates={selectedInflationData.monthlyRates}
          cumulativeRate={selectedInflationData.cumulativeRate}
          startDate={selectedInflationData.startDate}
          endDate={selectedInflationData.endDate}
        />
      )}
    </>
  );
}