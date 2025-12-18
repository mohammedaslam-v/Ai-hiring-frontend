import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to manage user permissions based on their role
 * 
 * Permissions:
 * - Main Admin (role: 'admin'):
 *   - Can delete applications
 *   - Cannot see email/whatsapp redirect buttons
 * 
 * - Limited Admin (role: 'limited_admin'):
 *   - Cannot delete applications
 *   - Can see email/whatsapp redirect buttons
 */
export const usePermissions = () => {
  const { user } = useAuth();
  
  const isFullAdmin = user?.role === 'admin';
  const isLimitedAdmin = user?.role === 'limited_admin';
  
  return {
    // Delete button: only main admin can see
    canDelete: isFullAdmin,
    
    // Email/WhatsApp redirect: only limited admins can see (hidden for main admin)
    canSeeEmailWhatsApp: isLimitedAdmin,
    
    // Role identifiers
    isFullAdmin,
    isLimitedAdmin
  };
};

export default usePermissions;

