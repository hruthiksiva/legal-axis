import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
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
  clientId: string;
  clientName: string;
  createdAt: string;
  applications?: number;
}

const CasesList: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, userData } = useAuth();

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const q = query(collection(db, 'cases'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const casesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate().toLocaleDateString() || 'N/A'
        })) as Case[];
        setCases(casesData);
      } catch (error) {
        console.error('Error fetching cases:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

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
            <h1 className="text-3xl font-bold text-gray-900">Legal Cases</h1>
            <p className="mt-2 text-gray-600">Browse available legal cases or create your own</p>
          </div>
          {userData?.userType === 'client' && (
            <Link
              to="/cases/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create New Case
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((caseItem) => (
            <Link
              key={caseItem.id}
              to={`/cases/${caseItem.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{caseItem.title}</h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    caseItem.status === 'open' ? 'bg-green-100 text-green-800' :
                    caseItem.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {caseItem.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{caseItem.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                    {caseItem.category}
                  </span>
                  <span className="px-2 py-1 text-sm bg-gray-100 text-gray-800 rounded-full">
                    Budget: {caseItem.budget}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Posted: {caseItem.createdAt}</span>
                  {caseItem.applications && (
                    <span>{caseItem.applications} applications</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {cases.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No cases available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CasesList; 