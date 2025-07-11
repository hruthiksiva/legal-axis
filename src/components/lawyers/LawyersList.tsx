import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { motion } from 'framer-motion';

interface Lawyer {
  id: string;
  firstName?: string;
  lastName?: string;
  specialization: string[];
  experience: number;
  rating: number;
  profilePicture?: string;
  bio: string;
  userType: string;
  email: string;
  education?: string;
  languages?: string[];
  barAssociations?: string[];
  contactEmail?: string;
  contactPhone?: string;
  state?: string;
  postalCode?: string;
}

export default function LawyersList() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [filteredLawyers, setFilteredLawyers] = useState<Lawyer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const specializations = [
    'Criminal Law',
    'Family Law',
    'Corporate Law',
    'Civil Law',
    'Intellectual Property',
    'Employment Law',
    'Property Law',
    'Tax Law',
  ];

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const q = query(collection(db, 'users'), where('userType', '==', 'lawyer'));
        const querySnapshot = await getDocs(q);
        const lawyersData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          const firstName = data.firstName || '';
          const lastName = data.lastName || '';
          const fullName = `${firstName} ${lastName}`.trim() || 'Unnamed Lawyer';
          
          return {
            id: doc.id,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            specialization: data.specialization || [],
            experience: data.experience || 0,
            rating: data.rating || 0,
            profilePicture: data.profilePicture || '',
            bio: data.bio || 'No bio available',
            userType: data.userType || 'lawyer',
            email: data.email || '',
            education: data.education || '',
            languages: data.languages || [],
            barAssociations: data.barAssociations || [],
            contactEmail: data.contactEmail || '',
            contactPhone: data.contactPhone || '',
            state: data.state || '',
            postalCode: data.postalCode || '',
          } as Lawyer;
        });
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
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(lawyer => {
        const fullName = `${lawyer.firstName} ${lawyer.lastName}`.toLowerCase();
        const bioLower = lawyer.bio.toLowerCase();
        const educationLower = (lawyer.education || '').toLowerCase();
        const languagesLower = (lawyer.languages || []).join(' ').toLowerCase();
        const barAssociationsLower = (lawyer.barAssociations || []).join(' ').toLowerCase();
        
        return fullName.includes(searchLower) ||
               bioLower.includes(searchLower) ||
               educationLower.includes(searchLower) ||
               languagesLower.includes(searchLower) ||
               barAssociationsLower.includes(searchLower) ||
               (lawyer.specialization || []).some(spec => spec.toLowerCase().includes(searchLower));
      });
    }

    if (selectedSpecialization) {
      filtered = filtered.filter(lawyer =>
        (lawyer.specialization || []).includes(selectedSpecialization)
      );
    }

    setFilteredLawyers(filtered);
  }, [searchTerm, selectedSpecialization, lawyers]);

  const getFullName = (lawyer: Lawyer) => {
    const firstName = lawyer.firstName || '';
    const lastName = lawyer.lastName || '';
    return `${firstName} ${lastName}`.trim() || 'Unnamed Lawyer';
  };

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">Find a Lawyer</h1>
          <p className="mt-2 text-gray-600">Browse our network of experienced legal professionals</p>
        </motion.div>

        <motion.div 
          className="mb-8 space-y-4 sm:space-y-0 sm:flex sm:space-x-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, specialization, education, languages, or keywords..."
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
        </motion.div>

        {loading ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
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
            {filteredLawyers.map((lawyer) => (
              <motion.div
                key={lawyer.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-2xl shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="relative">
                  <img
                    src={
                      lawyer.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(getFullName(lawyer))}&background=random&size=400`
                    }
                    alt={getFullName(lawyer)}
                    className="w-full h-48 object-cover rounded-t-2xl"
                  />
                  {lawyer.rating > 0 && (
                    <div className="absolute top-3 right-3 bg-white bg-opacity-90 px-2 py-1 rounded-full flex items-center">
                      <span className="text-yellow-400 text-sm">★</span>
                      <span className="ml-1 text-sm font-medium">{lawyer.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                <Link to={`/lawyers/${lawyer.id}`} className="block p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{getFullName(lawyer)}</h3>
                  
                  {/* Education */}
                  {lawyer.education && (
                    <p className="text-sm text-gray-500 mb-2">{lawyer.education}</p>
                  )}
                  
                  {/* Specializations */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(lawyer.specialization || []).map((spec) => (
                      <span
                        key={spec}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                  
                  {/* Bio */}
                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{lawyer.bio}</p>
                  
                  {/* Languages */}
                  {lawyer.languages && lawyer.languages.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Languages:</p>
                      <div className="flex flex-wrap gap-1">
                        {lawyer.languages.slice(0, 3).map((lang) => (
                          <span
                            key={lang}
                            className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full"
                          >
                            {lang}
                          </span>
                        ))}
                        {lawyer.languages.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                            +{lawyer.languages.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Contact Info */}
                  {(lawyer.contactEmail || lawyer.contactPhone) && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Contact:</p>
                      <div className="space-y-1">
                        {lawyer.contactEmail && (
                          <p className="text-xs text-blue-600 truncate">{lawyer.contactEmail}</p>
                        )}
                        {lawyer.contactPhone && (
                          <p className="text-xs text-gray-600">{lawyer.contactPhone}</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Location */}
                  {(lawyer.state || lawyer.postalCode) && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500">
                        📍 {lawyer.state} {lawyer.postalCode}
                      </p>
                    </div>
                  )}
                  
                  {/* Experience and Rating */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center">
                      {lawyer.rating > 0 && (
                        <>
                          <span className="text-yellow-400 text-sm">★</span>
                          <span className="ml-1 text-sm text-gray-600">{lawyer.rating.toFixed(1)}</span>
                        </>
                      )}
                    </div>
                    <span className="text-sm text-gray-600">
                      {lawyer.experience} {lawyer.experience === 1 ? 'year' : 'years'} experience
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && filteredLawyers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No lawyers found matching your criteria.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

