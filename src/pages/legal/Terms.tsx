import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';

const Terms: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Terms of Service
        </h1>

        <div className="prose dark:prose-invert max-w-none space-y-6">
          <p className="text-gray-600 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              1. Agreement to Terms
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              By accessing or using PortfolioLens, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              2. Use License
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Permission is granted to temporarily access PortfolioLens for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>Attempt to decompile or reverse engineer any software contained in PortfolioLens</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              3. Disclaimer
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              The materials on PortfolioLens are provided on an 'as is' basis. PortfolioLens makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              4. Limitations
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              In no event shall PortfolioLens or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use PortfolioLens, even if PortfolioLens or a PortfolioLens authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              5. Accuracy of Materials
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              The materials appearing on PortfolioLens could include technical, typographical, or photographic errors. PortfolioLens does not warrant that any of the materials on its website are accurate, complete, or current. PortfolioLens may make changes to the materials contained on its website at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              6. Links
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              PortfolioLens has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by PortfolioLens of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              7. Modifications
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              PortfolioLens may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              8. Governing Law
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Terms;