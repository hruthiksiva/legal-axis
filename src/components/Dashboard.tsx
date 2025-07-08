import * as React from 'react';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ClientDashboard from './dashboard/ClientDashboard';
import { db } from '../config/firebase';
import { collection, query, where, getDocs, doc, addDoc } from 'firebase/firestore';
import type { Case, Milestone } from '../types/case';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { user, userData } = useAuth();
  const [assignedCases, setAssignedCases] = useState<Case[]>([]);
  const [openCases, setOpenCases] = useState<Case[]>([]);
  const [applications, setApplications] = useState<{ [caseId: string]: string }>( {} );
  const [showApplyModal, setShowApplyModal] = useState<string | null>(null);
  const [proposal, setProposal] = useState('');
  const [loading, setLoading] = useState(true);
  const [applyLoading, setApplyLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch assigned and open cases for lawyers
  useEffect(() => {
    if (!user || userData?.userType !== 'lawyer') return;
    setLoading(true);
    const fetchCases = async () => {
      // Assigned cases (approved by client)
      const assignedQ = query(collection(db, 'cases'), where('assignedLawyerId', '==', user.uid));
      const assignedSnap = await getDocs(assignedQ);
      setAssignedCases(assignedSnap.docs.map(doc => ({ caseId: doc.id, ...doc.data() } as Case)));

      // Open cases (not assigned, status Open, not created by this lawyer)
      const openQ = query(collection(db, 'cases'), where('status', '==', 'Open'));
      const openSnap = await getDocs(openQ);
      // Filter out cases where this lawyer is the client or already assigned
      const openFiltered = openSnap.docs
        .map(doc => ({ caseId: doc.id, ...doc.data() } as Case))
        .filter(c => c.clientId !== user.uid && c.assignedLawyerId !== user.uid);
      setOpenCases(openFiltered);

      // Fetch applications for this lawyer
      const appQ = query(collection(db, 'applications'), where('lawyerId', '==', user.uid));
      const appSnap = await getDocs(appQ);
      const appMap: { [caseId: string]: string } = {};
      appSnap.docs.forEach(doc => {
        const data = doc.data();
        appMap[data.caseId] = data.status;
      });
      setApplications(appMap);
      setLoading(false);
    };
    fetchCases();
  }, [user, userData, success]);

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

  if (!user) {
    return <Navigate to="/signin" />;
  }

  // Render different dashboard based on user type
  if (userData?.userType === 'client') {
    return <ClientDashboard />;
  }

  // Lawyer dashboard
  return (
    <div className="min-h-screen bg-white text-black py-12 px-4 sm:px-6 lg:px-8 transition-all duration-500">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 border-b-2 border-blue-500 pb-2">
          Lawyer Dashboard
        </h1>
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <>
            {/* Assigned Cases */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-blue-700">Assigned Cases</h2>
              {assignedCases.length === 0 ? (
                <p className="text-gray-500">No assigned cases yet.</p>
              ) : (
                assignedCases.map((c) => (
                  <motion.div
                    key={c.caseId}
                    className="mb-6 p-4 border rounded-lg bg-white shadow"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-semibold">{c.caseTitle}</h3>
                        <p className="text-gray-600">{c.caseDescription}</p>
                      </div>
                      <a
                        href={`/cases/${c.caseId}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        View Details
                      </a>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Milestones</h4>
                      {c.milestones && c.milestones.length > 0 ? (
                        <ul>
                          {c.milestones.map((m: Milestone, idx: number) => (
                            <li key={m.milestoneId} className="mb-2 flex justify-between items-center">
                              <span>
                                <b>#{idx + 1}:</b> {m.title} — {m.description}
                              </span>
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                m.status === 'Pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : m.status === 'In Progress'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {m.status}
                              </span>
                              <span className="ml-4 text-green-700 font-bold">${m.amount}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">No milestones yet.</p>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </section>

            {/* Open Cases to Apply */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-700">Open Cases to Apply</h2>
              {openCases.length === 0 ? (
                <p className="text-gray-500">No open cases available for application.</p>
              ) : (
                openCases.map((c) => (
                  <motion.div
                    key={c.caseId}
                    className="mb-6 p-4 border rounded-lg bg-gray-50 shadow"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">{c.caseTitle}</h3>
                        <p className="text-gray-600">{c.caseDescription}</p>
                      </div>
                      <div>
                        {applications[c.caseId] ? (
                          <span className={`px-3 py-1 rounded text-xs font-semibold ${
                            applications[c.caseId] === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : applications[c.caseId] === 'accepted'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {applications[c.caseId] === 'pending' && 'Pending'}
                            {applications[c.caseId] === 'accepted' && 'Accepted'}
                            {applications[c.caseId] === 'denied' && 'Denied'}
                          </span>
                        ) : (
                          <button
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            onClick={() => setShowApplyModal(c.caseId)}
                          >
                            Apply
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </section>
          </>
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
    </div>
  );
};

export default Dashboard;
