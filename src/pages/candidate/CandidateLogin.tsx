import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from "lucide-react";
import DarkModeToggle from "@/components/DarkModeToggle";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useCandidateLogin } from "@/hooks/forms/useCanidateLogin";
import { candidateLoginInitialValues } from "@/utils/yup/initialValues";
import { candidateLoginValidation } from "@/utils/yup/validation";

const CandidateLogin = () => {
  const navigate = useNavigate();
  const { isLoading, validationError, handleLogin, clearError } = useCandidateLogin();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="fixed top-4 right-4 z-50">
        <DarkModeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <img src="/lovable-uploads/1bd88e64-73eb-4b2c-8096-218b1fce8646.png" alt="Bambinos.live" className="w-12 h-12 rounded-full" />
            </div>
            <h1 className="text-3xl font-bold text-bambinos-blue dark:text-bambinos-blue">Bambinos.live</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">Teacher Application Portal</p>
        </div>

        <Card className="border-bambinos-blue/20 shadow-xl bg-white dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-bambinos-blue dark:text-bambinos-blue">Welcome Back!</CardTitle>
            <CardDescription className="dark:text-gray-300">
              Enter your phone number to access your teaching application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Formik
              initialValues={candidateLoginInitialValues}
              validationSchema={candidateLoginValidation}
              onSubmit={(values) => {
                console.log('Form submitted with values:', values);
                handleLogin(values.phone);
              }}
            >
              {({ values, errors, touched, isSubmitting, setFieldValue, setFieldTouched }) => (
                <Form className="space-y-6">
                  {validationError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{validationError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-bambinos-blue font-medium dark:text-bambinos-blue">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Field
                        id="phone"
                        name="phone"
                        as={Input}
                        className="h-11 md:h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg md:rounded-xl text-sm md:text-base dark:border-gray-600 dark:text-gray-300"
                        placeholder="Enter your phone number (e.g., +91XXXXXXXXXX)"
                        required
                      />
                      <ErrorMessage className="error-validation" component={"span"} name="phone"></ErrorMessage>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-bambinos-blue hover:bg-bambinos-blue/90 text-white py-3 text-lg font-semibold transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting || isLoading || Object.keys(errors).length > 0 || !values.phone.trim()}
                    onClick={() => {
                      console.log('Button clicked');
                      console.log('Form errors:', errors);
                      console.log('Phone value:', values.phone);
                      console.log('Is submitting:', isSubmitting);
                      console.log('Is loading:', isLoading);
                    }}
                  >
                    {isSubmitting || isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Logging in...</span>
                      </div>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </Form>
              )}
            </Formik>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                New to Bambinos.live?{" "}
                <span className="text-bambinos-blue font-medium">
                  Complete the application process to join our teaching community!
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-bambinos-blue hover:text-bambinos-blue/80 hover:bg-bambinos-blue/10 dark:text-bambinos-blue dark:hover:bg-bambinos-blue/20"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CandidateLogin;
