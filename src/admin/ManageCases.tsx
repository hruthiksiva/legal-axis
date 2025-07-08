// src/admin/ManageCases.tsx
import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Milestone {
  milestoneId: string;
  title: string;
  description: string;
  amount: number;
  status: string;
}

interface Case {
  id: string;
  title: string;
  status: string;
  description: string;
  category?: string;
  budget?: string;
  milestones?: Milestone[];
}

const ManageCases = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'cases'));
        const caseList: Case[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Case[];
        setCases(caseList);
      } catch (error) {
        console.error('Error fetching cases:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  const handleUpdate = async (id: string, field: string, value: string) => {
    try {
      await updateDoc(doc(db, 'cases', id), {
        [field]: value,
      });
      setCases((prev) =>
        prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
      );
    } catch (err) {
      console.error('Error updating case:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'cases', id));
      setCases((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Error deleting case:', err);
    }
  };

  const handleMilestoneUpdate = async (caseId: string, milestoneId: string, field: string, value: any) => {
    try {
      const caseRef = doc(db, 'cases', caseId);
      const caseSnap = await getDocs(collection(db, 'cases'));
      const caseData = caseSnap.docs.find(d => d.id === caseId)?.data() as Case;
      const updatedMilestones = caseData.milestones?.map(m =>
        m.milestoneId === milestoneId ? { ...m, [field]: value } : m
      ) || [];
      await updateDoc(caseRef, { milestones: updatedMilestones });
      setCases(prev => prev.map(c =>
        c.id === caseId ? { ...c, milestones: updatedMilestones } : c
      ));
    } catch (err) {
      console.error('Error updating milestone:', err);
    }
  };

  const handleMilestoneDelete = async (caseId: string, milestoneId: string) => {
    try {
      const caseRef = doc(db, 'cases', caseId);
      const caseSnap = await getDocs(collection(db, 'cases'));
      const caseData = caseSnap.docs.find(d => d.id === caseId)?.data() as Case;
      const updatedMilestones = caseData.milestones?.filter(m => m.milestoneId !== milestoneId) || [];
      await updateDoc(caseRef, { milestones: updatedMilestones });
      setCases(prev => prev.map(c =>
        c.id === caseId ? { ...c, milestones: updatedMilestones } : c
      ));
    } catch (err) {
      console.error('Error deleting milestone:', err);
    }
  };

  const handleMilestoneAdd = async (caseId: string) => {
    try {
      const newMilestone: Milestone = {
        milestoneId: Math.random().toString(36).substring(2, 10),
        title: 'New Milestone',
        description: '',
        amount: 0,
        status: 'Pending',
      };
      const caseRef = doc(db, 'cases', caseId);
      const caseSnap = await getDocs(collection(db, 'cases'));
      const caseData = caseSnap.docs.find(d => d.id === caseId)?.data() as Case;
      const updatedMilestones = [...(caseData.milestones || []), newMilestone];
      await updateDoc(caseRef, { milestones: updatedMilestones });
      setCases(prev => prev.map(c =>
        c.id === caseId ? { ...c, milestones: updatedMilestones } : c
      ));
    } catch (err) {
      console.error('Error adding milestone:', err);
    }
  };

  if (loading) return <p className="p-4">Loading cases...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Cases</h2>
      <div className="space-y-4">
        {cases.map((c) => (
          <div key={c.id} className="border rounded p-4 bg-white shadow-sm mb-6">
            <div className="flex justify-between items-center mb-2">
              <input
                className="text-xl font-semibold text-gray-800 w-full border-b focus:outline-none"
                value={c.title}
                onChange={(e) => handleUpdate(c.id, 'title', e.target.value)}
              />
              <button
                className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                onClick={() => handleDelete(c.id)}
              >
                Delete Case
              </button>
            </div>
            <div className="flex flex-wrap gap-4 mb-2">
              <input
                className="border p-1 rounded w-40"
                placeholder="Category"
                value={c.category || ''}
                onChange={(e) => handleUpdate(c.id, 'category', e.target.value)}
              />
              <input
                className="border p-1 rounded w-40"
                placeholder="Budget"
                value={c.budget || ''}
                onChange={(e) => handleUpdate(c.id, 'budget', e.target.value)}
              />
              <select
                value={c.status}
                onChange={(e) => handleUpdate(c.id, 'status', e.target.value)}
                className="border p-1 rounded"
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <textarea
              className="w-full border rounded p-2 mb-2"
              placeholder="Description"
              value={c.description}
              onChange={(e) => handleUpdate(c.id, 'description', e.target.value)}
            />
            {/* Milestone Management */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg">Milestones</h3>
                <button
                  className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                  onClick={() => handleMilestoneAdd(c.id)}
                >
                  Add Milestone
                </button>
              </div>
              <div className="space-y-2">
                {c.milestones && c.milestones.length > 0 ? (
                  c.milestones.map((m) => (
                    <div key={m.milestoneId} className="border rounded p-2 flex flex-col md:flex-row md:items-center md:gap-4 bg-gray-50">
                      <input
                        className="border p-1 rounded mb-1 md:mb-0 w-40"
                        value={m.title}
                        onChange={(e) => handleMilestoneUpdate(c.id, m.milestoneId, 'title', e.target.value)}
                      />
                      <input
                        className="border p-1 rounded mb-1 md:mb-0 w-40"
                        value={m.amount}
                        type="number"
                        onChange={(e) => handleMilestoneUpdate(c.id, m.milestoneId, 'amount', Number(e.target.value))}
                      />
                      <select
                        value={m.status}
                        onChange={(e) => handleMilestoneUpdate(c.id, m.milestoneId, 'status', e.target.value)}
                        className="border p-1 rounded mb-1 md:mb-0"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                      <input
                        className="border p-1 rounded flex-1 mb-1 md:mb-0"
                        value={m.description}
                        onChange={(e) => handleMilestoneUpdate(c.id, m.milestoneId, 'description', e.target.value)}
                      />
                      <button
                        className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                        onClick={() => handleMilestoneDelete(c.id, m.milestoneId)}
                      >
                        Delete
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-sm">No milestones.</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageCases;

