import { useAdminAuth } from '../contexts/AdminAuthContext';
import ManageLawyers from './ManageLawyers';
import AddLawyer from './AddLawyer';
import ManageCases from './ManageCases'; // ✅ Manage Cases Import

const AdminDashboard = () => {
  const { logout, admin } = useAdminAuth();

  if (!admin) {
    return <p className="p-10 text-red-600 font-semibold">Unauthorized access</p>;
  }

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          Welcome, {admin.displayName || admin.email}
        </h1>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-all"
        >
          Logout
        </button>
      </div>

      {/* Lawyer Management */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
        <div className="bg-white rounded-lg shadow-md p-6">
          <AddLawyer />
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 overflow-auto">
          <ManageLawyers />
        </div>
      </div>

      {/* Case Management */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Manage Cases</h2>
        <ManageCases />
      </div>
    </div>
  );
};

export default AdminDashboard;





