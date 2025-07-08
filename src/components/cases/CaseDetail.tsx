import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { getCaseById } from '../../services/caseService';
import type { Case } from '../../types/case';
import { MilestoneStatus } from '../../types/case';
import AddMilestoneModal from './AddMilestoneModal';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const CaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddMilestoneModal, setShowAddMilestoneModal] = useState(false);
  const { user, userData } = useAuth();
  const [payingMilestone, setPayingMilestone] = useState<string | null>(null);
  const [paidMilestones, setPaidMilestones] = useState<string[]>([]);
  const [milestoneActionLoading, setMilestoneActionLoading] = useState<string | null>(null);
  const [milestoneError, setMilestoneError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        if (!id) return;

        const caseData = await getCaseById(id);
        if (!caseData) {
          throw new Error('Case not found');
        }

        setCaseData(caseData);
      } catch (error) {
        console.error('Error fetching case:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      case 'On Hold':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMilestoneStatusColor = (status: MilestoneStatus) => {
    switch (status) {
      case MilestoneStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case MilestoneStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800';
      case MilestoneStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">Case not found</p>
        </div>
      </div>
    );
  }

  const isClient = user?.uid === caseData.clientId;
  const isAssignedLawyer = user?.uid === caseData.assignedLawyerId;
  const canView = isClient || isAssignedLawyer;

  if (!canView) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You do not have permission to view this case.</p>
        </div>
      </div>
    );
  }

  const handleMilestoneAdded = () => {
    // Refresh the case data to show the new milestone
    if (id) {
      getCaseById(id).then(setCaseData).catch(console.error);
    }
  };

  const handleMilestoneStatus = async (milestoneId: string, newStatus: MilestoneStatus) => {
    if (!caseData || !id) return;
    setMilestoneActionLoading(milestoneId + newStatus);
    setMilestoneError(null);
    try {
      // Update milestone status in Firestore
      const updatedMilestones = caseData.milestones?.map(m =>
        m.milestoneId === milestoneId ? { ...m, status: newStatus } : m
      ) || [];
      await updateDoc(doc(db, 'cases', id), { milestones: updatedMilestones });
      setCaseData(prev => prev ? { ...prev, milestones: updatedMilestones } : prev);
    } catch (err) {
      setMilestoneError('Failed to update milestone status.');
    } finally {
      setMilestoneActionLoading(null);
    }
  };

  const handleSimulatePayment = (milestoneId: string) => {
    setPayingMilestone(milestoneId);
    setTimeout(() => {
      setPaidMilestones(prev => [...prev, milestoneId]);
      setPayingMilestone(null);
    }, 1200);
  };

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="bg-white rounded-lg shadow-md overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{caseData.caseTitle}</h1>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(caseData.status || 'Open')}`}>
                    {caseData.status || 'Open'}
                  </span>
                  <span className="text-gray-500">Created on {caseData.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}</span>
                </div>
              </div>
              {isClient && (
                <button
                  onClick={() => navigate(`/cases/${id}/edit`)}
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Edit Case
                </button>
              )}
            </div>

            <div className="prose max-w-none mb-8">
              <p className="text-gray-600">{caseData.caseDescription}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {caseData.category && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Category</h3>
                <p className="mt-1 text-gray-900">{caseData.category}</p>
              </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-gray-500">Priority</h3>
                <p className="mt-1 text-gray-900">{caseData.priority || 'Medium'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
                <p className="mt-1 text-gray-900">${caseData.milestones?.reduce((sum, m) => sum + m.amount, 0) || 0}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Milestones</h3>
                <p className="mt-1 text-gray-900">{caseData.milestones?.length || 0} total</p>
              </div>
            </div>

            {/* Milestones Section */}
              <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Milestones</h2>
                {isClient && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddMilestoneModal(true)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Milestone
                  </motion.button>
                )}
              </div>
                <div className="space-y-4">
                {caseData.milestones && caseData.milestones.length > 0 ? (
                  caseData.milestones.map((milestone, index) => {
                    const isPaid = paidMilestones.includes(milestone.milestoneId);
                    return (
                    <motion.div
                        key={milestone.milestoneId}
                        className="border rounded-lg p-4 bg-gray-50"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                    >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                            <h3 className="text-lg font-medium text-gray-900">{milestone.title}</h3>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getMilestoneStatusColor(milestone.status)}`}>{milestone.status}</span>
                            <span className="text-lg font-semibold text-green-600">${milestone.amount}</span>
                          </div>
                      </div>
                        <p className="text-gray-600 mb-3">{milestone.description}</p>
                        <div className="flex flex-wrap gap-2 items-center">
                          {(isClient || isAssignedLawyer) && milestone.status === MilestoneStatus.PENDING && (
                            <button
                              className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-xs"
                              disabled={milestoneActionLoading === milestone.milestoneId + MilestoneStatus.IN_PROGRESS || !isPaid}
                              onClick={() => handleMilestoneStatus(milestone.milestoneId, MilestoneStatus.IN_PROGRESS)}
                            >
                              {milestoneActionLoading === milestone.milestoneId + MilestoneStatus.IN_PROGRESS ? 'Marking...' : 'Mark In Progress'}
                            </button>
                          )}
                          {(isClient || isAssignedLawyer) && milestone.status === MilestoneStatus.IN_PROGRESS && (
                            <button
                              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                              disabled={milestoneActionLoading === milestone.milestoneId + MilestoneStatus.COMPLETED || !isPaid}
                              onClick={() => handleMilestoneStatus(milestone.milestoneId, MilestoneStatus.COMPLETED)}
                            >
                              {milestoneActionLoading === milestone.milestoneId + MilestoneStatus.COMPLETED ? 'Marking...' : 'Mark Completed'}
                            </button>
                          )}
                          {/* Simulate Payment Button */}
                          {!isPaid && (
                            <button
                              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                              disabled={payingMilestone === milestone.milestoneId}
                              onClick={() => handleSimulatePayment(milestone.milestoneId)}
                            >
                              {payingMilestone === milestone.milestoneId ? 'Processing...' : 'Simulate Payment'}
                            </button>
                          )}
                          {isPaid && <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Paid</span>}
                      </div>
                        {milestoneError && <div className="text-red-600 text-xs mt-2">{milestoneError}</div>}
                    </motion.div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No milestones found for this case.</p>
                </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add Milestone Modal */}
      <AddMilestoneModal
        isOpen={showAddMilestoneModal}
        onClose={() => setShowAddMilestoneModal(false)}
        caseId={id || ''}
        onMilestoneAdded={handleMilestoneAdded}
      />
    </motion.div>
  );
};

export default CaseDetail;
