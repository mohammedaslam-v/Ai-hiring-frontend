// Onboarding module - the public page.
//
// Route: /onboarding. Shared with a selected candidate as a plain link, so
// there is no login and nothing is pre-filled.

import { Button } from '@/components/ui/button';
import { ClipboardCheck, Send } from 'lucide-react';
import DarkModeToggle from '@/components/DarkModeToggle';
import { useOnboardingForm } from './useOnboardingForm';
import PersonalSection from './components/PersonalSection';
import RoleSection from './components/RoleSection';
import ProfileSection from './components/ProfileSection';
import ContactSection from './components/ContactSection';
import TechSection from './components/TechSection';
import BankSection from './components/BankSection';
import OnboardingSuccess from './components/OnboardingSuccess';

const OnboardingForm = () => {
  const {
    formik,
    isSubmitted,
    isLoading,
    handleFileChange,
    handleSlotSelect,
    handleFormSubmit,
  } = useOnboardingForm();

  return (
    <div className="min-h-screen bg-neutral-warm dark:bg-gray-900 relative">
      {/* Subtle background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-bambinos-blue/[0.03] rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-bambinos-yellow/[0.05] rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-bambinos-blue/[0.02] rounded-full blur-3xl" />
      </div>

      <div className="fixed top-4 right-4 z-50">
        <DarkModeToggle />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
        {/* Brand header */}
        <div className="flex items-center justify-center gap-3 mb-4 sm:mb-5 animate-fade-in-up">
          <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 shadow-soft flex items-center justify-center p-1 transition-transform duration-300 hover:scale-105">
            <img
              src="/lovable-uploads/1bd88e64-73eb-4b2c-8096-218b1fce8646.png"
              alt="Logo"
              className="w-8 h-8 object-contain"
            />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-bambinos-blue dark:text-bambinos-blue-light tracking-tight">
              Bambinos.live
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Educator Onboarding
            </p>
          </div>
        </div>

        {isSubmitted ? (
          <OnboardingSuccess candidateName={formik.values.firstName} />
        ) : (
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-soft-lg dark:shadow-none border border-gray-100/80 dark:border-gray-700/50 overflow-hidden animate-fade-in-up animation-delay-100">
            {/* Form header */}
            <div className="bg-gradient-to-r from-bambinos-blue to-bambinos-blue-light px-4 sm:px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/15 backdrop-blur-sm rounded-lg flex items-center justify-center shrink-0">
                  <ClipboardCheck className="h-3.5 w-3.5 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Complete the Onboarding Form</h2>
                  <p className="text-blue-100 text-xs">
                    Fill in your details and upload your documents - it takes about 10 minutes
                  </p>
                </div>
              </div>
            </div>

            {/* Sections */}
            <form onSubmit={handleFormSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5" noValidate>
              <PersonalSection formik={formik} />
              <RoleSection formik={formik} onSlotSelect={handleSlotSelect} />
              <ProfileSection formik={formik} onFileChange={handleFileChange} />
              <ContactSection formik={formik} />
              <TechSection formik={formik} onFileChange={handleFileChange} />
              <BankSection formik={formik} onFileChange={handleFileChange} />

              {/* Submit */}
              <div className="pt-5 sm:pt-6 border-t border-gray-100 dark:border-gray-700/50">
                <Button
                  type="submit"
                  className="
                    w-full h-12
                    bg-gradient-to-r from-bambinos-blue to-bambinos-blue-light
                    hover:from-bambinos-blue-dark hover:to-bambinos-blue
                    text-white text-sm font-semibold
                    rounded-xl
                    shadow-bambinos hover:shadow-bambinos-lg
                    transition-all duration-300
                    hover:-translate-y-0.5
                    active:translate-y-0
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                    focus:outline-none focus:ring-2 focus:ring-bambinos-blue/30
                  "
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2.5">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Uploading your documents...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2.5">
                      <Send className="h-4 w-4" />
                      <span>Submit Onboarding Form</span>
                    </div>
                  )}
                </Button>

                <p className="text-[11px] text-center text-gray-400 dark:text-gray-500 mt-3">
                  Uploading can take a minute on a slow connection - please do not close this page.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingForm;
