import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface Review {
  id: string;
  rating: number;
  comment: string;
  clientName: string;
  date: string;
}

interface Service {
  name: string;
  description: string;
  price: string;
}

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
  education: string[];
  languages: string[];
  services: Service[];
  reviews: Review[];
  contactNumber: string;
}

const LawyerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLawyer = async () => {
      try {
        if (!id) {
          throw new Error('Lawyer ID is required');
        }

        const lawyerDoc = await getDoc(doc(db, 'users', id));
        
        if (!lawyerDoc.exists()) {
          throw new Error('Lawyer not found');
        }

        const lawyerData = lawyerDoc.data();
        setLawyer({
          id: lawyerDoc.id,
          name: lawyerData.name || 'Unnamed Lawyer',
          specialization: lawyerData.specialization || [],
          experience: lawyerData.experience || 0,
          rating: lawyerData.rating || 0,
          imageUrl: lawyerData.imageUrl || '',
          bio: lawyerData.bio || 'No bio available',
          email: lawyerData.email || '',
          barAssociation: lawyerData.barAssociation || '',
          education: lawyerData.education || [],
          languages: lawyerData.languages || [],
          services: lawyerData.services || [],
          reviews: lawyerData.reviews || [],
          contactNumber: lawyerData.contactNumber || '',
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
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </>
    );
  }

  if (error || !lawyer) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600">{error || 'Lawyer not found'}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Header Section */}
              <div className="relative h-48 bg-blue-600">
                <div className="absolute -bottom-16 left-8">
                  <img
                    src={lawyer.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(lawyer.name)}&background=random&size=128`}
                    alt={lawyer.name}
                    className="w-32 h-32 rounded-full border-4 border-white object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      // Fallback to a data URL for a simple colored background with initials
                      const initials = lawyer.name
                        .split(' ')
                        .map(word => word[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2);
                      const colors = ['#1a365d', '#2d3748', '#4a5568', '#2c5282', '#2b6cb0'];
                      const randomColor = colors[Math.floor(Math.random() * colors.length)];
                      target.src = `data:image/svg+xml,${encodeURIComponent(`
                        <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="64" cy="64" r="64" fill="${randomColor}"/>
                          <text x="50%" y="50%" font-family="Arial" font-size="40" fill="white" text-anchor="middle" dy=".3em">${initials}</text>
                        </svg>
                      `)}`;
                    }}
                  />
                </div>
              </div>

              {/* Profile Content */}
              <div className="pt-20 px-8 pb-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div className="flex-grow">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{lawyer.name}</h1>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1 text-gray-600">{lawyer.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-gray-600">{lawyer.experience} years experience</span>
                    </div>
                    <p className="text-gray-600 mb-6">{lawyer.bio}</p>
                  </div>

                  {/* Contact Button */}
                  <button className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Contact Lawyer
                  </button>
                </div>

                {/* Specializations */}
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Specializations</h2>
                  <div className="flex flex-wrap gap-2">
                    {lawyer.specialization.map((spec) => (
                      <span
                        key={spec}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Education</h2>
                  <ul className="space-y-2">
                    {lawyer.education.map((edu, index) => (
                      <li key={index} className="text-gray-600">{edu}</li>
                    ))}
                  </ul>
                </div>

                {/* Languages */}
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Languages</h2>
                  <div className="flex flex-wrap gap-2">
                    {lawyer.languages.map((lang) => (
                      <span
                        key={lang}
                        className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <span className="font-medium">Email:</span> {lawyer.email}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Phone:</span> {lawyer.contactNumber}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Bar Association:</span> {lawyer.barAssociation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LawyerProfile; 