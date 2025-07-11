import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { motion } from 'framer-motion';

interface Lawyer {
  id: string;
  name: string;
  specialization: string[];
  experience: number;
  rating: number;
  imageUrl: string;
  bio: string;
  email: string;
  barAssociation: string;
  education: string[]; // ← must be array
  languages: string[];
  contactNumber: string;
}

const LawyerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLawyer = async () => {
      try {
        if (!id) throw new Error('Lawyer ID is required');
        const lawyerDoc = await getDoc(doc(db, 'users', id));
        if (!lawyerDoc.exists()) throw new Error('Lawyer not found');
        const data = lawyerDoc.data();
        console.log('Fetched Lawyer:', data);

        setLawyer({
          id: lawyerDoc.id,
          name: data.name ?? 'Unnamed Lawyer',
          specialization: Array.isArray(data.specialization) ? data.specialization : [],
          experience: Number(data.experience) || 0,
          rating: Number(data.rating) || 0,
          imageUrl: data.imageUrl ?? '',
          bio: data.bio ?? 'No bio available',
          email: data.email ?? '',
          barAssociation: data.barAssociation ?? '',
          education: typeof data.education === 'string' ? [data.education] : data.education ?? [],
          languages: Array.isArray(data.languages) ? data.languages : [],
          contactNumber: data.phone ?? data.contactNumber ?? '',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchLawyer();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !lawyer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error || 'Lawyer not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
          <div className="relative h-48 bg-blue-600">
            <img
              src={
                lawyer.imageUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(lawyer.name)}&background=random&size=128`
              }
              alt={lawyer.name}
              className="w-32 h-32 rounded-full border-4 border-white object-cover absolute -bottom-16 left-8"
            />
            {/* Chat Button */}
            <button
              className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg transition"
              onClick={() => navigate('/lawyer/chat')}
              title="View Client Chats"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 15.75a6.75 6.75 0 01-2.458-1.393c-1.257-1.143-2.042-2.57-2.042-4.107C4.125 6.885 7.76 3.75 12 3.75s7.875 3.135 7.875 6.5c0 1.537-.785 2.964-2.042 4.107a6.75 6.75 0 01-2.458 1.393l-.13.043a.75.75 0 00-.495.7v.457a2.25 2.25 0 01-2.25 2.25h-1.5a2.25 2.25 0 01-2.25-2.25v-.457a.75.75 0 00-.495-.7l-.13-.043z" />
              </svg>
              Chat
            </button>
          </div>

          <div className="pt-20 px-8 pb-10">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">{lawyer.name}</h1>
            <p className="text-gray-600 mb-4">{lawyer.bio}</p>

            <div className="mb-6">
              <strong>Rating:</strong> {lawyer.rating.toFixed(1)} ★ |{' '}
              <strong>Experience:</strong> {lawyer.experience} years
            </div>

            <Section title="Specializations">
              <div className="flex flex-wrap gap-2">
                {lawyer.specialization?.map((spec) => (
                  <span key={spec} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{spec}</span>
                ))}
              </div>
            </Section>

            <Section title="Education">
              {lawyer.education.length > 0 ? (
                <ul className="list-disc ml-6 text-gray-700">
                  {lawyer.education.map((edu, idx) => (
                    <li key={idx}>{edu}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No education details available.</p>
              )}
            </Section>

            <Section title="Languages">
              <div className="flex flex-wrap gap-2">
                {lawyer.languages.map((lang) => (
                  <span key={lang} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">{lang}</span>
                ))}
              </div>
            </Section>

            <Section title="Contact Information">
              <p className="text-gray-700"><strong>Email:</strong> {lawyer.email}</p>
              <p className="text-gray-700"><strong>Phone:</strong> {lawyer.contactNumber}</p>
              <p className="text-gray-700"><strong>Bar Association:</strong> {lawyer.barAssociation}</p>
            </Section>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mt-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
    {children}
  </div>
);

export default LawyerProfile;


