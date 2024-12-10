import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';

const Privacy: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Privacy Policy
        </h1>

        <div className="prose dark:prose-invert max-w-none space-y-6">
          <p className="text-gray-600 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              1. Information We Collect
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
              <li>Account information (email, password)</li>
              <li>Profile information</li>
              <li>Financial asset data you input</li>
              <li>Usage data and preferences</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process your transactions and send related information</li>
              <li>Send technical notices, updates, and security alerts</li>
              <li>Respond to your comments and questions</li>
              <li>Analyze usage patterns and trends</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              3. Data Security
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. All data is encrypted in transit and at rest.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              4. Data Retention
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              We retain your information for as long as your account is active or as needed to provide you services. If you wish to cancel your account or request that we no longer use your information, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              5. Your Rights
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Request deletion of your information</li>
              <li>Object to our use of your information</li>
              <li>Export your data in a portable format</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              6. Cookies
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              We use cookies and similar tracking technologies to track the activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              7. Changes to This Policy
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              8. Contact Us
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:contact@codevine.net" className="text-blue-600 dark:text-blue-500 hover:underline">
                contact@codevine.net
              </a>
            </p>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Privacy;