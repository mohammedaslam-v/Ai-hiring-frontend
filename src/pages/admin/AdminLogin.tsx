
import React from "react";
import { Formik, Form, Field } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { useAdminLogin } from "@/hooks/forms/useAdminLogin";
import { adminLoginInitialValues } from "@/utils/yup/initialValues";
import { adminLoginValidation } from "@/utils/yup/validation";
import { Mail, Lock, BookOpen } from "lucide-react";
import { FORM_LABELS, FORM_PLACEHOLDERS } from "@/utils/constants/form";
import { APP_CONFIG, APP_CONTENT } from "@/utils/constants/app";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const {
    isLoading,
    validationError,
    handleLogin,
    clearError,
  } = useAdminLogin();

  const navigate = useNavigate();

  const navigateToSignup = () => {
    navigate('/admin/signup');
  };

  const navigateToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {APP_CONFIG.NAME}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {FORM_LABELS.ADMIN_ACCESS}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {APP_CONTENT.FEATURES.SUBTITLE}
          </p>
        </div>

        <Card className="border-bambinos-blue/20 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-bambinos-blue">{FORM_LABELS.ADMIN_ACCESS}</CardTitle>
            <CardDescription>
              Sign in to access the administration dashboard
              <br />
              <span className="text-sm text-green-600 font-medium">💡 Any email and password will work!</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {validationError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{validationError}</p>
                <Button
                  onClick={clearError}
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-red-600 hover:text-red-700 hover:bg-red-100"
                >
                  Dismiss
                </Button>
              </div>
            )}

            <Formik
              initialValues={adminLoginInitialValues}
              validationSchema={adminLoginValidation}
              onSubmit={(values) => handleLogin(values.email, values.password)}
            >
              {({ errors, touched }) => (
                <Form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-bambinos-blue font-medium">
                      {FORM_LABELS.EMAIL}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Field
                        as={Input}
                        id="email"
                        name="email"
                        type="email"
                        placeholder={FORM_PLACEHOLDERS.ADMIN_EMAIL}
                        className="pl-10 border-bambinos-blue/30 focus:border-bambinos-blue focus:ring-bambinos-blue"
                      />
                    </div>
                    {errors.email && touched.email && (
                      <ErrorMessage message={errors.email} variant="destructive" />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-bambinos-blue font-medium">
                      {FORM_LABELS.PASSWORD}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Field
                        as={Input}
                        id="password"
                        name="password"
                        type="password"
                        placeholder={FORM_PLACEHOLDERS.PASSWORD}
                        className="pl-10 border-bambinos-blue/30 focus:border-bambinos-blue focus:ring-bambinos-blue"
 />
                    </div>
                    {errors.password && touched.password && (
                      <ErrorMessage message={errors.password} variant="destructive" />
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-bambinos-blue to-blue-600 hover:from-blue-600 hover:to-bambinos-blue text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isLoading ? "Signing In..." : FORM_LABELS.SIGN_IN}
                  </Button>
                </Form>
              )}
            </Formik>

            <div className="mt-6 space-y-3">
              <div className="flex space-x-2">
                <Button
                  onClick={navigateToSignup}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  {FORM_LABELS.SIGN_UP}
                </Button>
                <Button
                  onClick={navigateToHome}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Back to Home
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
