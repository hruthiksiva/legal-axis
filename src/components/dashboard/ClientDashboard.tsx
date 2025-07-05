import * as React from 'react';
import { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';

interface Case {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  budget: string;
  deadline: string;
  createdAt: string;
  applications?: number;
}

const ClientDashboard: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchClientCases = async () => {
      try {
        if (!user) return;

        const q = query(
          collection(db, 'cases'),
          where('clientId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const casesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate().toLocaleDateString() || 'N/A'
        })) as Case[];

        // Fetch application counts for each case
        const casesWithApplications = await Promise.all(
          casesData.map(async (caseItem) => {
            const applicationsQuery = query(
              collection(db, 'applications'),
              where('caseId', '==', caseItem.id)
            );
            const applicationsSnapshot = await getDocs(applicationsQuery);
            return {
              ...caseItem,
              applications: applicationsSnapshot.size
            };
          })
        );

        setCases(casesWithApplications);
      } catch (error) {
        console.error('Error fetching client cases:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientCases();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Cases</h1>
            <p className="mt-2 text-gray-600">Manage your legal cases and view applications</p>
          </div>
          <Link
            to="/cases/create"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create New Case
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {cases.map((caseItem) => (
              <li key={caseItem.id}>
                <Link to={`/cases/${caseItem.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-medium text-blue-600 truncate">
                          {caseItem.title}
                        </p>
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {caseItem.description}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          caseItem.status === 'open' ? 'bg-green-100 text-green-800' :
                          caseItem.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {caseItem.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <span className="truncate">{caseItem.category}</span>
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <span className="truncate">Budget: {caseItem.budget}</span>
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          {caseItem.applications} {caseItem.applications === 1 ? 'application' : 'applications'}
                        </p>
                        <span className="mx-2">•</span>
                        <p>Created {caseItem.createdAt}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {cases.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">You haven't created any cases yet.</p>
              <Link
                to="/cases/create"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Your First Case
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard; 