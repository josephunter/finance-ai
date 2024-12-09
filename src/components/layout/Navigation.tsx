import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  CircleDollarSign, 
  BarChart2, 
  Settings, 
  CreditCard 
} from 'lucide-react';

interface NavigationProps {
  className?: string;
  onNavigate?: () => void;
}

const links = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Assets',
    href: '/dashboard/assets',
    icon: CircleDollarSign,
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart2,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
  {
    title: 'Subscription',
    href: '/dashboard/subscription',
    icon: CreditCard,
  },
];

export function Navigation({ className, onNavigate }: NavigationProps) {
  return (
    <nav className={cn("space-y-1 p-4", className)}>
      {links.map((link) => (
        <NavLink
          key={link.href}
          to={link.href}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
              "hover:bg-accent hover:text-accent-foreground",
              "dark:hover:bg-accent/50",
              isActive 
                ? "bg-accent text-accent-foreground dark:bg-accent/60" 
                : "text-muted-foreground"
            )
          }
        >
          <div className="relative w-4 h-4">
            <link.icon className="h-full w-full absolute top-0 left-0" />
          </div>
          {link.title}
        </NavLink>
      ))}
    </nav>
  );
}