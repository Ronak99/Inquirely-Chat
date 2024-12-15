import { fetcher } from "./fetcher";
import { API_ENDPOINTS } from "./config";
import type { AskApiRequest, AskApiResponse } from "../types/api";

export const askApi = {
  // Add other project-related endpoints here
  ask: (data: AskApiRequest) =>
    fetcher<AskApiResponse>(API_ENDPOINTS.ASK, {
      method: "POST",
      body: data,
    }),
};
