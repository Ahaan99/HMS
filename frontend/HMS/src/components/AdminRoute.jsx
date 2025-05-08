import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  const storedUser = JSON.parse(localStorage.getItem('user'));

  if (!user && !storedUser) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user?.role === 'admin' || storedUser?.role === 'admin';
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
