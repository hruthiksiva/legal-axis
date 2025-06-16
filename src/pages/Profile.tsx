import React from 'react';

const Profile: React.FC = () => {
  // Mock user data - replace with actual user data from your auth context
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    specialization: "Corporate Law",
    experience: "10 years",
    barAssociation: "State Bar Association",
    profilePicture: "https://via.placeholder.com/150"
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              {/* Profile Picture */}
              <div className="flex-shrink-0">
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover"
                />
              </div>

              {/* Profile Information */}
              <div className="flex-grow">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">{user.name}</h1>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Specialization</label>
                    <p className="text-gray-900">{user.specialization}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Experience</label>
                    <p className="text-gray-900">{user.experience}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Bar Association</label>
                    <p className="text-gray-900">{user.barAssociation}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Profile Button */}
            <div className="mt-6 flex justify-end">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 