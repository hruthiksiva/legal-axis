import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import Navbar from './Navbar';

interface UserData {
  userType: 'lawyer' | 'client';
  email: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, [user]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="flex items-center space-x-3">
            <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-lg text-gray-700">Loading...</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Welcome to your {userData?.userType === 'lawyer' ? 'Lawyer' : 'Client'} Dashboard
                </h2>
              </div>
              
              {userData?.userType === 'lawyer' ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Lawyer Dashboard</h3>
                    <p className="text-blue-700">Manage your cases and clients here.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-200 transition duration-150 ease-in-out">
                      <h4 className="font-medium text-gray-900 mb-2">Active Cases</h4>
                      <p className="text-gray-600">View and manage your active cases</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-200 transition duration-150 ease-in-out">
                      <h4 className="font-medium text-gray-900 mb-2">Client Management</h4>
                      <p className="text-gray-600">Access your client information</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-200 transition duration-150 ease-in-out">
                      <h4 className="font-medium text-gray-900 mb-2">Schedule</h4>
                      <p className="text-gray-600">View your upcoming appointments</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Client Dashboard</h3>
                    <p className="text-blue-700">View your cases and connect with lawyers here.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-200 transition duration-150 ease-in-out">
                      <h4 className="font-medium text-gray-900 mb-2">My Cases</h4>
                      <p className="text-gray-600">Track your legal cases</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-200 transition duration-150 ease-in-out">
                      <h4 className="font-medium text-gray-900 mb-2">Find Lawyers</h4>
                      <p className="text-gray-600">Connect with legal professionals</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-200 transition duration-150 ease-in-out">
                      <h4 className="font-medium text-gray-900 mb-2">Documents</h4>
                      <p className="text-gray-600">Access your legal documents</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
} 