import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

interface Lawyer {
  id: string;
  name: string;
  email: string;
  specialization: string[];
  experience: number;
  rating: number;
  bio: string;
}

const ManageLawyers = () => {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchLawyers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const fetched: Lawyer[] = [];

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();

        if (data.userType !== 'lawyer') return;

        const lawyer: Lawyer = {
          id: docSnap.id,
          name: data.name || 'N/A',
          email: data.email || 'N/A',
          specialization: Array.isArray(data.specialization) ? data.specialization : [],
          experience: typeof data.experience === 'number' ? data.experience : 0,
          rating: typeof data.rating === 'number' ? data.rating : 0,
          bio: data.bio || '',
        };

        fetched.push(lawyer);
      });

      setLawyers(fetched);
    } catch (error) {
      console.error('Error fetching lawyers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'users', id));
      setLawyers((prev) => prev.filter((lawyer) => lawyer.id !== id));
    } catch (err) {
      console.error('Error deleting lawyer:', err);
    }
  };

  useEffect(() => {
    fetchLawyers();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-4">Manage Lawyers</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-left text-sm uppercase tracking-wider">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Specialization</th>
              <th className="p-3">Experience</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {lawyers.map((lawyer) => (
              <tr key={lawyer.id} className="border-t">
                <td className="p-3">{lawyer.name}</td>
                <td className="p-3">{lawyer.email}</td>
                <td className="p-3">{lawyer.specialization.join(', ') || '—'}</td>
                <td className="p-3">{lawyer.experience} yrs</td>
                <td className="p-3">{lawyer.rating}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleDelete(lawyer.id)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => navigate(`/admin/lawyers/${lawyer.id}/edit`)}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageLawyers;



