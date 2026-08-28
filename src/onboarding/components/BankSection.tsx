// Onboarding module - bank and KYC section.

import { Landmark, ShieldCheck } from 'lucide-react';
import { OnboardingUploadSectionProps } from '../onboarding.types';
import { SectionCard, TextField } from './OnboardingFields';
import FileUploadField from './FileUploadField';

const BankSection = ({ formik, onFileChange }: OnboardingUploadSectionProps) => (
  <SectionCard
    icon={Landmark}
    title="Bank & KYC Details"
    description="Used only for your salary payouts and statutory records"
    accentClass="bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400"
  >
    <div className="space-y-4">
      {/* Reassurance - these are the most sensitive fields on the form */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-700/40">
        <ShieldCheck className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <p className="text-[11px] text-sky-800 dark:text-sky-300 leading-relaxed">
          Make sure the account holder name matches the name you entered above, exactly as it
          appears on your bank records.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <TextField
          formik={formik}
          name="bankAccountNumber"
          label="Bank Account Number"
          placeholder="50100123456789"
          maxLength={18}
          numericOnly
          required
        />
        <TextField
          formik={formik}
          name="bankName"
          label="Bank Name"
          placeholder="HDFC Bank"
          maxLength={100}
          required
        />
        <TextField
          formik={formik}
          name="bankBranch"
          label="Bank Branch"
          placeholder="Koramangala"
          maxLength={100}
          required
        />
        <TextField
          formik={formik}
          name="ifscCode"
          label="Bank IFSC Code"
          placeholder="HDFC0001234"
          maxLength={11}
          uppercase
          required
        />
        <TextField
          formik={formik}
          name="aadhaarNumber"
          label="Aadhaar Card Number"
          placeholder="123456789012"
          maxLength={12}
          numericOnly
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FileUploadField
          formik={formik}
          name="aadhaarCard"
          label="Copy of Aadhaar Card"
          hint="Clear front copy"
          onFileChange={onFileChange}
          required
        />
        <FileUploadField
          formik={formik}
          name="panCard"
          label="Copy of PAN Card"
          hint="Clear front copy"
          onFileChange={onFileChange}
          required
        />
      </div>
    </div>
  </SectionCard>
);

export default BankSection;
