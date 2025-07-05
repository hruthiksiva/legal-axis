// src/admin/ManageCases.tsx
import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Case {
  id: string;
  title: string;
  status: string;
  description: string;
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

  if (loading) return <p className="p-4">Loading cases...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Cases</h2>
      <div className="space-y-4">
        {cases.map((c) => (
          <div key={c.id} className="border rounded p-4 bg-white shadow-sm">
            <input
              className="text-xl font-semibold text-gray-800 mb-2 w-full border-b focus:outline-none"
              value={c.title}
              onChange={(e) => handleUpdate(c.id, 'title', e.target.value)}
            />
            <select
              value={c.status}
              onChange={(e) => handleUpdate(c.id, 'status', e.target.value)}
              className="mt-2 border p-1 rounded"
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
            <p className="mt-2 text-sm text-gray-600">{c.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageCases;

