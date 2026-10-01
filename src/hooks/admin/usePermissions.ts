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
  
  // Restricted delete and management access: ONLY these specific emails
  const userEmail = user?.email?.toLowerCase();
  const isAllowedToManage =
    userEmail === 'sabreena@bambinos.live' ||
    userEmail === 'krishna.nair@bambinos.live' ||
    userEmail === 'adithya@bambinos.live';
  
  return {
    // Delete button: now strictly based on the allowed email list
    canDelete: isAllowedToManage,

    // Interviewer management: only specific users can see the button
    canManageInterviewers: isAllowedToManage,
    
    // Email/WhatsApp redirect: only limited admins can see (hidden for main admin)
    canSeeEmailWhatsApp: isLimitedAdmin,
    
    // Role identifiers
    isFullAdmin,
    isLimitedAdmin
  };
};

export default usePermissions;

