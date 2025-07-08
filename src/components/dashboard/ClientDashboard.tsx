import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Application {
  id: string;
  lawyerId: string;
  lawyerName: string;
  proposal: string;
  status: string;
  createdAt: string;
}

interface Case {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  budget: string;
  deadline: string;
  createdAt: string;
  assignedLawyerId?: string;
  assignedLawyerName?: string;
  applications?: Application[];
}

const ClientDashboard: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
        const casesData = querySnapshot.docs.map(docSnap => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt?.toDate?.().toLocaleDateString() || 'N/A',
            assignedLawyerId: data.assignedLawyerId,
            assignedLawyerName: data.assignedLawyerName,
          } as Case;
        });
        // Fetch applications for each case
        const casesWithApplications = await Promise.all(
          casesData.map(async (caseItem) => {
            const applicationsQuery = query(
              collection(db, 'applications'),
              where('caseId', '==', caseItem.id)
            );
            const applicationsSnapshot = await getDocs(applicationsQuery);
            const applications: Application[] = applicationsSnapshot.docs.map(appDoc => {
              const appData = appDoc.data();
              return {
                id: appDoc.id,
                lawyerId: appData.lawyerId,
                lawyerName: appData.lawyerName,
                proposal: appData.proposal,
                status: appData.status,
                createdAt: appData.createdAt?.toDate?.().toLocaleString() || 'N/A',
              };
            });
            return {
              ...caseItem,
              applications,
            };
          })
        );
        setCases(casesWithApplications);
      } catch (error) {
        setError('Error fetching client cases.');
        console.error('Error fetching client cases:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClientCases();
  }, [user, success]);

  // Approve or deny application
  const handleApplicationAction = async (caseId: string, applicationId: string, lawyerId: string, lawyerName: string, action: 'accept' | 'deny') => {
    setActionLoading(applicationId + action);
    setError(null);
    setSuccess(null);
    try {
      // Update application status
      await updateDoc(doc(db, 'applications', applicationId), {
        status: action === 'accept' ? 'accepted' : 'denied',
      });
      // If accepted, update case assignedLawyerId and status
      if (action === 'accept') {
        await updateDoc(doc(db, 'cases', caseId), {
          assignedLawyerId: lawyerId,
          assignedLawyerName: lawyerName,
          status: 'In Progress',
        });
      }
      setSuccess(`Application ${action === 'accept' ? 'approved' : 'denied'} successfully.`);
    } catch (err) {
      setError('Failed to update application.');
    } finally {
      setActionLoading(null);
    }
  };

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
        {error && <div className="mb-4 text-red-600">{error}</div>}
        {success && <div className="mb-4 text-green-600">{success}</div>}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {cases.map((caseItem) => (
              <li key={caseItem.id}>
                <Link to={`/cases/${caseItem.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-bold text-blue-900 truncate">
                          {caseItem.title || 'Untitled Case'}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1 mb-1">
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {caseItem.category || 'No Category'}
                          </span>
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            Budget: {caseItem.budget ? `$${caseItem.budget}` : 'N/A'}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {caseItem.description}
                        </p>
                        {caseItem.assignedLawyerId && (
                          <p className="mt-1 text-sm text-green-700">Assigned to: {caseItem.assignedLawyerName || caseItem.assignedLawyerId}</p>
                        )}
                      </div>
                      <div className="ml-4 flex-shrink-0 flex">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          caseItem.status === 'open' ? 'bg-green-100 text-green-800' :
                          caseItem.status === 'in-progress' || caseItem.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
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
                        <p>Created {caseItem.createdAt}</p>
                      </div>
                    </div>
                    {/* Applications Section */}
                    {caseItem.applications && caseItem.applications.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2 text-blue-700">Applications</h4>
                        <ul className="divide-y divide-gray-100">
                          {caseItem.applications.map(app => (
                            <li key={app.id} className="py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <span className="font-medium text-gray-900">{app.lawyerName}</span>
                                <span className="ml-2 text-xs text-gray-500">({app.createdAt})</span>
                                <div className="text-gray-700 mt-1">{app.proposal}</div>
                              </div>
                              <div className="mt-2 sm:mt-0 flex items-center gap-2">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                  app.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : app.status === 'accepted'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                </span>
                                {app.status === 'pending' && !caseItem.assignedLawyerId && (
                                  <>
                                    <button
                                      className="ml-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                                      disabled={actionLoading === app.id + 'accept'}
                                      onClick={e => {
                                        e.preventDefault();
                                        handleApplicationAction(caseItem.id, app.id, app.lawyerId, app.lawyerName, 'accept');
                                      }}
                                    >
                                      {actionLoading === app.id + 'accept' ? 'Approving...' : 'Approve'}
                                    </button>
                                    <button
                                      className="ml-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                                      disabled={actionLoading === app.id + 'deny'}
                                      onClick={e => {
                                        e.preventDefault();
                                        handleApplicationAction(caseItem.id, app.id, app.lawyerId, app.lawyerName, 'deny');
                                      }}
                                    >
                                      {actionLoading === app.id + 'deny' ? 'Denying...' : 'Deny'}
                                    </button>
                                  </>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
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