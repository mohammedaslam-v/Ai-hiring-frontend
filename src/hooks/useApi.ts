import { useState, useCallback } from 'react';

// Generic API response type
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Base hook state interface
export interface UseApiState {
  loading: boolean;
  error: string | null;
}

// Base hook return type
export interface UseApiReturn<T = unknown> extends UseApiState {
  execute: (...args: unknown[]) => Promise<ApiResponse<T>>;
  clearError: () => void;
  setError: (error: string) => void;
}

// Configuration for the base hook
export interface UseApiConfig<T = unknown> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  onFinally?: () => void;
}

/**
 * Base hook for API operations with consistent error handling and loading states
 * @param apiFunction - The API function to execute
 * @param config - Optional configuration for success/error callbacks
 * @returns Object with loading state, error state, execute function, and utility functions
 */
export function useApi<T = unknown>(
  apiFunction: (...args: unknown[]) => Promise<{ status: boolean; data?: T; message?: string }>,
  config?: UseApiConfig<T>
): UseApiReturn<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: unknown[]): Promise<ApiResponse<T>> => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiFunction(...args);

        if (response.status) {
          const result: ApiResponse<T> = {
            success: true,
            data: response.data,
          };

          config?.onSuccess?.(response.data);
          return result;
        } else {
          const result: ApiResponse<T> = {
            success: false,
            error: response.message,
          };

          setError(response.message || 'Operation failed');
          config?.onError?.(response.message || 'Operation failed');
          return result;
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
        const result: ApiResponse<T> = {
          success: false,
          error: errorMessage,
        };

        setError(errorMessage);
        config?.onError?.(errorMessage);
        return result;
      } finally {
        setLoading(false);
        config?.onFinally?.();
      }
    },
    [apiFunction, config]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const setErrorState = useCallback((error: string) => {
    setError(error);
  }, []);

  return {
    loading,
    error,
    execute,
    clearError,
    setError: setErrorState,
  };
}
