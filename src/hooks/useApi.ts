import { useState } from "react";
import { ApiError } from "../api/fetcher";

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
}

export function useApi<TRequest, TResponse>(
  apiCall: (params: TRequest) => Promise<TResponse>,
  options: UseApiOptions<TResponse> = {}
) {
  const [data, setData] = useState<TResponse | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = async (...args: Parameters<typeof apiCall>) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiCall(...args);
      setData(result);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const apiError =
        err instanceof ApiError ? err : new ApiError("Unknown error occurred");
      setError(apiError);
      options.onError?.(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    execute,
    data,
    error,
    isLoading,
    reset: () => {
      setData(null);
      setError(null);
      setIsLoading(false);
    },
  };
}
