// Onboarding module - teaching setup section.

import { Laptop } from 'lucide-react';
import {
  CAMERA_CHOICES,
  INTERNET_CHOICES,
  RAM_CHOICES,
  YES_NO_CHOICES,
} from '../onboarding.constants';
import { OnboardingUploadSectionProps } from '../onboarding.types';
import { ChoiceField, SectionCard } from './OnboardingFields';
import FileUploadField from './FileUploadField';

const TechSection = ({ formik, onFileChange }: OnboardingUploadSectionProps) => (
  <SectionCard
    icon={Laptop}
    title="Your Teaching Setup"
    description="The equipment you will use to take classes"
    accentClass="bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400"
  >
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChoiceField
          formik={formik}
          name="hasEightGbRam"
          label="Does your laptop have 8GB RAM?"
          options={RAM_CHOICES}
          required
        />
        <FileUploadField
          formik={formik}
          name="ramScreenshot"
          label="Screenshot of 'System Information' showing RAM"
          onFileChange={onFileChange}
          required
        />
        <ChoiceField
          formik={formik}
          name="hasHighSpeedInternet"
          label="Do you have high-speed internet (100 Mbps)?"
          options={INTERNET_CHOICES}
          required
        />
        <FileUploadField
          formik={formik}
          name="speedScreenshot"
          label="Screenshot of your Internet Speed test"
          onFileChange={onFileChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChoiceField
          formik={formik}
          name="cameraQualityOk"
          label="Is your laptop camera quality satisfactory?"
          options={CAMERA_CHOICES}
          required
        />
        <ChoiceField
          formik={formik}
          name="lightingAdequate"
          label="Is the lighting adequate in your classroom space?"
          options={YES_NO_CHOICES}
          required
        />
        <ChoiceField
          formik={formik}
          name="attireWilling"
          label="Are you open to semi-formal or smart-casual attire?"
          options={YES_NO_CHOICES}
          required
        />
      </div>
    </div>
  </SectionCard>
);

export default TechSection;
