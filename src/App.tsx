import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { useCallback } from 'react';
import { createDummyCaseChat } from './services/chatService';

// Layout and shared components
import Layout from './components/Layout';
import Footer from './components/Footer';

// Public pages
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';

// Auth pages
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';

// User and dashboard
import Profile from './pages/Profile';
import Dashboard from './components/Dashboard';

// Lawyer pages
import LawyersList from './components/lawyers/LawyersList';
import LawyerProfile from './components/lawyers/LawyerProfile';

// Case management pages
import CasesList from './components/cases/CasesList';
import CaseDetail from './components/cases/CaseDetail';
import CreateCase from './components/cases/CreateCase';
import EditCase from './components/cases/EditCase';

// Admin pages
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import EditLawyer from './admin/EditLawyer';
import ManageCases from './admin/ManageCases';
import ProtectedAdminRoute from './admin/ProtectedAdminRoute';

const App = () => {
  return (
    <AdminAuthProvider>
      <AuthProvider>
        <Router>
          <div className="pt-16">
            <Layout>
              <Routes>
                {/* Public Pages */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/terms" element={<TermsAndConditions />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />

                {/* Auth */}
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />

                {/* User Profile & Dashboard */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Lawyer Pages */}
                <Route path="/lawyers" element={<LawyersList />} />
                <Route path="/lawyers/:id" element={<LawyerProfile />} />

                {/* Case Management */}
                <Route path="/cases" element={<CasesList />} />
                <Route path="/cases/create" element={<CreateCase />} />
                <Route path="/cases/:id" element={<CaseDetail />} />
                <Route path="/cases/:id/edit" element={<EditCase />} />

                {/* Admin */}
                <Route path="/admin" element={<AdminLogin />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedAdminRoute>
                      <AdminDashboard />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/cases"
                  element={
                    <ProtectedAdminRoute>
                      <ManageCases />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/lawyers/:id/edit"
                  element={
                    <ProtectedAdminRoute>
                      <EditLawyer />
                    </ProtectedAdminRoute>
                  }
                />
              </Routes>
              <Footer />
            </Layout>
          </div>
        </Router>
      </AuthProvider>
    </AdminAuthProvider>
  );
};

export default App;







