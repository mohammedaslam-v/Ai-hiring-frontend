
import { Button } from "@/components/ui/button";
import { Briefcase, User } from "lucide-react";
import DarkModeToggle from "@/components/DarkModeToggle";
import CandidateHeader from "@/components/candidate/CandidateHeader";
import CandidateHero from "@/components/candidate/CandidateHero";
import PersonalInfoSection from "@/components/candidate/PersonalInfoSection";
import PositionSection from "@/components/candidate/PositionSection";
import SubjectsSection from "@/components/candidate/SubjectsSection";
import AvailabilitySection from "@/components/candidate/AvailabilitySection";
import ResumeSection from "@/components/candidate/ResumeSection";
import { useCandidateApplication } from "@/hooks/forms/useCandidateApplication";
import React from "react";

const CandidateApplication = () => {
  const {
    formik,
    isLoading,
    validationError,
    handleArrayFieldChange,
    handleFileUpload,
    clearError
  } = useCandidateApplication();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234f46e5' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <div className="fixed top-4 right-4 md:top-6 md:right-6 z-50">
        <DarkModeToggle />
      </div>

      <div className="container mx-auto px-2 sm:px-4 max-w-5xl relative z-10">
        <CandidateHeader />
        <CandidateHero />

        <div className="bg-white rounded-lg shadow-lg mx-2 sm:mx-4 md:mx-0 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 md:p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                <User className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Application</h1>
            <p className="text-blue-100 text-base md:text-lg">
              Complete your journey to educational excellence
            </p>
          </div>
          
          {/* Form Content */}
          <div className="p-6 md:p-8">
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

              <ResumeSection
                resume={formik.values.resume}
                onFileUpload={handleFileUpload}
              />

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-lg font-bold transition-all duration-300 hover:shadow-lg rounded-lg"
                  disabled={isLoading || formik.isSubmitting}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3 justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Submitting Application...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 justify-center">
                      <Briefcase className="h-5 w-5" />
                      <span>Submit Application & Start Interview</span>
                    </div>
                  )}
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
