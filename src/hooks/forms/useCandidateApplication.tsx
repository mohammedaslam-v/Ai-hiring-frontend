import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { candidateService } from "@/services/serviceManager";
import { useFormik } from "formik";
import { candidateApplicationValidation } from "@/utils/yup/validation";
import { applicationInitialValues } from "@/utils/yup/initialValues";
import { FormData } from "@/types";

export function useCandidateApplication() {
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string>("");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: applicationInitialValues,
    validationSchema: candidateApplicationValidation,
    onSubmit: async (values) => {
      setValidationError("");
      setIsLoading(true);
      
      try {
        const response = await candidateService.submitApplication({
          ...values,
          resume: values.resume!
        });

        if (response.status) {
          localStorage.setItem('candidateName', `${values.firstName} ${values.lastName}`);
          localStorage.setItem('candidateEmail', values.email);
          localStorage.setItem('applicationId', response.data.id);
          
          toast.success("Application submitted successfully! Proceeding to the interview stage.");
          
          navigate('/candidate/interview');
        } else {
          setValidationError(response.message);
          toast.error(response.message);
        }
        
      } catch (error: unknown) {
        console.error('Error in application submission:', error);
        setValidationError("Something went wrong. Please try again.");
        
        toast.error("An error occurred while submitting your application. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  });

  // Auto-populate phone number from login - Fixed infinite loop
  useEffect(() => {
    const loginPhoneNumber = localStorage.getItem('loginPhoneNumber');
    if (loginPhoneNumber) {
      formik.setFieldValue('phone', loginPhoneNumber);
    }
  }, []); // Removed formik dependency to prevent infinite loop

  // Generic handler for array fields
  const handleArrayFieldChange = (fieldName: keyof FormData, value: string, checked: boolean) => {
    const currentValues = formik.values[fieldName] as string[];
    const newValues = checked 
      ? [...currentValues, value]
      : currentValues.filter(item => item !== value);
    formik.setFieldValue(fieldName, newValues);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) formik.setFieldValue('resume', file);
  };

  const clearError = () => setValidationError("");

  return {
    formik,
    isLoading,
    validationError,
    handleArrayFieldChange,
    handleFileUpload,
    clearError
  };
}
