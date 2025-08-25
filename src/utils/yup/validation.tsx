import * as Yup from "yup";
import { VALIDATION_MESSAGES, VALIDATION_RULES, VALIDATION_SCHEMAS } from "@/utils/constants/validation";

export const candidateLoginValidation = Yup.object().shape({
    phoneNumber: Yup.string()
        .required(VALIDATION_MESSAGES.PHONE.REQUIRED)
        .matches(VALIDATION_SCHEMAS.PATTERNS.PHONE, VALIDATION_MESSAGES.PHONE.INVALID)
        .min(VALIDATION_RULES.MIN_PHONE_LENGTH, VALIDATION_MESSAGES.PHONE.MIN_LENGTH)
        .max(VALIDATION_RULES.MAX_PHONE_LENGTH, VALIDATION_MESSAGES.PHONE.MAX_LENGTH),
    countryCode: Yup.string()
        .required(VALIDATION_MESSAGES.COUNTRY_CODE.REQUIRED)
        .matches(VALIDATION_SCHEMAS.PATTERNS.COUNTRY_CODE, VALIDATION_MESSAGES.COUNTRY_CODE.INVALID_FORMAT)
        .oneOf(["+91", "+1", "+44", "+61", "+81", "+49", "+33", "+86", "+7", "+55"], VALIDATION_MESSAGES.COUNTRY_CODE.INVALID_VALUE),
});

export const candidateApplicationValidation = Yup.object().shape({
    firstName: Yup.string()
        .required(VALIDATION_MESSAGES.FIRST_NAME.REQUIRED)
        .min(VALIDATION_RULES.MIN_NAME_LENGTH, VALIDATION_MESSAGES.FIRST_NAME.MIN_LENGTH)
        .max(VALIDATION_RULES.MAX_NAME_LENGTH, VALIDATION_MESSAGES.FIRST_NAME.MAX_LENGTH),
    lastName: Yup.string()
        .required(VALIDATION_MESSAGES.LAST_NAME.REQUIRED)
        .min(VALIDATION_RULES.MIN_NAME_LENGTH, VALIDATION_MESSAGES.LAST_NAME.MIN_LENGTH)
        .max(VALIDATION_RULES.MAX_NAME_LENGTH, VALIDATION_MESSAGES.LAST_NAME.MAX_LENGTH),
    email: Yup.string()
        .required(VALIDATION_MESSAGES.EMAIL.REQUIRED)
        .email(VALIDATION_MESSAGES.EMAIL.INVALID),
    phone: Yup.string()
        .required(VALIDATION_MESSAGES.PHONE.REQUIRED)
        .matches(VALIDATION_SCHEMAS.PATTERNS.PHONE, VALIDATION_MESSAGES.PHONE.INVALID)
        .min(VALIDATION_RULES.MIN_PHONE_LENGTH, VALIDATION_MESSAGES.PHONE.MIN_LENGTH)
        .max(VALIDATION_RULES.MAX_PHONE_LENGTH, VALIDATION_MESSAGES.PHONE.MAX_LENGTH),
    position: Yup.string()
        .required(VALIDATION_MESSAGES.POSITION.REQUIRED),
    subjects: Yup.array()
        .min(1, VALIDATION_MESSAGES.SUBJECTS.MIN_SELECTION)
        .required(VALIDATION_MESSAGES.SUBJECTS.REQUIRED),
    additionalLanguages: Yup.array()
        .of(Yup.string())
        .optional(),
    availableDays: Yup.array()
        .min(1, VALIDATION_MESSAGES.AVAILABLE_DAYS.MIN_SELECTION)
        .required(VALIDATION_MESSAGES.AVAILABLE_DAYS.REQUIRED),
    timeSlots: Yup.array()
        .min(1, VALIDATION_MESSAGES.TIME_SLOTS.MIN_SELECTION)
        .required(VALIDATION_MESSAGES.TIME_SLOTS.REQUIRED),
    resume: Yup.mixed()
        .required(VALIDATION_MESSAGES.RESUME.REQUIRED)
        .test("fileSize", VALIDATION_MESSAGES.RESUME.FILE_SIZE, (value) => {
            if (!value) return false;
            return (value as File).size <= VALIDATION_RULES.MAX_RESUME_SIZE;
        })
});

export const adminLoginValidation = Yup.object().shape({
    email: Yup.string()
        .required(VALIDATION_MESSAGES.EMAIL.REQUIRED)
        .email(VALIDATION_MESSAGES.EMAIL.INVALID),
    password: Yup.string()
        .required(VALIDATION_MESSAGES.PASSWORD.REQUIRED)
        .min(VALIDATION_RULES.MIN_PASSWORD_LENGTH, VALIDATION_MESSAGES.PASSWORD.MIN_LENGTH)
});