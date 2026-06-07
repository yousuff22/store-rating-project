import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types';

interface Props {
  children: React.ReactNode;
  allowedRoles: Role[];
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="loading-fullscreen">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
