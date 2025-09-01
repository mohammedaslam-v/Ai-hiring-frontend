import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { candidateApplicationValidation } from "@/utils/yup/validation";
import { candidateApplicationInitialValues } from "@/utils/yup/initialValues";
import { FormData } from "@/types";
import { useBackendIntegration } from "../useBackendIntegration";

/**
 * Custom hook for candidate application form management
 * Combines Formik form handling with backend API operations
 */
export function useCandidateApplication() {
  const [validationError, setValidationError] = useState<string>("");
  const navigate = useNavigate();
  const { submitApplication, loading, error, clearError: clearBackendError } = useBackendIntegration();

  // Formik configuration
  const formik = useFormik({
    initialValues: candidateApplicationInitialValues,
    validationSchema: candidateApplicationValidation,
    onSubmit: async (values) => {
      console.log('Formik onSubmit triggered with values:', values);
      setValidationError("");
      
      try {
        // Validate that resume file is selected
        if (!values.resume) {
          setValidationError("Please select a resume file");
          toast.error("Please select a resume file");
          return;
        }

        // Log the exact data being sent
        const submissionData = {
          ...values,
          resume: values.resume
        };
        
        console.log('Submitting application data:', submissionData);
        console.log('Data validation check:', {
          firstName: !!submissionData.firstName,
          lastName: !!submissionData.lastName,
          email: !!submissionData.email,
          phone: !!submissionData.phone,
          position: !!submissionData.position,
          subjects: submissionData.subjects?.length || 0,
          availableDays: submissionData.availableDays?.length || 0,
          timeSlots: submissionData.timeSlots?.length || 0,
          resume: !!submissionData.resume
        });

        const response = await submitApplication(submissionData);

        if (response.success) {
          // Store application data in localStorage
          const candidateNameValue = `${values.firstName} ${values.lastName}`;
          const candidateEmailValue = values.email;
          const applicationIdValue = response.data.id;
          
          console.log('🎯 Setting localStorage values:');
          console.log('🎯 - candidateName:', candidateNameValue);
          console.log('🎯 - candidateEmail:', candidateEmailValue);
          console.log('🎯 - applicationId:', applicationIdValue);
          
          localStorage.setItem('candidateName', candidateNameValue);
          localStorage.setItem('candidateEmail', candidateEmailValue);
          localStorage.setItem('applicationId', applicationIdValue);
          
          // Verify the values were set
          console.log('🎯 Verifying localStorage values:');
          console.log('🎯 - candidateName (read):', localStorage.getItem('candidateName'));
          console.log('🎯 - candidateEmail (read):', localStorage.getItem('candidateEmail'));
          console.log('🎯 - applicationId (read):', localStorage.getItem('applicationId'));

          toast.success("Application submitted successfully! Proceeding to the interview stage.");
          
          // Small delay to ensure localStorage is fully processed
          setTimeout(() => {
            console.log('🎯 Navigating to interview page...');
            navigate('/candidate/interview');
          }, 100);
        } else {
          setValidationError(response.error || "Something went wrong. Please try again.");
          toast.error(response.error || "An error occurred while submitting your application. Please try again.");
        }
      } catch (error: unknown) {
        console.error('Error in application submission:', error);
        setValidationError("Something went wrong. Please try again.");
        toast.error("An error occurred while submitting your application. Please try again.");
      }
    }
  });

  // Store formik instance in ref to avoid dependency issues
  const formikRef = useRef(formik);
  formikRef.current = formik;

  // Auto-populate phone number from login - Fixed infinite loop
  useEffect(() => {
    const loginPhoneNumber = localStorage.getItem('loginPhoneNumber');
    if (loginPhoneNumber) {
      formikRef.current.setFieldValue('phone', loginPhoneNumber);
    }
  }, []); // Empty dependency array - only run once

  // Handle validation errors with toast notifications
  useEffect(() => {
    if (validationError) {
      toast.error(validationError);
      clearValidationError();
    }
  }, [validationError]);

  // Handle backend errors with toast notifications
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearBackendError();
    }
  }, [error, clearBackendError]);

  // Generic handler for array fields
  const handleArrayFieldChange = (fieldName: keyof FormData, value: string, checked: boolean) => {
    const currentValues = formik.values[fieldName] as string[];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter(item => item !== value);
    formik.setFieldValue(fieldName, newValues);
    
    // Log the change for debugging
    console.log(`Array field ${fieldName} changed:`, { value, checked, newValues });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid file type (PDF, DOC, or DOCX)');
        return;
      }
      
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      
      formik.setFieldValue('resume', file);
      console.log('Resume file selected:', { name: file.name, size: file.size, type: file.type });
      toast.success('Resume file selected successfully');
    }
  };

  const clearValidationError = () => setValidationError("");

  return {
    // Formik instance
    formik,
    
    // Loading and error states
    isLoading: loading,
    validationError,
    apiError: error,
    
    // Form handlers
    handleArrayFieldChange,
    handleFileUpload,
    clearError: clearValidationError,
    
    // API operations
    submitApplication: formik.submitForm,
    
    // Individual operation states
    applicationSubmission: {
      loading: loading,
      error: error,
      clearError: clearBackendError,
    },
  };
}
