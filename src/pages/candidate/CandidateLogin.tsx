import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Phone, ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen bg-neutral-warm dark:bg-gray-900 relative overflow-hidden">
      {/* Subtle background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Soft gradient orbs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-bambinos-blue/[0.04] rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-bambinos-yellow/[0.06] rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-bambinos-blue/[0.02] rounded-full blur-3xl" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      </div>

      {/* Dark mode toggle */}
      <div className="fixed top-5 right-5 z-50">
        <DarkModeToggle />
      </div>

      {/* Main content */}
      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px] animate-fade-in-up">
          
          {/* Logo & Brand Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-800 shadow-soft flex items-center justify-center p-1 transition-transform duration-300 hover:scale-105">
                <img 
                  src="/lovable-uploads/1bd88e64-73eb-4b2c-8096-218b1fce8646.png" 
                  alt="Bambinos.live" 
                  className="w-11 h-11 object-contain" 
                />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-bambinos-blue dark:text-bambinos-blue-light tracking-tight">
              Bambinos.live
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1.5 font-medium tracking-wide">
              Teacher Application Portal
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-soft-lg dark:shadow-none border border-gray-100/80 dark:border-gray-700/50 overflow-hidden transition-shadow duration-300 hover:shadow-soft-xl">
            
            {/* Card Header */}
            <div className="px-8 pt-8 pb-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center">
                Welcome Back!
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-center text-sm mt-2 leading-relaxed">
                Enter your phone number to access your teaching application
              </p>
            </div>

            {/* Card Content */}
            <div className="px-8 pb-8 pt-4">
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
                    {/* Error Alert */}
                    {validationError && (
                      <Alert 
                        variant="destructive" 
                        className="rounded-xl border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800/50 animate-scale-in"
                      >
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">{validationError}</AlertDescription>
                      </Alert>
                    )}

                    {/* Phone Input Field */}
                    <div className="space-y-2.5">
                      <Label 
                        htmlFor="phone" 
                        className="text-gray-700 dark:text-gray-200 font-semibold text-sm flex items-center gap-2"
                      >
                        <Phone className="h-4 w-4 text-bambinos-blue" />
                        Phone Number
                      </Label>
                      <div className="relative group">
                        <Field
                          id="phone"
                          name="phone"
                          as={Input}
                          className="
                            h-12 sm:h-[52px] 
                            bg-gray-50/50 dark:bg-gray-700/50
                            border-2 border-gray-200/80 dark:border-gray-600
                            rounded-xl
                            text-gray-900 dark:text-white
                            placeholder:text-gray-400 dark:placeholder:text-gray-500
                            text-base
                            px-4
                            transition-all duration-200 ease-out
                            hover:border-bambinos-blue/40 hover:bg-white dark:hover:bg-gray-700
                            focus:border-bambinos-blue focus:ring-4 focus:ring-bambinos-blue/10 dark:focus:ring-bambinos-blue/20
                            focus:bg-white dark:focus:bg-gray-700
                            focus:outline-none
                          "
                          placeholder="Enter your phone number (e.g., +91XXXXXXXXXX)"
                          required
                        />
                        <ErrorMessage 
                          name="phone"
                          component="span"
                          className="text-red-500 text-xs mt-1.5 block font-medium"
                        />
                      </div>
                    </div>

                    {/* Login Button */}
                    <Button
                      type="submit"
                      className="
                        w-full h-12 sm:h-[52px]
                        bg-bambinos-blue hover:bg-bambinos-blue-dark
                        text-white font-semibold text-base
                        rounded-xl
                        shadow-bambinos hover:shadow-bambinos-lg
                        transition-all duration-300 ease-out
                        hover:-translate-y-0.5
                        active:translate-y-0 active:shadow-bambinos
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-bambinos
                        focus:outline-none focus:ring-4 focus:ring-bambinos-blue/30
                      "
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
                        <div className="flex items-center justify-center gap-2.5">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Logging in...</span>
                        </div>
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </Form>
                )}
              </Formik>

              {/* Help Text */}
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700/50">
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center leading-relaxed">
                  New to Bambinos.live?{" "}
                  <span className="text-bambinos-blue dark:text-bambinos-blue-light font-semibold">
                    Complete the application process to join our teaching community!
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Back to Home Button */}
          <div className="text-center mt-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="
                text-gray-500 dark:text-gray-400 
                hover:text-bambinos-blue dark:hover:text-bambinos-blue-light
                hover:bg-bambinos-blue/[0.06] dark:hover:bg-bambinos-blue/10
                font-medium text-sm
                rounded-xl px-5 py-2.5
                transition-all duration-200
                group
              "
            >
              <ArrowLeft className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
              Back to Home
            </Button>
          </div>

          {/* Trust Badge */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Secure login • Your data is protected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateLogin;
