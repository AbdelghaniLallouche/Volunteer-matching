import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  
  const isVolunteer = location.pathname.includes('/volunteer');
  const isAssociation = location.pathname.includes('/association');
  const basePath = isVolunteer ? '/volunteer' : '/association';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/volunteer/search-associations?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (!isVolunteer && !isAssociation) return null;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to={isVolunteer ? '/volunteer/missions' : `${basePath}/dashboard`} className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-vibrant-green to-deep-green rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl font-bold">V</span>
            </div>
            <span className="text-2xl font-bold text-vibrant-green">Valunteer</span>
          </Link>

          {/* Search Bar (Volunteer Only) */}
          {isVolunteer && (
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for associations..."
                  className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-vibrant-green focus:outline-none transition-colors"
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>
          )}

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {isAssociation && (
              <Link to={`${basePath}/dashboard`} className="text-deep-green hover:text-vibrant-green font-medium transition-colors">
                Dashboard
              </Link>
            )}
            <Link to={`${basePath}/missions`} className="text-deep-green hover:text-vibrant-green font-medium transition-colors">
              {isVolunteer ? 'Missions' : 'Missions'}
            </Link>
            {isVolunteer && (
              <Link to={`${basePath}/history`} className="text-deep-green hover:text-vibrant-green font-medium transition-colors">
                History
              </Link>
            )}
            <Link to={`${basePath}/profile`} className="text-deep-green hover:text-vibrant-green font-medium transition-colors">
              Profile
            </Link>
            <button onClick={handleLogout} className="btn-primary py-2 px-4 text-sm">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
