// Onboarding module - course, availability and languages section.

import { BookOpen } from 'lucide-react';
import { UNIQUE_INDIAN_LANGUAGES } from '@/constants/indianLanguages';
import {
  APPLICATION_SOURCES,
  ONBOARDING_COURSES,
  WEEK_DAYS,
  YES_NO_CHOICES,
} from '../onboarding.constants';
import { OnboardingFormik } from '../onboarding.types';
import { ChoiceField, SectionCard, SelectField } from './OnboardingFields';
import AvailabilityPicker from './AvailabilityPicker';

interface RoleSectionProps {
  formik: OnboardingFormik;
  onSlotSelect: (slot: string) => void;
}

const RoleSection = ({ formik, onSlotSelect }: RoleSectionProps) => (
  <SectionCard
    icon={BookOpen}
    title="Course & Availability"
    description="What you will teach and when you are available"
    accentClass="bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
  >
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SelectField
          formik={formik}
          name="courseProgram"
          label="Course/Program you want to teach"
          options={ONBOARDING_COURSES}
          placeholder="Select a course"
          required
        />
        <SelectField
          formik={formik}
          name="applicationSource"
          label="How did you apply to Bambinos.live?"
          options={APPLICATION_SOURCES}
          placeholder="Select a source"
          required
        />
        <SelectField
          formik={formik}
          name="weeklyBreak"
          label="Weekly Break"
          options={WEEK_DAYS}
          placeholder="Select a day"
          required
        />
      </div>

      <ChoiceField
        formik={formik}
        name="crossTrainingWilling"
        label="Are you willing to be cross-trained for other courses as per business requirements?"
        options={YES_NO_CHOICES}
        required
      />

      <AvailabilityPicker formik={formik} onSlotSelect={onSlotSelect} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SelectField
          formik={formik}
          name="language1"
          label="Language 1 (Fluent)"
          options={[...UNIQUE_INDIAN_LANGUAGES]}
          placeholder="Select a language"
          required
        />
        <SelectField
          formik={formik}
          name="language2"
          label="Language 2 (Fluent)"
          options={[...UNIQUE_INDIAN_LANGUAGES]}
          placeholder="Select a language"
          hint="Optional"
        />
        <SelectField
          formik={formik}
          name="language3"
          label="Language 3 (Fluent)"
          options={[...UNIQUE_INDIAN_LANGUAGES]}
          placeholder="Select a language"
          hint="Optional"
        />
      </div>
    </div>
  </SectionCard>
);

export default RoleSection;
