import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';

const About: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          About PortfolioLens
        </h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-400">
            PortfolioLens is a comprehensive financial asset management platform developed by Codevine. Our mission is to provide individuals and organizations with powerful tools to track, analyze, and optimize their investment portfolios.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            We believe in empowering investors with clear, actionable insights through advanced analytics and intuitive visualization tools. Our platform is designed to help you make informed decisions about your investments while keeping track of their performance across multiple currencies and market conditions.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            Key Features
          </h2>
          <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
            <li>Multi-currency support with automatic exchange rate conversion</li>
            <li>Inflation impact analysis</li>
            <li>Comprehensive performance tracking</li>
            <li>Income stream management</li>
            <li>Advanced analytics and reporting</li>
            <li>Secure and private data management</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            About Codevine
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Codevine is a technology company specializing in developing innovative financial software solutions. With a focus on user experience and technical excellence, we strive to create tools that make financial management more accessible and efficient for everyone.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default About;