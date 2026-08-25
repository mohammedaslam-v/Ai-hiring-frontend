// Onboarding module - bio and professional documents section.

import { FileText } from 'lucide-react';
import { OnboardingUploadSectionProps } from '../onboarding.types';
import { SectionCard, TextAreaField } from './OnboardingFields';
import FileUploadField from './FileUploadField';

const ProfileSection = ({ formik, onFileChange }: OnboardingUploadSectionProps) => (
  <SectionCard
    icon={FileText}
    title="Your Bio & Documents"
    description="Tell us about your background and attach your documents"
    accentClass="bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400"
  >
    <div className="space-y-4">
      <TextAreaField
        formik={formik}
        name="bio"
        label="Your BIO (3-4 lines)"
        rows={5}
        placeholder="Cover your highest academic qualification, certificates, education-related achievements, total teaching experience, and any teaching or training awards."
        hint="Include: highest qualification · certificates · achievements · total teaching experience · awards"
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FileUploadField
          formik={formik}
          name="resume"
          label="Resume / CV"
          onFileChange={onFileChange}
          required
        />
        <FileUploadField
          formik={formik}
          name="addressProof"
          label="Proof of Address"
          onFileChange={onFileChange}
          required
        />
        <FileUploadField
          formik={formik}
          name="relievingLetter"
          label="Relieving Letter (previous organisation)"
          hint="Optional - only if you worked elsewhere"
          onFileChange={onFileChange}
        />
        <FileUploadField
          formik={formik}
          name="payslip"
          label="Payslip (previous organisation)"
          hint="Optional - only if you worked elsewhere"
          onFileChange={onFileChange}
        />
      </div>
    </div>
  </SectionCard>
);

export default ProfileSection;
