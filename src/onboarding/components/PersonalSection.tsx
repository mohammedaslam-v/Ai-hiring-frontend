// Onboarding module - personal details section.

import { Calendar, Linkedin, Mail, MapPin, Phone, User } from 'lucide-react';
import { BLOOD_GROUPS } from '../onboarding.constants';
import { OnboardingSectionProps } from '../onboarding.types';
import { SectionCard, SelectField, TextField } from './OnboardingFields';

/** yyyy-mm-dd in local time (toISOString would shift the day in some zones). */
const toInputDate = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

/** The date picker only offers ages the validation schema accepts. */
const today = new Date();
const OLDEST_DOB = toInputDate(new Date(today.getFullYear() - 100, today.getMonth(), today.getDate()));
const YOUNGEST_DOB = toInputDate(new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()));

const PersonalSection = ({ formik }: OnboardingSectionProps) => (
  <SectionCard
    icon={User}
    title="Personal Details"
    description="Enter your name exactly as it appears on your bank account and PAN"
  >
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <TextField
        formik={formik}
        name="firstName"
        label="First Name"
        placeholder="Priya"
        maxLength={50}
        required
      />
      <TextField
        formik={formik}
        name="lastName"
        label="Last Name"
        placeholder="Sharma"
        maxLength={50}
        required
      />
      <TextField
        formik={formik}
        name="panNumber"
        label="PAN Number"
        placeholder="ABCDE1234F"
        maxLength={10}
        uppercase
        required
      />
      <TextField
        formik={formik}
        name="email"
        label="Email ID"
        type="email"
        icon={Mail}
        placeholder="priya@example.com"
        maxLength={100}
        required
      />
      <TextField
        formik={formik}
        name="phoneNumber"
        label="Contact Number"
        type="tel"
        icon={Phone}
        placeholder="9876543210"
        maxLength={13}
        hint="Must be reachable on WhatsApp"
        required
      />
      <TextField
        formik={formik}
        name="dateOfBirth"
        label="Date of Birth"
        type="date"
        icon={Calendar}
        min={OLDEST_DOB}
        max={YOUNGEST_DOB}
        hint="You must be at least 18 years old"
        required
      />
      <SelectField
        formik={formik}
        name="bloodGroup"
        label="Blood Group"
        options={BLOOD_GROUPS}
        placeholder="Select blood group"
        required
      />
      <TextField
        formik={formik}
        name="city"
        label="City"
        icon={MapPin}
        placeholder="Bengaluru"
        maxLength={50}
        required
      />
      <TextField
        formik={formik}
        name="linkedinProfile"
        label="LinkedIn Profile"
        type="url"
        icon={Linkedin}
        placeholder="https://linkedin.com/in/username"
        maxLength={255}
        hint="Optional"
      />
    </div>
  </SectionCard>
);

export default PersonalSection;
