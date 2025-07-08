import * as React from 'react';
import { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import type { Case, Milestone } from '../types/case';
import { MilestoneStatus } from '../types/case';

const statusOptions: MilestoneStatus[] = [MilestoneStatus.PENDING, MilestoneStatus.IN_PROGRESS, MilestoneStatus.COMPLETED];

const AdminMilestones: React.FC = () => {
  const { userData } = useAuth();
  const [milestones, setMilestones] = useState<Array<Milestone & { caseId: string; caseTitle: string }>>([]);
  const [filter, setFilter] = useState<MilestoneStatus | 'All'>('All');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if ((userData?.userType as string) !== 'admin') return;
    setLoading(true);
    const fetchMilestones = async () => {
      try {
        const casesSnap = await getDocs(collection(db, 'cases'));
        const allMilestones: Array<Milestone & { caseId: string; caseTitle: string }> = [];
        casesSnap.forEach(docSnap => {
          const caseData = docSnap.data() as Case;
          if (caseData.milestones && Array.isArray(caseData.milestones)) {
            caseData.milestones.forEach(milestone => {
              allMilestones.push({ ...milestone, caseId: docSnap.id, caseTitle: caseData.caseTitle });
            });
          }
        });
        setMilestones(allMilestones);
      } catch (err) {
        setError('Failed to fetch milestones.');
      } finally {
        setLoading(false);
      }
    };
    fetchMilestones();
  }, [userData]);

  const handleStatusUpdate = async (caseId: string, milestoneId: string, newStatus: MilestoneStatus) => {
    setActionLoading(milestoneId + newStatus);
    setError(null);
    setSuccess(null);
    try {
      // Fetch the case
      const caseRef = doc(db, 'cases', caseId);
      const caseSnap = await getDoc(caseRef);
      const caseData = caseSnap.data() as Case;
      const updatedMilestones = caseData.milestones.map((m: Milestone) =>
        m.milestoneId === milestoneId ? { ...m, status: newStatus } : m
      );
      await updateDoc(caseRef, { milestones: updatedMilestones });
      setMilestones(prev =>
        prev.map(m =>
          m.milestoneId === milestoneId && m.caseId === caseId ? { ...m, status: newStatus } : m
        )
      );
      setSuccess('Milestone status updated.');
    } catch (err) {
      setError('Failed to update milestone status.');
    } finally {
      setActionLoading(null);
    }
  };

  if ((userData?.userType as string) !== 'admin') {
    return <div className="p-8 text-center text-red-600">Access denied. Admins only.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-900">All Milestones (Admin)</h1>
        <div className="mb-4 flex gap-4 items-center">
          <label className="font-medium">Filter by status:</label>
          <select
            className="border rounded px-2 py-1"
            value={filter}
            onChange={e => setFilter(e.target.value as MilestoneStatus | 'All')}
          >
            <option value="All">All</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        {error && <div className="mb-2 text-red-600">{error}</div>}
        {success && <div className="mb-2 text-green-600">{success}</div>}
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="space-y-4">
            {milestones.filter(m => filter === 'All' || m.status === filter).map(milestone => (
              <motion.div
                key={milestone.milestoneId + milestone.caseId}
                className="bg-white border rounded-lg p-4 shadow flex flex-col md:flex-row md:items-center md:justify-between"
                whileHover={{ scale: 1.01 }}
              >
                <div>
                  <div className="font-semibold text-lg text-blue-700">{milestone.title}</div>
                  <div className="text-gray-600">{milestone.description}</div>
                  <div className="text-sm text-gray-500 mt-1">Case: <span className="font-medium">{milestone.caseTitle}</span></div>
                  <div className="text-sm text-gray-500">Amount: <span className="font-medium">${milestone.amount}</span></div>
                  <div className="text-sm text-gray-500">Status: <span className="font-medium">{milestone.status}</span></div>
                </div>
                <div className="mt-4 md:mt-0 flex gap-2">
                  {statusOptions.filter(s => s !== milestone.status).map(status => (
                    <button
                      key={status}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                      disabled={actionLoading === milestone.milestoneId + status}
                      onClick={() => handleStatusUpdate(milestone.caseId, milestone.milestoneId, status)}
                    >
                      {actionLoading === milestone.milestoneId + status ? 'Updating...' : `Mark ${status}`}
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}
            {milestones.filter(m => filter === 'All' || m.status === filter).length === 0 && (
              <div className="text-center text-gray-500 py-8">No milestones found for this filter.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMilestones; 