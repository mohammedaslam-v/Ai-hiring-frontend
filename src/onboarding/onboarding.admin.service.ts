// Onboarding module - admin API access.
//
// These endpoints sit behind the admin JWT (attached automatically by the
// shared axios instance) AND an email allow-list on the server, so a 403 here
// means "this admin account is not permitted", not "you are logged out".

import { ServiceResponse } from '@/types/interface';
import { BackendApiResponse, AxiosErrorResponse } from '@/types/api';
import axiosInstance from '@/services/instance';
import {
  OnboardingListFilters,
  OnboardingListResponse,
  OnboardingSubmissionDetail,
} from './onboarding.types';

/** Marker the page uses to show "no access" instead of a generic error. */
export const ONBOARDING_FORBIDDEN = 'ONBOARDING_ACCESS_DENIED';

class OnboardingAdminService {

  /** Paged list of submissions, newest first. */
  async listSubmissions(
    filters: OnboardingListFilters
  ): Promise<ServiceResponse<OnboardingListResponse>> {
    try {
      const response = await axiosInstance.get('/api/admin/onboarding', {
        params: {
          page: filters.page,
          limit: filters.limit,
          // Omit an empty search so the backend does not filter on ''
          ...(filters.search ? { search: filters.search } : {}),
        },
      });

      const data = response.data as BackendApiResponse<OnboardingListResponse>;

      if (data.status) {
        return { status: true, message: data.msg, data: data.data };
      }
      return { status: false, message: data.msg || 'Failed to load submissions' };

    } catch (error: unknown) {
      return this.toErrorResponse(error, 'Failed to load onboarding submissions');
    }
  }

  /** One submission with every answer plus expiring document links. */
  async getSubmission(id: number): Promise<ServiceResponse<OnboardingSubmissionDetail>> {
    try {
      const response = await axiosInstance.get(`/api/admin/onboarding/${id}`);
      const data = response.data as BackendApiResponse<OnboardingSubmissionDetail>;

      if (data.status) {
        return { status: true, message: data.msg, data: data.data };
      }
      return { status: false, message: data.msg || 'Failed to load the submission' };

    } catch (error: unknown) {
      return this.toErrorResponse(error, 'Failed to load the submission');
    }
  }

  /** Shared error mapping; surfaces the access-denied case verbatim. */
  private toErrorResponse(error: unknown, fallback: string): ServiceResponse<never> {
    console.error('❌ Onboarding admin API error:', error);

    if (
      error && typeof error === 'object' && 'response' in error &&
      error.response && typeof error.response === 'object' && 'data' in error.response
    ) {
      const response = (error as AxiosErrorResponse).response!;
      if (response.status === 403) {
        return { status: false, message: ONBOARDING_FORBIDDEN };
      }
      return { status: false, message: response.data?.msg || response.data?.error || fallback };
    }

    return { status: false, message: error instanceof Error ? error.message : fallback };
  }
}

export const onboardingAdminService = new OnboardingAdminService();
export default OnboardingAdminService;
