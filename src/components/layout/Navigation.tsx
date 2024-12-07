import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  PieChart,
  LineChart,
  Settings,
  CreditCard,
} from 'lucide-react';
import { AddAssetDialog } from '@/components/assets/AddAssetDialog';

const menuItems = [
  {
    title: 'Overview',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    title: 'Assets',
    icon: PieChart,
    path: '/dashboard/assets',
  },
  {
    title: 'Analytics',
    icon: LineChart,
    path: '/dashboard/analytics',
  },
  {
    title: 'Subscription',
    icon: CreditCard,
    path: '/dashboard/subscription',
  },
  {
    title: 'Settings',
    icon: Settings,
    path: '/dashboard/settings',
  },
];

interface NavigationProps {
  onNavigate?: () => void;
}

export function Navigation({ onNavigate }: NavigationProps) {
  const location = useLocation();

  return (
    <div className="h-full flex flex-col border-r bg-gray-50/40">
      <div className="p-4">
        <AddAssetDialog />
      </div>
      <nav className="space-y-1 px-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onNavigate}
            className={cn(
              'flex items-center px-3 py-2 text-sm font-medium rounded-md',
              location.pathname === item.path
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            <item.icon className="h-4 w-4 mr-3" />
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  );
}