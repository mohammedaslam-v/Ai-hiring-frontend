import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// import { supabase } from '@/integrations/supabase/client'; // Supabase removed - using mock data
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import { Shield, User, RefreshCw, Plus } from 'lucide-react';

const AuthDebugPanel = () => {
  const { user } = useAuth();
  const [isChecking, setIsChecking] = useState(false);
  const [roleStatus, setRoleStatus] = useState<string>('');

  const checkAdminRole = async () => {
    if (!user) {
      toast.error("No user logged in");
      return;
    }

    setIsChecking(true);
    setRoleStatus('Checking...');

    try {
      // Mock role checking since we removed Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (user.role === 'admin') {
        setRoleStatus('Admin role confirmed');
        toast.success("Admin role confirmed");
      } else {
        setRoleStatus('No admin role found');
        toast.warning("No admin role found");
      }
    } catch (error) {
      setRoleStatus('Error checking role');
      toast.error("Error checking role");
    } finally {
      setIsChecking(false);
    }
  };

  const createAdminRole = async () => {
    if (!user) {
      toast.error("No user logged in");
      return;
    }

    try {
      // Mock admin role creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Admin role created successfully (mock)");
      checkAdminRole();
    } catch (error) {
      toast.error("Unexpected error creating admin role");
    }
  };

  if (!user) {
    return (
      <Card className="m-4">
        <CardHeader>
          <CardTitle>Authentication Debug</CardTitle>
          <CardDescription>Debug panel for authentication and roles</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">No user logged in</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>Authentication Debug</CardTitle>
        <CardDescription>Debug panel for authentication and roles</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">User Information:</h3>
          <p>ID: {user.id}</p>
          <p>Email: {user.email}</p>
        </div>
        
        <div>
          <h3 className="font-semibold">Role Status:</h3>
          <p>{roleStatus || 'Click check role to verify'}</p>
        </div>

        <div className="flex gap-2">
          <Button onClick={checkAdminRole} disabled={isChecking}>
            {isChecking ? 'Checking...' : 'Check Admin Role'}
          </Button>
          <Button onClick={createAdminRole} variant="outline">
            Create Admin Role
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthDebugPanel;