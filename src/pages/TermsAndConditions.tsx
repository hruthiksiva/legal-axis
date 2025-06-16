import React from 'react';

const TermsAndConditions: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms and Conditions</h1>
        
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="prose prose-lg">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600">
                By accessing and using Legal Axis's services, you agree to be bound by these Terms and Conditions.
                If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Use of Services</h2>
              <p className="text-gray-600">
                Our services are intended for legal purposes only. Users must comply with all applicable laws
                and regulations while using our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
              <p className="text-gray-600">
                Users are responsible for maintaining the confidentiality of their account information
                and for all activities that occur under their account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
              <p className="text-gray-600">
                All content and materials available on Legal Axis are protected by intellectual property
                rights and are the property of Legal Axis or its licensors.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
              <p className="text-gray-600">
                Legal Axis shall not be liable for any indirect, incidental, special, consequential,
                or punitive damages resulting from your use of our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Changes to Terms</h2>
              <p className="text-gray-600">
                We reserve the right to modify these terms at any time. Users will be notified of any
                significant changes to these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Contact Information</h2>
              <p className="text-gray-600">
                For any questions regarding these Terms and Conditions, please contact us at
                legal@legalaxis.com.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsAndConditions; 