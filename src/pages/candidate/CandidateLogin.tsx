import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Phone, AlertCircle, Eye, EyeOff } from "lucide-react";
import DarkModeToggle from "@/components/DarkModeToggle";
import { sanitizePhoneNumber } from "@/utils/security";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useCandidateLogin } from "@/hooks/forms/useCanidateLogin";
import { initialValues } from "@/utils/yup/initialValues";
import { candidateLoginValidation } from "@/utils/yup/validation";


const CandidateLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { isLoading, validationError, handleLogin, clearError } = useCandidateLogin();



  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
      {/* Dark Mode Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <DarkModeToggle />
      </div>

      <div className="w-full max-w-md">
        {/* Header */}
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
              initialValues={initialValues}
              validationSchema={candidateLoginValidation}
              onSubmit={(values) => {
                handleLogin(values.phoneNumber);
              }}
            >
              {({ values, errors, touched, isSubmitting, setFieldValue, setFieldTouched }) => (
                <Form className="space-y-6">
                  {/* Global Error Display */}
                  {validationError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{validationError}</AlertDescription>
                    </Alert>
                  )}

                  {/* Phone Number Field */}
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-bambinos-blue font-medium dark:text-bambinos-blue">
                      Phone Number
                    </Label>
                    <div className="flex space-x-2">
                      <Select
                        value={values.countryCode}
                        onValueChange={(value) => {
                          setFieldValue("countryCode", value);
                        }}
                      >
                        <SelectTrigger className="w-28 border-bambinos-blue/30 focus:border-bambinos-blue focus:ring-bambinos-blue bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-bambinos-blue/20 dark:bg-gray-800 dark:border-gray-600">
                          <SelectItem value="+91">🇮🇳 +91</SelectItem>
                          <SelectItem value="+1">🇺🇸 +1</SelectItem>
                          <SelectItem value="+44">🇬🇧 +44</SelectItem>
                          <SelectItem value="+61">🇦🇺 +61</SelectItem>
                          <SelectItem value="+81">🇯🇵 +81</SelectItem>
                          <SelectItem value="+49">🇩🇪 +49</SelectItem>
                          <SelectItem value="+33">🇫🇷 +33</SelectItem>
                          <SelectItem value="+86">��🇳 +86</SelectItem>
                          <SelectItem value="+7">🇷🇺 +7</SelectItem>
                          <SelectItem value="+55">🇧🇷 +55</SelectItem>
                        </SelectContent>
                      </Select>
                      <ErrorMessage className="error-validation" component={"span"} name="countryCode"></ErrorMessage>


                      <div className="relative flex-1">
                        <Field
                          id="phoneNumber"
                          name="phoneNumber"
                          as={Input}
                          className="h-11 md:h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg md:rounded-xl text-sm md:text-base dark:border-gray-600 dark:text-gray-300"
                          placeholder="Enter your phone number"
                          required
                        />
                        <ErrorMessage className="error-validation" component={"span"} name="phoneNumber"></ErrorMessage>
                      </div>
                    </div>
                  </div>



                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-bambinos-blue hover:bg-bambinos-blue/90 text-white py-3 text-lg font-semibold transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting || isLoading || Object.keys(errors).length > 0 || !values.phoneNumber.trim()}
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

        {/* Back to home */}
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
