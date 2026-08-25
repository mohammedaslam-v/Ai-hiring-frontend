// Onboarding module - alternate contact section.

import { PhoneCall, Users } from 'lucide-react';
import { OnboardingSectionProps } from '../onboarding.types';
import { SectionCard, TextField } from './OnboardingFields';

const ContactSection = ({ formik }: OnboardingSectionProps) => (
  <SectionCard
    icon={Users}
    title="Alternate Contact"
    description="Someone we can reach if we cannot get through to you"
    accentClass="bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400"
  >
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <TextField
        formik={formik}
        name="altContactNumber"
        label="Alternate Contact Number"
        type="tel"
        icon={PhoneCall}
        placeholder="9876543210"
        maxLength={13}
        hint="Must be different from your own number"
        required
      />
      <TextField
        formik={formik}
        name="altContactName"
        label="Alternate Contact's Name"
        placeholder="Rahul Sharma"
        maxLength={100}
        required
      />
      <TextField
        formik={formik}
        name="altContactRelation"
        label="Relationship with You"
        placeholder="Brother"
        maxLength={50}
        required
      />
    </div>
  </SectionCard>
);

export default ContactSection;
