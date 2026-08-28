// Onboarding module - form state.

import { useState } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { onboardingValidation } from './onboarding.validation';
import { onboardingService } from './onboarding.service';
import { OnboardingFileKey, OnboardingFormValues } from './onboarding.types';

/** An empty form. Every field starts controlled, so React never warns. */
export const onboardingInitialValues: OnboardingFormValues = {
  firstName: '',
  lastName: '',
  panNumber: '',
  email: '',
  phoneNumber: '',
  dateOfBirth: '',
  bloodGroup: '',
  city: '',
  linkedinProfile: '',

  courseProgram: '',
  crossTrainingWilling: '',
  applicationSource: '',
  availableSlots: [],
  weeklyBreak: '',
  language1: '',
  language2: '',
  language3: '',

  bio: '',

  altContactNumber: '',
  altContactName: '',
  altContactRelation: '',

  hasEightGbRam: '',
  cameraQualityOk: '',
  hasHighSpeedInternet: '',
  lightingAdequate: '',
  attireWilling: '',

  aadhaarNumber: '',
  bankAccountNumber: '',
  bankName: '',
  bankBranch: '',
  ifscCode: '',

  resume: null,
  addressProof: null,
  panCard: null,
  aadhaarCard: null,
  relievingLetter: null,
  payslip: null,
  ramScreenshot: null,
  speedScreenshot: null,
};

/**
 * Form state for the public onboarding page.
 *
 * There is no login behind this link, so a successful submission simply swaps
 * the form for a confirmation screen instead of navigating anywhere.
 */
export function useOnboardingForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const formik = useFormik<OnboardingFormValues>({
    initialValues: onboardingInitialValues,
    validationSchema: onboardingValidation,
    // Validating on every keystroke would re-check 8 files on each character.
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        const response = await onboardingService.submitOnboarding(values);

        if (response.status) {
          toast.success('Onboarding form submitted successfully!');
          setIsSubmitted(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          toast.error(response.message || 'Something went wrong. Please try again.');
        }
      } catch (error: unknown) {
        console.error('Error in onboarding submission:', error);
        toast.error('An error occurred while submitting the form. Please try again.');
      }
    },
  });

  /** Attach or clear one document. */
  const handleFileChange = (fieldName: OnboardingFileKey, file: File | null) => {
    formik.setFieldTouched(fieldName, true, false);
    formik.setFieldValue(fieldName, file, true);
  };

  /**
   * Choose the one 5-hour window the educator can teach in. It is stored as a
   * single-item list so the database column keeps its JSON shape.
   */
  const handleSlotSelect = (slot: string) => {
    formik.setFieldTouched('availableSlots', true, false);
    formik.setFieldValue('availableSlots', [slot], true);
  };

  /**
   * Validate everything up front so the candidate sees every problem at once,
   * then jump to the first field that needs attention.
   */
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors = await formik.validateForm();
    const errorFields = Object.keys(errors);

    if (errorFields.length > 0) {
      // Mark every field as touched so each section shows its own errors.
      const allTouched = Object.keys(formik.values).reduce(
        (touched, field) => ({ ...touched, [field]: true }),
        {}
      );
      formik.setTouched(allTouched, false);

      toast.error(
        `Please complete ${errorFields.length} remaining field${errorFields.length > 1 ? 's' : ''}.`
      );
      document.getElementById(errorFields[0])?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    await formik.submitForm();
  };

  return {
    formik,
    isSubmitted,
    isLoading: formik.isSubmitting,
    handleFileChange,
    handleSlotSelect,
    handleFormSubmit,
  };
}
