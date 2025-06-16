import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface Lawyer {
  id: string;
  name: string;
  specialization: string[];
  experience: number;
  rating: number;
  imageUrl: string;
  bio: string;
  userType: string;
  email: string;
}

export default function LawyersList() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [filteredLawyers, setFilteredLawyers] = useState<Lawyer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const specializations = [
    'Family Law',
    'Criminal Law',
    'Corporate Law',
    'Real Estate Law',
    'Intellectual Property',
    'Immigration Law',
    'Employment Law',
    'Tax Law',
  ];

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const q = query(collection(db, 'users'), where('userType', '==', 'lawyer'));
        const querySnapshot = await getDocs(q);
        const lawyersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name || 'Unnamed Lawyer',
          specialization: doc.data().specialization || [],
          experience: doc.data().experience || 0,
          rating: doc.data().rating || 0,
          imageUrl: doc.data().imageUrl || '',
          bio: doc.data().bio || 'No bio available',
          userType: doc.data().userType || 'lawyer',
          email: doc.data().email || '',
        })) as Lawyer[];
        setLawyers(lawyersData);
        setFilteredLawyers(lawyersData);
      } catch (error) {
        console.error('Error fetching lawyers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLawyers();
  }, []);

  useEffect(() => {
    let filtered = lawyers;

    if (searchTerm) {
      filtered = filtered.filter(lawyer =>
        lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lawyer.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lawyer.specialization || []).some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedSpecialization) {
      filtered = filtered.filter(lawyer =>
        (lawyer.specialization || []).includes(selectedSpecialization)
      );
    }

    setFilteredLawyers(filtered);
  }, [searchTerm, selectedSpecialization, lawyers]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find a Lawyer</h1>
          <p className="mt-2 text-gray-600">Browse our network of experienced legal professionals</p>
        </div>

        <div className="mb-8 space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, specialization, or keywords..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
          >
            <option value="">All Specializations</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLawyers.map((lawyer) => (
              <Link
                key={lawyer.id}
                to={`/lawyers/${lawyer.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={lawyer.imageUrl || 'https://via.placeholder.com/400x300'}
                    alt={lawyer.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{lawyer.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(lawyer.specialization || []).map((spec) => (
                      <span
                        key={spec}
                        className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{lawyer.bio}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1 text-gray-600">{lawyer.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-gray-600">{lawyer.experience} years experience</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && filteredLawyers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No lawyers found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
} 