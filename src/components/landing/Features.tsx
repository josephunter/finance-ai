import React from 'react';
import {
  LineChart,
  DollarSign,
  TrendingUp,
  Globe,
  Bell,
  Shield,
  Zap,
  BarChart
} from 'lucide-react';

const features = [
  {
    name: 'Advanced Analytics',
    description: 'Comprehensive performance tracking and analysis tools to understand your portfolio better.',
    icon: LineChart
  },
  {
    name: 'Multi-Currency Support',
    description: 'Track assets in different currencies with automatic exchange rate conversion.',
    icon: Globe
  },
  {
    name: 'Inflation Impact',
    description: 'Monitor how inflation affects your assets\' real value over time.',
    icon: TrendingUp
  },
  {
    name: 'Income Tracking',
    description: 'Track and analyze income streams from your investments.',
    icon: DollarSign
  },
  {
    name: 'Real-time Alerts',
    description: 'Get notified about important changes in your portfolio.',
    icon: Bell
  },
  {
    name: 'Secure Platform',
    description: 'Bank-grade security to protect your financial data.',
    icon: Shield
  },
  {
    name: 'Performance Metrics',
    description: 'Detailed metrics and KPIs for your investments.',
    icon: BarChart
  },
  {
    name: 'Quick Updates',
    description: 'Fast and easy asset value updates with historical tracking.',
    icon: Zap
  }
];

const Features: React.FC = () => {
  return (
    <div className="py-12 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-blue-600 dark:text-blue-500 font-semibold tracking-wide uppercase">
            Features
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Everything you need to manage your portfolio
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
            Powerful tools and features designed to help you make informed investment decisions.
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 dark:bg-blue-600 text-white">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    {feature.name}
                  </h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;