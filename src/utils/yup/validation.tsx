import * as Yup from "yup";

export const candidateLoginValidation = Yup.object().shape({
    phoneNumber: Yup.string()
        .required("Phone number is required")
        .matches(/^[0-9]+$/, "Phone number must contain only digits")
        .min(10, "Phone number must be at least 10 digits")
        .max(15, "Phone number must not exceed 15 digits"),
    countryCode: Yup.string()
        .required("Country code is required")
        .matches(/^\+[0-9]+$/, "Invalid country code format")
        .oneOf(["+91", "+1", "+44", "+61", "+81", "+49", "+33", "+86", "+7", "+55"], "Please select a valid country code"),
});

export const candidateApplicationValidation = Yup.object().shape({
    firstName: Yup.string()
        .required("First name is required")
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name must not exceed 50 characters"),
    lastName: Yup.string()
        .required("Last name is required")
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name must not exceed 50 characters"),
    email: Yup.string()
        .required("Email is required")
        .email("Please enter a valid email address"),
    phone: Yup.string()
        .required("Phone number is required")
        .matches(/^[0-9]+$/, "Phone number must contain only digits")
        .min(10, "Phone number must be at least 10 digits")
        .max(15, "Phone number must not exceed 15 digits"),
    position: Yup.string()
        .required("Position is required"),
    subjects: Yup.array()
        .min(1, "Please select at least one subject")
        .required("Subjects are required"),
    additionalLanguages: Yup.array()
        .of(Yup.string())
        .optional(),
    availableDays: Yup.array()
        .min(1, "Please select at least one available day")
        .required("Available days are required"),
    timeSlots: Yup.array()
        .min(1, "Please select at least one time slot")
        .required("Time slots are required"),
    resume: Yup.mixed()
        .required("Resume is required")
        .test("fileSize", "File size must be less than 10MB", (value) => {
            if (!value) return false;
            return (value as File).size <= 10 * 1024 * 1024;
        })
});