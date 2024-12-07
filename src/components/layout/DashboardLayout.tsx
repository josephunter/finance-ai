import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Navigation } from './Navigation';
import { CurrencySetupDialog } from '@/components/currency/CurrencySetupDialog';

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex h-[calc(100vh-4rem)]">
        <div className="w-64 hidden md:block">
          <Navigation />
        </div>
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
      <CurrencySetupDialog />
    </div>
  );
}