
import { Button } from "@/components/ui/button";
import { Briefcase, User } from "lucide-react";
import DarkModeToggle from "@/components/DarkModeToggle";
import PersonalInfoSection from "@/components/candidate/PersonalInfoSection";
import SubjectsSection from "@/components/candidate/SubjectsSection";
import AvailabilitySection from "@/components/candidate/AvailabilitySection";
import { useCandidateApplication } from "@/hooks/forms/useCandidateApplication";

const CandidateApplication = () => {
  const {
    formik,
    isLoading,
    handleArrayFieldChange,
  } = useCandidateApplication();

  return (
    <div className="min-h-screen md:h-screen bg-neutral-warm dark:bg-gray-900 relative md:overflow-hidden">
      {/* Subtle background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-bambinos-blue/[0.03] rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-bambinos-yellow/[0.05] rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-bambinos-blue/[0.02] rounded-full blur-3xl" />
      </div>

      <div className="fixed top-4 right-4 z-50">
        <DarkModeToggle />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 md:h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-4 sm:mb-5 animate-fade-in-up shrink-0">
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
              Premium Educator Application
            </p>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-soft-lg dark:shadow-none border border-gray-100/80 dark:border-gray-700/50 overflow-hidden animate-fade-in-up animation-delay-100 flex flex-col md:flex-1 md:min-h-0">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-bambinos-blue to-bambinos-blue-light px-4 sm:px-6 py-4 shrink-0">
            <div className="flex items-center gap-3 h-8">
              <div className="w-8 h-8 bg-white/15 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <User className="h-3.5 w-3.5 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Application Form</h2>
                <p className="text-blue-100 text-xs">Complete all sections to proceed</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={formik.handleSubmit} className="p-4 sm:p-6 flex flex-col md:flex-1 md:min-h-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:flex-1 md:min-h-0">
              {/* Column 1: Personal Information */}
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

              {/* Column 2: Subjects & Languages */}
              <SubjectsSection
                selectedSubjects={formik.values.subjects}
                selectedLanguages={formik.values.additionalLanguages}
                onSubjectChange={(subject, checked) => handleArrayFieldChange('subjects', subject, checked)}
                onLanguageChange={(language, checked) => handleArrayFieldChange('additionalLanguages', language, checked)}
                subjectError={formik.touched.subjects && formik.errors.subjects ? String(formik.errors.subjects) : undefined}
              />

              {/* Column 3: Availability */}
              <AvailabilitySection
                selectedDays={formik.values.availableDays}
                selectedTimeSlots={formik.values.timeSlots}
                onDayChange={(day, checked) => handleArrayFieldChange('availableDays', day, checked)}
                onTimeSlotChange={(slot, checked) => handleArrayFieldChange('timeSlots', slot, checked)}
                dayError={formik.touched.availableDays && formik.errors.availableDays ? String(formik.errors.availableDays) : undefined}
                timeSlotError={formik.touched.timeSlots && formik.errors.timeSlots ? String(formik.errors.timeSlots) : undefined}
              />
            </div>

            {/* Submit Button */}
            <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-gray-100 dark:border-gray-700/50 shrink-0">
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
                disabled={isLoading || formik.isSubmitting}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2.5">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2.5">
                    <Briefcase className="h-4 w-4" />
                    <span>Submit Application & Start Interview</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CandidateApplication;
