import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  requiredRole = 'admin', 
  redirectTo = '/admin/login' 
}: ProtectedRouteProps) => {
  const { user, loading, hasRole } = useAuth();
  const [roleLoading, setRoleLoading] = useState(true);
  const [hasRequiredRole, setHasRequiredRole] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      if (!user) {
        setRoleLoading(false);
        return;
      }

      const roleCheck = await hasRole(requiredRole);
      setHasRequiredRole(roleCheck);
      setRoleLoading(false);
    };

    checkRole();
  }, [user, requiredRole, hasRole]);

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-bambinos-blue" />
          <span className="text-bambinos-blue">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user || !hasRequiredRole) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;