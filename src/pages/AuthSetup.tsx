import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import AuthDebugPanel from '@/components/AuthDebugPanel';
import { handleAdminSetupSubmit } from '@/utils/admin/authUtils';

const AuthSetup = () => {
  const [email, setEmail] = useState('admin@bambinos.live');
  const [password, setPassword] = useState('SecureAdmin123!');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    handleAdminSetupSubmit(email, password, setIsLoading);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bambinos-skin to-bambinos-pink/20 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Setup</CardTitle>
            <CardDescription>
              Set up the initial admin user for your Bambinos.live application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bambinos.live"
              />
            </div>
            
            <div>
              <Label htmlFor="password">Admin Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a secure password"
              />
            </div>

            <Button 
              onClick={handleSubmit} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Creating Admin...' : 'Create Admin User'}
            </Button>

            <div className="text-center space-y-2">
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin/login')}
              >
                Go to Admin Login
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>

        <AuthDebugPanel />
      </div>
    </div>
  );
};

export default AuthSetup;