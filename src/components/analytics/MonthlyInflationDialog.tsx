import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { InflationData } from '@/lib/api/inflation';
import { format } from 'date-fns';

interface MonthlyInflationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  monthlyRates: { date: string; rate: number }[];
  cumulativeRate: number;
  startDate: string;
  endDate: string;
}

export function MonthlyInflationDialog({
  open,
  onOpenChange,
  monthlyRates,
  cumulativeRate,
  startDate,
  endDate,
}: MonthlyInflationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Monthly Inflation Breakdown</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>Period: {format(new Date(startDate), 'PP')} - {format(new Date(endDate), 'PP')}</p>
            <p>Cumulative Rate: {cumulativeRate.toFixed(2)}%</p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Monthly Rate</TableHead>
                <TableHead>Running Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyRates.map((item, index) => {
                const runningTotal = monthlyRates
                  .slice(0, index + 1)
                  .reduce((sum, curr) => sum + curr.rate, 0);
                  
                return (
                  <TableRow key={item.date}>
                    <TableCell>{format(new Date(item.date + '-01'), 'MMMM yyyy')}</TableCell>
                    <TableCell>{item.rate.toFixed(4)}%</TableCell>
                    <TableCell>{runningTotal.toFixed(2)}%</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}