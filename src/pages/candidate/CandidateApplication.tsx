
import { Button } from "@/components/ui/button";
import { Briefcase, User } from "lucide-react";
import DarkModeToggle from "@/components/DarkModeToggle";
import PersonalInfoSection from "@/components/candidate/PersonalInfoSection";
import PositionSection from "@/components/candidate/PositionSection";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="fixed top-3 right-3 z-50">
        <DarkModeToggle />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Compact Header */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 p-0.5">
            <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center">
              <img src="/lovable-uploads/1bd88e64-73eb-4b2c-8096-218b1fce8646.png" alt="Logo" className="w-7 h-7" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">Bambinos.live</h1>
            <p className="text-[10px] text-slate-500">Premium Educator Application</p>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Application Form</h2>
                <p className="text-blue-100 text-xs">Complete all sections to proceed</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={formik.handleSubmit} className="p-5">
            <div className="grid grid-cols-2 gap-5">
              {/* Left Column */}
              <div className="space-y-4">
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
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <AvailabilitySection
                  selectedDays={formik.values.availableDays}
                  selectedTimeSlots={formik.values.timeSlots}
                  onDayChange={(day, checked) => handleArrayFieldChange('availableDays', day, checked)}
                  onTimeSlotChange={(slot, checked) => handleArrayFieldChange('timeSlots', slot, checked)}
                  dayError={formik.touched.availableDays && formik.errors.availableDays ? String(formik.errors.availableDays) : undefined}
                  timeSlotError={formik.touched.timeSlots && formik.errors.timeSlots ? String(formik.errors.timeSlots) : undefined}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-5 pt-4 border-t border-gray-100">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white h-12 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                disabled={isLoading || formik.isSubmitting}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
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
  );
};

export default CandidateApplication;
