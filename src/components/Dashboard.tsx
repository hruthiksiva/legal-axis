import * as React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ClientDashboard from './dashboard/ClientDashboard';

const Dashboard: React.FC = () => {
  const { user, userData } = useAuth();

  if (!user) {
    return <Navigate to="/signin" />;
  }

  // Render different dashboard based on user type
  if (userData?.userType === 'client') {
    return <ClientDashboard />;
  }

  // For lawyers, show a different dashboard (to be implemented)
  return (
    <div className="min-h-screen bg-white text-black py-12 px-4 sm:px-6 lg:px-8 transition-all duration-500">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 border-b-2 border-orange-500 pb-2">
          Lawyer Dashboard
        </h1>
        <p className="text-gray-600 text-lg">
          Welcome! This section is under development. New features and tools tailored for lawyers will be coming soon.
        </p>
        <div className="mt-10 p-6 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-orange-500 mb-2">Upcoming Features</h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Case management tools</li>
            <li>Client communication dashboard</li>
            <li>Billing and invoices</li>
            <li>Profile analytics</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
