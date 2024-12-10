import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wallet, LineChart, Settings, CreditCard } from 'lucide-react';

const Navigation: React.FC = () => {
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Assets', icon: Wallet, path: '/assets' },
    { name: 'Analytics', icon: LineChart, path: '/analytics' },
    { name: 'Subscription', icon: CreditCard, path: '/subscription' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`
          }
        >
          <item.icon className="mr-3 h-5 w-5" />
          {item.name}
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;