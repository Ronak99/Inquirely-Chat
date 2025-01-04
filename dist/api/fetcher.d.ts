export declare class ApiError extends Error {
    status?: number | undefined;
    code?: string | undefined;
    constructor(message: string, status?: number | undefined, code?: string | undefined);
}
type QueryParamValue = string | number | boolean | null | undefined;
interface FetcherOptions<TQuery extends Record<string, QueryParamValue> | undefined = undefined> {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    headers?: Record<string, string>;
    body?: any;
    query?: Record<string, any>;
}
export declare function fetcher<TResponse>(endpoint: string, options?: FetcherOptions): Promise<TResponse>;
export {};
