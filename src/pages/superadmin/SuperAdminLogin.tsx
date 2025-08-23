
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, Lock, Crown } from "lucide-react";

const SuperAdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    
    // Simulate super admin authentication
    setTimeout(() => {
      setIsLoading(false);
      
      // TODO: Implement proper super admin authentication
      toast.error("Super admin authentication not configured");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bambinos-skin to-bambinos-pink/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <img src="/lovable-uploads/1bd88e64-73eb-4b2c-8096-218b1fce8646.png" alt="Bambinos.live" className="w-12 h-12 rounded-full" />
            </div>
            <h1 className="text-3xl font-bold text-bambinos-blue">Bambinos.live</h1>
          </div>
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <Crown className="h-5 w-5 text-bambinos-orange" />
            <span>Super Admin Portal</span>
          </div>
        </div>

        <Card className="border-bambinos-blue/20 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-bambinos-blue">Super Admin Access</CardTitle>
            <CardDescription>
              Sign in to access the super administration dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-bambinos-blue font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="superadmin@bambinos.live"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10 border-bambinos-blue/30 focus:border-bambinos-blue focus:ring-bambinos-blue"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-bambinos-blue font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10 border-bambinos-blue/30 focus:border-bambinos-blue focus:ring-bambinos-blue"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-bambinos-blue to-bambinos-pink hover:from-bambinos-blue/90 hover:to-bambinos-pink/90 text-white py-3 text-lg font-semibold transition-all duration-300 hover:shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

          </CardContent>
        </Card>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-bambinos-blue hover:text-bambinos-blue/80"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
