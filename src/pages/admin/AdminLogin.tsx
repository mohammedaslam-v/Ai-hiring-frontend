
import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { useAdminLogin } from '@/hooks/forms/useAdminLogin';
import { adminLoginValidation } from '@/utils/yup/validation';
import { adminLoginInitialValues } from '@/utils/yup/initialValues';
import { BookOpen, Mail, Lock, Shield } from "lucide-react";

const AdminLogin = () => {
  const {
    isLoading,
    user,
    handleLogin,
    handleClearSession,
    navigateToSignup,
    navigateToHome,
  } = useAdminLogin();

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
            <Formik
              initialValues={adminLoginInitialValues}
              validationSchema={adminLoginValidation}
              onSubmit={handleLogin}
            >
              {({ errors, touched }) => (
                <Form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-bambinos-blue font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Field
                        as={Input}
                        id="email"
                        name="email"
                        type="email"
                        placeholder="admin@bambinos.live"
                        className="pl-10 border-bambinos-blue/30 focus:border-bambinos-blue focus:ring-bambinos-blue"
                      />
                    </div>
                    {errors.email && touched.email && (
                      <ErrorMessage message={errors.email} variant="destructive" />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-bambinos-blue font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Field
                        as={Input}
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        className="pl-10 border-bambinos-blue/30 focus:border-bambinos-blue focus:ring-bambinos-blue"
                      />
                    </div>
                    {errors.password && touched.password && (
                      <ErrorMessage message={errors.password} variant="destructive" />
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-bambinos-blue hover:bg-bambinos-blue/90 text-white py-3 text-lg font-semibold transition-all duration-300 hover:shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </Form>
              )}
            </Formik>

            <div className="mt-6 text-center space-y-3">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Button
                  variant="link"
                  onClick={navigateToSignup}
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
            onClick={navigateToHome}
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
