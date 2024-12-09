import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Navigation } from './Navigation';

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Navigation className="hidden md:block w-64 border-r min-h-[calc(100vh-4rem)]" />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}