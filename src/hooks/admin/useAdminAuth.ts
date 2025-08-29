import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';

export const useAdminAuth = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("You have been successfully logged out");
      navigate('/admin/login');
    } catch (error) {
      console.error('Error during logout:', error);
      navigate('/admin/login');
    }
  };

  return {
    handleLogout
  };
};
