import * as React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';

interface UserData {
  userType: 'lawyer' | 'client';
  email: string;
  firstName?: string;
  lastName?: string;
  specialization?: string[];
  experience?: number;
  rating?: number;
  bio?: string;
  education?: string;
  barAssociations?: string[];
  languages?: string[];
  contactEmail?: string;
  contactPhone?: string;
  state?: string;
  postalCode?: string;
  profilePicture?: string;
}

const specializationOptions = [
  'Criminal Law',
  'Family Law',
  'Corporate Law',
  'Civil Law',
  'Intellectual Property',
  'Employment Law',
  'Property Law',
  'Tax Law'
];

const educationOptions = [
  'LLB',
  'LLM',
  'BA LLB',
  'BBA LLB',
  'BCom LLB',
  'PhD in Law',
  'Diploma in Cyber Law',
  'Diploma in Taxation Law'
];

export default function Profile() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserData | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showSpecDropdown, setShowSpecDropdown] = useState(false);
  const [showEduDropdown, setShowEduDropdown] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data() as UserData;
            setUserData(data);
            setFormData(data);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setError('Failed to load profile data');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? undefined : Number(value);
    setFormData(prev => prev ? { ...prev, [name]: numValue } : null);
  };

  const handleArrayInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof UserData) => {
    const { value } = e.target;
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value.split(',').map(item => item.trim()).filter(Boolean)
      };
    });
  };

  const handleSpecializationSelect = (spec: string) => {
    if (!formData?.specialization?.includes(spec)) {
      setFormData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          specialization: [...(prev.specialization || []), spec]
        };
      });
    }
    setShowSpecDropdown(false);
  };

  const handleRemoveSpecialization = (spec: string) => {
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        specialization: prev.specialization?.filter(s => s !== spec) || []
      };
    });
  };

  const handleEducationSelect = (edu: string) => {
    setFormData(prev => {
      if (!prev) return null;
      return { ...prev, education: edu };
    });
    setShowEduDropdown(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    const fileType = file.type.split('/')[0];
    
    if (fileType !== 'image') {
      setError('Please upload an image file');
      return;
    }

    try {
      setUploadingImage(true);
      setError('');
      const storageRef = ref(storage, `profile-pictures/${user.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      if (formData) {
        const updatedData = { ...formData, profilePicture: downloadURL };
        await updateDoc(doc(db, 'users', user.uid), updatedData);
        setFormData(updatedData);
        setUserData(updatedData);
        setSuccess('Profile picture updated successfully');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload profile picture');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData) return;

    try {
      setError('');
      setSuccess('');
      const updated = { ...formData };
      await updateDoc(doc(db, 'users', user.uid), updated);
      setUserData(formData);
      setIsEditing(false);
      setSuccess('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    }
  };

  const handleContactLawyer = () => {
    if (userData?.contactPhone) {
      window.location.href = `tel:${userData.contactPhone}`;
    } else if (userData?.contactEmail) {
      window.location.href = `mailto:${userData.contactEmail}`;
    } else {
      setError('No contact information available');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Profile not found</h2>
          <p className="mt-2 text-gray-600">Unable to load your profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
              <div className="flex space-x-4">
                {userData.userType === 'lawyer' && (
                  <button
                    onClick={handleContactLawyer}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    Contact Lawyer
                  </button>
                )}
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <img
                    src={userData.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.firstName || 'User')}&size=200`}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                      {uploadingImage ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </label>
                  )}
                </div>
              </div>

              {/* Basic Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={userData.email}
                      disabled
                      className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData?.firstName || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData?.lastName || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData?.contactEmail || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData?.contactPhone || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData?.state || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData?.postalCode || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              {/* Lawyer-specific Information */}
              {userData.userType === 'lawyer' && (
                <>
                  {/* Professional Information */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
                        <input
                          type="number"
                          name="experience"
                          value={formData?.experience || ''}
                          onChange={handleNumberInputChange}
                          disabled={!isEditing}
                          min="0"
                          max="50"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Rating (1-5)</label>
                        <input
                          type="number"
                          name="rating"
                          value={formData?.rating || ''}
                          onChange={handleNumberInputChange}
                          disabled={!isEditing}
                          min="1"
                          max="5"
                          step="0.1"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    {/* Specialization Tag Selector */}
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Specializations</label>
                      <div className="relative">
                        <div
                          className="border p-3 rounded-md bg-white cursor-pointer min-h-[44px] flex items-center"
                          onClick={() => isEditing && setShowSpecDropdown(!showSpecDropdown)}
                        >
                          {!formData?.specialization || formData.specialization.length === 0 ? (
                            <span className="text-gray-400">Select Specializations</span>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {formData.specialization.map((spec) => (
                                <span
                                  key={spec}
                                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                                >
                                  {spec}
                                  {isEditing && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveSpecialization(spec);
                                      }}
                                      className="ml-1 text-red-600 hover:text-red-800"
                                    >
                                      ×
                                    </button>
                                  )}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        {showSpecDropdown && isEditing && (
                          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-40 overflow-auto">
                            {specializationOptions.map((spec) => (
                              <div
                                key={spec}
                                onClick={() => handleSpecializationSelect(spec)}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                              >
                                {spec}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Education Dropdown */}
                    <div className="mt-6 relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                      <div
                        onClick={() => isEditing && setShowEduDropdown(!showEduDropdown)}
                        className="w-full border p-3 rounded-md bg-white cursor-pointer"
                      >
                        {formData?.education || 'Select Education'}
                      </div>
                      {showEduDropdown && isEditing && (
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-40 overflow-auto">
                          {educationOptions.map((edu) => (
                            <div
                              key={edu}
                              onClick={() => handleEducationSelect(edu)}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            >
                              {edu}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Languages */}
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700">Languages Spoken (comma-separated)</label>
                      <input
                        type="text"
                        name="languages"
                        value={formData?.languages?.join(', ') || ''}
                        onChange={(e) => handleArrayInputChange(e, 'languages')}
                        disabled={!isEditing}
                        placeholder="English, Spanish, French"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    {/* Bar Associations */}
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700">Bar Associations (comma-separated)</label>
                      <input
                        type="text"
                        name="barAssociations"
                        value={formData?.barAssociations?.join(', ') || ''}
                        onChange={(e) => handleArrayInputChange(e, 'barAssociations')}
                        disabled={!isEditing}
                        placeholder="State Bar Association, American Bar Association"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    {/* Bio */}
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700">Bio</label>
                      <textarea
                        name="bio"
                        value={formData?.bio || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        rows={4}
                        placeholder="Tell us about your legal expertise, experience, and what makes you unique..."
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </>
              )}

              {isEditing && (
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
