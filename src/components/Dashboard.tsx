import React from 'react';
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Lawyer Dashboard</h1>
        <p className="mt-2 text-gray-600">Coming soon...</p>
      </div>
    </div>
  );
};

export default Dashboard; 