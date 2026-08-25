// Onboarding module - API access.
//
// Sends one multipart request to POST /api/onboarding/submit: all text fields
// plus the attached documents. Field names match the backend one-for-one, so
// there is no mapping table to keep in sync.

import { ServiceResponse } from '@/types/interface';
import {
    BackendApiResponse,
    ValidationErrorDetail,
    AxiosErrorResponse,
} from '@/types/api';
import axiosInstance from '@/services/instance';
import { OnboardingFormValues, OnboardingSubmissionData } from './onboarding.types';

/** Text fields, in form order. `availableSlots` is handled separately (JSON). */
const TEXT_FIELDS: Array<keyof OnboardingFormValues> = [
    'firstName', 'lastName', 'panNumber', 'email', 'phoneNumber', 'dateOfBirth',
    'bloodGroup', 'city', 'linkedinProfile',
    'courseProgram', 'crossTrainingWilling', 'applicationSource', 'weeklyBreak',
    'language1', 'language2', 'language3',
    'bio',
    'altContactNumber', 'altContactName', 'altContactRelation',
    'hasEightGbRam', 'cameraQualityOk', 'hasHighSpeedInternet', 'lightingAdequate', 'attireWilling',
    'aadhaarNumber', 'bankAccountNumber', 'bankName', 'bankBranch', 'ifscCode',
];

/** Document fields. Optional ones are simply skipped when nothing is attached. */
const FILE_FIELDS: Array<keyof OnboardingFormValues> = [
    'resume', 'addressProof', 'panCard', 'aadhaarCard',
    'relievingLetter', 'payslip', 'ramScreenshot', 'speedScreenshot',
];

/** Uploads take much longer than the instance default of 30 seconds. */
const UPLOAD_TIMEOUT_MS = 120000;

/** Turn the backend's validation details into one readable line. */
const formatValidationDetails = (details?: ValidationErrorDetail[]): string | null => {
    if (!details || details.length === 0) return null;
    return details
        .map(detail => detail.msg || detail.message)
        .filter(Boolean)
        .join(' • ');
};

class OnboardingService {

    async submitOnboarding(values: OnboardingFormValues): Promise<ServiceResponse<OnboardingSubmissionData>> {
        try {
            const formData = new FormData();

            // Text fields - empty optional values are sent as empty strings,
            // which the backend treats as "not provided".
            TEXT_FIELDS.forEach(field => {
                formData.append(field, String(values[field] ?? ''));
            });

            // Multipart bodies cannot carry arrays, so slots travel as JSON.
            formData.append('availableSlots', JSON.stringify(values.availableSlots));

            // Documents
            FILE_FIELDS.forEach(field => {
                const file = values[field];
                if (file instanceof File) {
                    formData.append(field, file);
                }
            });

            console.log('🔍 Submitting onboarding form for:', values.email);

            // Content-Type is set by the browser (with the multipart boundary);
            // axios drops the instance's JSON default for FormData payloads.
            const response = await axiosInstance.post('/api/onboarding/submit', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: UPLOAD_TIMEOUT_MS,
            });

            const responseData = response.data as BackendApiResponse<OnboardingSubmissionData>;

            if (responseData.status) {
                return {
                    status: true,
                    message: responseData.msg || 'Onboarding form submitted successfully',
                    data: responseData.data,
                };
            }

            return {
                status: false,
                message: formatValidationDetails(responseData.details)
                    || responseData.msg
                    || 'Failed to submit the onboarding form',
            };

        } catch (error: unknown) {
            console.error('❌ Onboarding submission error:', error);

            if (
                error && typeof error === 'object' && 'response' in error &&
                error.response && typeof error.response === 'object' && 'data' in error.response
            ) {
                const responseData = (error as AxiosErrorResponse).response!.data;
                console.error('📊 Backend response:', responseData);

                return {
                    status: false,
                    message: formatValidationDetails(responseData.details)
                        || responseData.msg
                        || responseData.error
                        || 'Failed to submit the onboarding form',
                };
            }

            // Network failure or the upload exceeded the timeout
            return {
                status: false,
                message: error instanceof Error
                    ? `${error.message}. Please check your connection and try again.`
                    : 'Something went wrong. Please try again.',
            };
        }
    }
}

// Export instance for use in the form hook
export const onboardingService = new OnboardingService();
export default OnboardingService;
