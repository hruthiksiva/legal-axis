import React from 'react';

const Dashboard: React.FC = () => {
  // Mock data - replace with actual data from your backend
  const stats = {
    totalCases: 25,
    activeCases: 12,
    completedCases: 13,
    upcomingAppointments: 3
  };

  const recentCases = [
    {
      id: 1,
      title: "Smith vs. Johnson",
      status: "Active",
      nextHearing: "2024-03-20",
      type: "Civil"
    },
    {
      id: 2,
      title: "State vs. Williams",
      status: "Active",
      nextHearing: "2024-03-22",
      type: "Criminal"
    },
    {
      id: 3,
      title: "Brown vs. Corporation",
      status: "Completed",
      nextHearing: "N/A",
      type: "Corporate"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-500">Total Cases</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalCases}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-500">Active Cases</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.activeCases}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-500">Completed Cases</h3>
            <p className="text-3xl font-bold text-green-600">{stats.completedCases}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-500">Upcoming Appointments</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.upcomingAppointments}</p>
          </div>
        </div>

        {/* Recent Cases */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Cases</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Case Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Hearing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentCases.map((case_) => (
                  <tr key={case_.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{case_.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        case_.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {case_.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {case_.nextHearing}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {case_.type}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 