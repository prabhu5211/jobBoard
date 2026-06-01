import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice.js';

/**
 * Convenience hook for accessing auth state and actions.
 */
const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, error, token } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isCandidate = user?.role === 'candidate';
  const isRecruiter = user?.role === 'recruiter';
  const isAdmin = user?.role === 'admin';

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    isCandidate,
    isRecruiter,
    isAdmin,
    logout: handleLogout,
  };
};

export default useAuth;
