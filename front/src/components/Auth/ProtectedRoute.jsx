import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, token } = useSelector((state) => state.auth);

  // Check if user is authenticated
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has the correct role
  if (allowedRole && user.role !== allowedRole) {
    // Redirect to their correct dashboard
    return <Navigate to={`/${user.role}/missions`} replace />;
  }

  return children;
};

export default ProtectedRoute;
