import { ApiError } from "../api/fetcher";
interface UseApiOptions<T> {
    onSuccess?: (data: T) => void;
    onError?: (error: ApiError) => void;
}
export declare function useApi<TRequest, TResponse>(apiCall: (params: TRequest) => Promise<TResponse>, options?: UseApiOptions<TResponse>): {
    execute: (params: TRequest) => Promise<TResponse>;
    data: TResponse | null;
    error: ApiError | null;
    isLoading: boolean;
    reset: () => void;
};
export {};
