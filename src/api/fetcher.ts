import { ApiResponse } from "../types/api";
import { API_BASE_URL } from "./config";

export class ApiError extends Error {
  constructor(message: string, public status?: number, public code?: string) {
    super(message);
    this.name = "ApiError";
  }
}

// Type for query parameter values
type QueryParamValue = string | number | boolean | null | undefined;

// Helper type to ensure all query parameter values are valid types
type QueryParams<T extends Record<string, QueryParamValue>> = T;

interface FetcherOptions<
  TQuery extends Record<string, QueryParamValue> | undefined = undefined
> {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  query?: Record<string, any>;
}

// Helper function to build query string from params
function buildQueryString(params: Record<string, QueryParamValue>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

export async function fetcher<TResponse>(
  endpoint: string,
  options: FetcherOptions = {}
): Promise<TResponse> {
  const { method = "GET", headers = {}, body, query } = options;

  const requestOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...headers,
    },
  };

  if (body) {
    requestOptions.body = JSON.stringify(body);
  }

  try {
    // Build the URL with query parameters if they exist
    const queryString = query ? buildQueryString(query) : "";
    const response = await fetch(
      `${API_BASE_URL}${endpoint}${queryString}`,
      requestOptions
    );
    const data: ApiResponse<TResponse> = await response.json();

    if (!response.ok || data.error) {
      throw new ApiError(
        data.error?.message || "An unknown error occurred",
        response.status,
        data.error?.code
      );
    }

    return data as TResponse;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}
