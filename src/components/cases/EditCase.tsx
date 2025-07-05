import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

const categories = [
  'Family Law',
  'Criminal Law',
  'Corporate Law',
  'Real Estate Law',
  'Intellectual Property',
  'Immigration Law',
  'Employment Law',
  'Tax Law',
];

const EditCase: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    deadline: '',
    status: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        if (!id) return;

        const caseDoc = await getDoc(doc(db, 'cases', id));
        if (!caseDoc.exists()) {
          throw new Error('Case not found');
        }

        const caseData = caseDoc.data();

        if (caseData.clientId !== user?.uid) {
          throw new Error('You are not authorized to edit this case');
        }

        setFormData({
          title: caseData.title || '',
          description: caseData.description || '',
          category: caseData.category || '',
          budget: caseData.budget || '',
          deadline: caseData.deadline || '',
          status: caseData.status || 'open',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load case');
        console.error('Error fetching case:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, [id, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSaving(true);
    setError(null);

    try {
      await updateDoc(doc(db, 'cases', id), {
        ...formData,
        updatedAt: new Date(),
      });

      navigate(`/cases/${id}`);
    } catch (err) {
      setError('Failed to update case. Please try again.');
      console.error('Error updating case:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/cases')}
            className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Back to Cases
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div className="min-h-screen bg-gray-50 py-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <motion.div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Case</h1>

            {error && (
              <motion.div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Case Title</label>
                <input type="text" id="title" name="title" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" value={formData.title} onChange={handleChange} />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Case Description</label>
                <textarea id="description" name="description" rows={4} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" value={formData.description} onChange={handleChange} />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                <select id="category" name="category" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" value={formData.category} onChange={handleChange}>
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700">Budget</label>
                <input type="text" id="budget" name="budget" required placeholder="e.g., $5000 - $10000" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" value={formData.budget} onChange={handleChange} />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Deadline</label>
                <input type="date" id="deadline" name="deadline" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" value={formData.deadline} onChange={handleChange} />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                <select id="status" name="status" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" value={formData.status} onChange={handleChange}>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
              </motion.div>

              <motion.div className="flex justify-end space-x-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <button type="button" onClick={() => navigate(`/cases/${id}`)} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </motion.div>
            </form>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditCase;