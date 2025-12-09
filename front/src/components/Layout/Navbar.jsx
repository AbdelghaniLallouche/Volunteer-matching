import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  
  const isVolunteer = user?.role === 'volunteer';
  const baseRoute = isVolunteer ? '/volunteer' : '/association';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && isVolunteer) {
      navigate(`/volunteer/search-associations?search=${searchQuery}`);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={`${baseRoute}/missions`} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-vibrant-green to-deep-green rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="text-xl font-bold text-deep-green hidden sm:block">Valunteer</span>
          </Link>

          {/* Search - Volunteer Only */}
          {isVolunteer && (
            <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full px-4 py-2 text-sm bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-vibrant-green/20 focus:outline-none transition-all"
              />
            </form>
          )}

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {isVolunteer ? (
              <>
                <Link
                  to="/volunteer/missions"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/volunteer/missions')
                      ? 'bg-vibrant-green/10 text-vibrant-green'
                      : 'text-gray-600 hover:text-vibrant-green hover:bg-gray-50'
                  }`}
                >
                  Missions
                </Link>
                <Link
                  to="/volunteer/history"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/volunteer/history')
                      ? 'bg-vibrant-green/10 text-vibrant-green'
                      : 'text-gray-600 hover:text-vibrant-green hover:bg-gray-50'
                  }`}
                >
                  History
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/association/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/association/dashboard')
                      ? 'bg-vibrant-green/10 text-vibrant-green'
                      : 'text-gray-600 hover:text-vibrant-green hover:bg-gray-50'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/association/missions"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/association/missions')
                      ? 'bg-vibrant-green/10 text-vibrant-green'
                      : 'text-gray-600 hover:text-vibrant-green hover:bg-gray-50'
                  }`}
                >
                  Missions
                </Link>
              </>
            )}

            {/* Profile Icon */}
            <Link
              to={`${baseRoute}/profile`}
              className={`p-2 rounded-lg transition-colors ${
                isActive(`${baseRoute}/profile`)
                  ? 'bg-vibrant-green/10 text-vibrant-green'
                  : 'text-gray-600 hover:text-vibrant-green hover:bg-gray-50'
              }`}
              title="Profile"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            {/* Logout Icon */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-gray-600 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
