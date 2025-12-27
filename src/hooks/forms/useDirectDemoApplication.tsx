import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { candidateApplicationValidation } from "@/utils/yup/validation";
import { candidateApplicationInitialValues } from "@/utils/yup/initialValues";
import { FormData } from "@/types";
import { candidateService } from "@/services/candidate.service";

/**
 * Custom hook for direct demo application form management
 * Similar to useCandidateApplication but navigates to demo confirmation instead of interview
 */
export function useDirectDemoApplication() {
  const [validationError, setValidationError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Formik configuration
  const formik = useFormik({
    initialValues: candidateApplicationInitialValues,
    validationSchema: candidateApplicationValidation,
    onSubmit: async (values) => {
      console.log('DirectDemoApplication: Formik onSubmit triggered with values:', values);
      setValidationError("");
      setIsLoading(true);
      
      try {
        const submissionData = {
          ...values
        };
        
        console.log('DirectDemoApplication: Submitting direct demo application data:', submissionData);

        const response = await candidateService.submitDirectDemoApplication(submissionData);

        if (response.status && response.data) {
          // Store application data in localStorage
          const candidateNameValue = `${values.firstName} ${values.lastName}`;
          const candidateEmailValue = values.email;
          const applicationIdValue = response.data.applicationId;
          
          console.log('DirectDemoApplication: Setting localStorage values:');
          console.log('DirectDemoApplication: - candidateName:', candidateNameValue);
          console.log('DirectDemoApplication: - candidateEmail:', candidateEmailValue);
          console.log('DirectDemoApplication: - applicationId:', applicationIdValue);
          
          localStorage.setItem('candidateName', JSON.stringify(candidateNameValue));
          localStorage.setItem('candidateEmail', JSON.stringify(candidateEmailValue));
          localStorage.setItem('applicationId', applicationIdValue);
          localStorage.setItem('directDemoApplication', 'true');
          
          // Verify the values were set
          console.log('DirectDemoApplication: Verifying localStorage values:');
          console.log('DirectDemoApplication: - candidateName (read):', JSON.parse(localStorage.getItem('candidateName') || 'null'));
          console.log('DirectDemoApplication: - candidateEmail (read):', JSON.parse(localStorage.getItem('candidateEmail') || 'null'));
          console.log('DirectDemoApplication: - applicationId (read):', localStorage.getItem('applicationId'));
          console.log('DirectDemoApplication: - directDemoApplication (read):', localStorage.getItem('directDemoApplication'));

          toast.success("Application submitted successfully! You will be contacted for demo scheduling.");
          
          // Navigate to confirmation page
          setTimeout(() => {
            console.log('DirectDemoApplication: Navigating to confirmation page...');
            navigate('/directdemo-success', { 
              state: { 
                applicationId: applicationIdValue,
                candidateName: candidateNameValue 
              } 
            });
          }, 100);
        } else {
          const errorMessage = response.message || "Something went wrong. Please try again.";
          setValidationError(errorMessage);
          toast.error(errorMessage);
        }
      } catch (error: unknown) {
        console.error('DirectDemoApplication: Error in application submission:', error);
        setValidationError("Something went wrong. Please try again.");
        toast.error("An error occurred while submitting your application. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  });

  // Store formik instance in ref to avoid dependency issues
  const formikRef = useRef(formik);
  formikRef.current = formik;

  // Auto-populate phone number from login if available
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

  // Generic handler for array fields
  const handleArrayFieldChange = (fieldName: keyof FormData, value: string, checked: boolean) => {
    const currentValues = formik.values[fieldName] as string[];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter(item => item !== value);
    formik.setFieldValue(fieldName, newValues);
    
    // Log the change for debugging
    console.log(`DirectDemoApplication: Array field ${fieldName} changed:`, { value, checked, newValues });
  };

  const clearValidationError = () => setValidationError("");

  return {
    // Formik instance
    formik,
    
    // Loading and error states
    isLoading,
    validationError,
    
    // Form handlers
    handleArrayFieldChange,
    clearError: clearValidationError,
    
    // API operations
    submitApplication: formik.submitForm,
  };
}

