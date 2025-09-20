
import { Button } from "@/components/ui/button";
import { Briefcase, User } from "lucide-react";
import DarkModeToggle from "@/components/DarkModeToggle";
import CandidateHeader from "@/components/candidate/CandidateHeader";
import CandidateHero from "@/components/candidate/CandidateHero";
import PersonalInfoSection from "@/components/candidate/PersonalInfoSection";
import PositionSection from "@/components/candidate/PositionSection";
import SubjectsSection from "@/components/candidate/SubjectsSection";
import AvailabilitySection from "@/components/candidate/AvailabilitySection";
import { useCandidateApplication } from "@/hooks/forms/useCandidateApplication";
import React from "react";

const CandidateApplication = () => {
  const {
    formik,
    isLoading,
    validationError,
    handleArrayFieldChange,
    clearError
  } = useCandidateApplication();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Advanced Animated Background Pattern */}
      <div 
        className="absolute inset-0 opacity-30 animate-pulse"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234f46e5' fill-opacity='0.05'%3E%3Ccircle cx='40' cy='40' r='6'/%3E%3Ccircle cx='20' cy='20' r='3'/%3E%3Ccircle cx='60' cy='60' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      {/* Enhanced Floating Particles Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-float" style={{animationDelay: '0s', animationDuration: '4s'}}></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-float" style={{animationDelay: '1.5s', animationDuration: '5s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-2.5 h-2.5 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full animate-float" style={{animationDelay: '3s', animationDuration: '4.5s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-gradient-to-r from-teal-400 to-green-400 rounded-full animate-float" style={{animationDelay: '2s', animationDuration: '6s'}}></div>
        <div className="absolute bottom-1/3 right-1/2 w-2 h-2 bg-gradient-to-r from-pink-400 to-red-400 rounded-full animate-float" style={{animationDelay: '4s', animationDuration: '5.5s'}}></div>
      </div>
      
      <div className="fixed top-4 right-4 md:top-6 md:right-6 z-50">
        <DarkModeToggle />
      </div>

      <div className="container mx-auto px-2 sm:px-4 max-w-5xl relative z-10">
        <CandidateHeader />
        <CandidateHero />

        {/* Premium Glassmorphism Form Container */}
        <div className="bg-white/85 backdrop-blur-xl rounded-2xl shadow-2xl mx-2 sm:mx-4 md:mx-0 overflow-hidden border border-white/25 hover:shadow-3xl transition-all duration-500 hover:-translate-y-1 hover:scale-[1.01] relative">
          {/* Animated Border Gradient */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/15 via-purple-500/15 to-indigo-500/15 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
          {/* Premium Header Section */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-6 md:p-8 text-center relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 via-purple-600/50 to-indigo-600/50 animate-gradient-shift"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/8 to-transparent animate-shimmer"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-400 hover:rotate-12 hover:shadow-2xl group">
                  <User className="h-7 w-7 text-white group-hover:animate-bounce" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 animate-fade-in-up bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Application Portal
              </h1>
              <p className="text-blue-100 text-base md:text-lg animate-fade-in-up max-w-xl mx-auto leading-relaxed" style={{animationDelay: '0.2s'}}>
                Complete your journey to educational excellence
              </p>
              <div className="mt-4 flex justify-center">
                <div className="w-16 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          
          {/* Premium Form Content */}
          <div className="p-6 md:p-8 bg-gradient-to-br from-white/95 to-blue-50/20">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <PersonalInfoSection
                formData={{
                  firstName: formik.values.firstName,
                  lastName: formik.values.lastName,
                  email: formik.values.email,
                  phone: formik.values.phone
                }}
                duplicateWarnings={{ email: false, phone: false }}
                fieldErrors={{
                  firstName: formik.touched.firstName && formik.errors.firstName ? formik.errors.firstName : undefined,
                  lastName: formik.touched.lastName && formik.errors.lastName ? formik.errors.lastName : undefined,
                  email: formik.touched.email && formik.errors.email ? formik.errors.email : undefined,
                  phone: formik.touched.phone && formik.errors.phone ? formik.errors.phone : undefined,
                }}
                onEmailChange={formik.handleChange}
                onPhoneChange={formik.handleChange}
                onFirstNameChange={formik.handleChange}
                onLastNameChange={formik.handleChange}
              />

              <PositionSection
                selectedPosition={formik.values.position}
                onPositionChange={(value) => formik.setFieldValue('position', value)}
                error={formik.touched.position && formik.errors.position ? formik.errors.position : undefined}
              />

              <SubjectsSection
                selectedSubjects={formik.values.subjects}
                selectedLanguages={formik.values.additionalLanguages}
                onSubjectChange={(subject, checked) => handleArrayFieldChange('subjects', subject, checked)}
                onLanguageChange={(language, checked) => handleArrayFieldChange('additionalLanguages', language, checked)}
                subjectError={formik.touched.subjects && formik.errors.subjects ? String(formik.errors.subjects) : undefined}
              />

              <AvailabilitySection
                selectedDays={formik.values.availableDays}
                selectedTimeSlots={formik.values.timeSlots}
                onDayChange={(day, checked) => handleArrayFieldChange('availableDays', day, checked)}
                onTimeSlotChange={(slot, checked) => handleArrayFieldChange('timeSlots', slot, checked)}
                dayError={formik.touched.availableDays && formik.errors.availableDays ? String(formik.errors.availableDays) : undefined}
                timeSlotError={formik.touched.timeSlots && formik.errors.timeSlots ? String(formik.errors.timeSlots) : undefined}
              />


              <div className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white py-4 text-lg font-bold transition-all duration-500 hover:shadow-2xl rounded-xl relative overflow-hidden group transform hover:scale-105 active:scale-95 border border-transparent hover:border-white/20"
                  disabled={isLoading || formik.isSubmitting}
                >
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
                  
                  {isLoading ? (
                    <div className="flex items-center gap-3 justify-center relative z-10">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="animate-pulse">Submitting Application...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 justify-center relative z-10">
                      <Briefcase className="h-5 w-5 group-hover:rotate-12 transition-transform duration-400 group-hover:scale-110" />
                      <span className="group-hover:tracking-wide transition-all duration-400">Submit Application & Start Interview</span>
                    </div>
                  )}
                  
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 -top-1 -left-1 w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer-slow transition-opacity duration-500"></div>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateApplication;
