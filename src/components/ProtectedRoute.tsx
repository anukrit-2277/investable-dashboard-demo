import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { UserType } from '@/context/UserContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedUserTypes?: UserType[];
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  allowedUserTypes = ['superadmin', 'investor', 'company'], 
  redirectTo = '/auth' 
}: ProtectedRouteProps) => {
  const { userType, isLoading } = useUser();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!userType || !allowedUserTypes.includes(userType)) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 