
import React, { useState, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BookOpen, Mail, Lock, Shield } from "lucide-react";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signOut, user } = useAuth();
  const [, , , clearAllStorage] = useLocalStorage('authUser', null);

  const handleClearSession = useCallback(async () => {
    try {
      await signOut();
      clearAllStorage(); // Use the custom hook's clearAll method
      toast.info("Session cleared. You can now log in.");
    } catch (error) {
      toast.error("Error clearing session");
    }
  }, [signOut, clearAllStorage]);

  // Check for force logout parameter
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('logout') === 'true') {
      handleClearSession();
    }
  }, [handleClearSession]);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (user) {
      toast.info("You're already logged in! Redirecting to dashboard...");
      const timer = setTimeout(() => {
        navigate('/admin/dashboard');
      }, 2000); // Give user 2 seconds to see the message and potentially clear session
      
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    
    try {
      // Any email/password combination will work now
      const result = await signIn(formData.email, formData.password);
      
      if (result.success) {
        toast.success("Welcome to the admin dashboard!");
        navigate('/admin/dashboard');
      } else {
        toast.error(result.error || "Login failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bambinos-skin to-bambinos-pink/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-bambinos-blue rounded-full flex items-center justify-center">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-bambinos-blue">Bambinos.live</h1>
          </div>
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <Shield className="h-5 w-5" />
            <span>Admin Portal</span>
          </div>
        </div>

        <Card className="border-bambinos-blue/20 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-bambinos-blue">Admin Access</CardTitle>
            <CardDescription>
              Sign in to access the administration dashboard
              <br />
              <span className="text-sm text-green-600 font-medium">💡 Any email and password will work!</span>
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
                    placeholder="admin@bambinos.live"
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
                className="w-full bg-bambinos-blue hover:bg-bambinos-blue/90 text-white py-3 text-lg font-semibold transition-all duration-300 hover:shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-3">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Button 
                  variant="link" 
                  onClick={() => navigate('/admin/signup')}
                  className="text-bambinos-blue hover:text-bambinos-blue/80 p-0 h-auto font-semibold"
                >
                  Sign up here
                </Button>
              </p>
              
              {user && (
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-amber-600 mb-2">Already logged in? Clear your session first:</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleClearSession}
                    className="text-amber-600 border-amber-300 hover:bg-amber-50"
                  >
                    Clear Session
                  </Button>
                </div>
              )}
            </div>
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

export default AdminLogin;
