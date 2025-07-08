import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import type { Case } from '../../types/case';

const CasesList: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, userData } = useAuth();
  const [applications, setApplications] = useState<{ [caseId: string]: string }>({});
  const [showApplyModal, setShowApplyModal] = useState<string | null>(null);
  const [proposal, setProposal] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      try {
        if (!user) {
          setLoading(false);
          return;
        }
        if (userData?.userType === 'client') {
          // Show only client's cases
          const q = query(collection(db, 'cases'), where('clientId', '==', user.uid));
          const snap = await getDocs(q);
          setCases(snap.docs.map(doc => ({ caseId: doc.id, ...doc.data() } as Case)));
        } else if (userData?.userType === 'lawyer') {
          // Show all open cases (not assigned, not created by this lawyer)
          const q = query(collection(db, 'cases'), where('status', '==', 'Open'));
          const snap = await getDocs(q);
          const openCases = snap.docs
            .map(doc => ({ caseId: doc.id, ...doc.data() } as Case))
            .filter(c => c.clientId !== user.uid && c.assignedLawyerId !== user.uid);
          setCases(openCases);

          // Fetch applications for this lawyer
          const appQ = query(collection(db, 'applications'), where('lawyerId', '==', user.uid));
          const appSnap = await getDocs(appQ);
          const appMap: { [caseId: string]: string } = {};
          appSnap.docs.forEach(doc => {
            const data = doc.data();
            appMap[data.caseId] = data.status;
          });
          setApplications(appMap);
        }
      } catch (error) {
        console.error('Error fetching cases:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, [user, userData]);

  // Handle lawyer apply
  const handleApply = async (caseId: string) => {
    if (!user) return;
    setApplyLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await addDoc(collection(db, 'applications'), {
        caseId,
        lawyerId: user.uid,
        lawyerName: user.displayName || '',
        proposal,
        status: 'pending',
        createdAt: new Date()
      });
      setApplications(prev => ({ ...prev, [caseId]: 'pending' }));
      setSuccess('Application submitted!');
      setShowApplyModal(null);
      setProposal('');
    } catch (err) {
      setError('Failed to apply. Please try again.');
    } finally {
      setApplyLoading(false);
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
    <motion.div
      className="min-h-screen bg-gray-50 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex justify-between items-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{userData?.userType === 'lawyer' ? 'Open Cases' : 'My Cases'}</h1>
            <p className="mt-2 text-gray-600">{userData?.userType === 'lawyer' ? 'Browse and apply for open legal cases' : 'View and manage your legal cases'}</p>
          </div>
          {userData?.userType === 'client' && (
            <Link
              to="/cases/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create New Case
            </Link>
          )}
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {cases.map((caseItem) => (
            <motion.div
              key={caseItem.caseId}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{caseItem.caseTitle}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      caseItem.status === 'Open' ? 'bg-green-100 text-green-800' :
                      caseItem.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                      caseItem.status === 'Closed' ? 'bg-gray-100 text-gray-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {caseItem.status || 'Open'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{caseItem.caseDescription}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {caseItem.category && (
                      <span className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                        {caseItem.category}
                      </span>
                    )}
                    <span className="px-2 py-1 text-sm bg-purple-100 text-purple-800 rounded-full">
                      {caseItem.milestones?.length || 0} milestones
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Created: {caseItem.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}</span>
                    <span>Total: ${caseItem.milestones?.reduce((sum, m) => sum + m.amount, 0) || 0}</span>
                  </div>
                  {userData?.userType === 'lawyer' && (
                    <div className="mt-4 flex justify-end">
                      {applications[caseItem.caseId] ? (
                        <span className={`px-3 py-1 rounded text-xs font-semibold ${
                          applications[caseItem.caseId] === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : applications[caseItem.caseId] === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {applications[caseItem.caseId] === 'pending' && 'Pending'}
                          {applications[caseItem.caseId] === 'accepted' && 'Accepted'}
                          {applications[caseItem.caseId] === 'denied' && 'Denied'}
                        </span>
                      ) : (
                        <button
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                          onClick={() => setShowApplyModal(caseItem.caseId)}
                        >
                          Apply
                        </button>
                      )}
                    </div>
                  )}
                  {userData?.userType === 'client' && (
                    <Link
                      to={`/cases/${caseItem.caseId}`}
                      className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View Details
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {cases.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No cases yet</h3>
              <p className="mt-1 text-sm text-gray-500">{userData?.userType === 'lawyer' ? 'No open cases available for application.' : 'Get started by creating your first legal case.'}</p>
              {userData?.userType === 'client' && (
                <div className="mt-6">
                  <Link
                    to="/cases/create"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create Your First Case
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {showApplyModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
            >
              <h2 className="text-xl font-bold mb-4">Apply for Case</h2>
              {error && <div className="mb-2 text-red-600">{error}</div>}
              {success && <div className="mb-2 text-green-600">{success}</div>}
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleApply(showApplyModal);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Proposal Message</label>
                  <textarea
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    rows={4}
                    value={proposal}
                    onChange={e => setProposal(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => {
                      setShowApplyModal(null);
                      setProposal('');
                      setError(null);
                      setSuccess(null);
                    }}
                    disabled={applyLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    disabled={applyLoading}
                  >
                    {applyLoading ? 'Applying...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CasesList;
