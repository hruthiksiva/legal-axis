import * as React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MessageCircle } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, userData, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileOpen(false);
      setIsMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleDashboardClick = () => {
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    navigate('/dashboard');
  };

  const getInitials = (firstName: string = '', lastName: string = '') => {
    const first = firstName.trim().charAt(0) || '';
    const last = lastName.trim().charAt(0) || '';
    return (first + last).toUpperCase();
  };

  const displayName = userData?.firstName || user?.displayName || 'User';
  const initials = getInitials(userData?.firstName, userData?.lastName);
  const profilePic = userData?.profilePicture;

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-black">Legal Axis</Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {['/', '/lawyers', '/cases', '/about', '/contact'].map((path, index) => {
              const labels = ['Home', 'Lawyers', 'Cases', 'About Us', 'Contact Us'];
              return (
                <Link
                  key={path}
                  to={path}
                  className="text-gray-600 hover:text-orange-500 transition-colors duration-200"
                >
                  {labels[index]}
                </Link>
              );
            })}

            {user ? (
              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <img
                    src={
                      profilePic ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&size=128`
                    }
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="text-gray-600">{displayName}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={handleDashboardClick}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                    >
                      {userData?.userType === 'client' ? 'Client Dashboard' : 'Lawyer Dashboard'}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                    >
                      Logout
                    </button>
                    {user && (
                      <button
                        onClick={() => navigate('/chat')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                      >
                        <span className="flex items-center"><MessageCircle className="w-5 h-5 mr-2" /> Chat</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/signin"
                className="text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-orange-500 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 space-y-1">
            {['/', '/lawyers', '/cases', '/about', '/contact'].map((path, index) => {
              const labels = ['Home', 'Lawyers', 'Cases', 'About Us', 'Contact Us'];
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={toggleMenu}
                  className="block px-4 py-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-md"
                >
                  {labels[index]}
                </Link>
              );
            })}
            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={toggleMenu}
                  className="block px-4 py-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-md"
                >
                  View Profile
                </Link>
                <button
                  onClick={handleDashboardClick}
                  className="block w-full text-left px-4 py-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-md"
                >
                  {userData?.userType === 'client' ? 'Client Dashboard' : 'Lawyer Dashboard'}
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-md"
                >
                  Logout
                </button>
                {user && (
                  <button
                    onClick={() => { toggleMenu(); navigate('/chat'); }}
                    className="block px-4 py-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-md w-full text-left"
                  >
                    <span className="flex items-center"><MessageCircle className="w-5 h-5 mr-2" /> Chat</span>
                  </button>
                )}
              </>
            ) : (
              <Link
                to="/signin"
                onClick={toggleMenu}
                className="block px-4 py-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-md"
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;



