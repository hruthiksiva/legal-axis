import * as React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="prose prose-lg">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
              <p className="text-gray-600">
                We collect information that you provide directly to us, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-600 mt-2">
                <li>Name and contact information</li>
                <li>Account credentials</li>
                <li>Payment information</li>
                <li>Communication preferences</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-600">
                We use the collected information to:
              </p>
              <ul className="list-disc list-inside text-gray-600 mt-2">
                <li>Provide and maintain our services</li>
                <li>Process your transactions</li>
                <li>Send you important updates</li>
                <li>Improve our services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
              <p className="text-gray-600">
                We do not sell or rent your personal information to third parties. We may share your
                information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-600 mt-2">
                <li>With your consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and safety</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
              <p className="text-gray-600">
                We implement appropriate security measures to protect your personal information from
                unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
              <p className="text-gray-600">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-600 mt-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking</h2>
              <p className="text-gray-600">
                We use cookies and similar tracking technologies to improve your browsing experience
                and analyze website traffic.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
              <p className="text-gray-600">
                If you have any questions about this Privacy Policy, please contact us at
                privacy@legalaxis.com.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy; 