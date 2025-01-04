import { fetcher } from "./fetcher";
import { API_ENDPOINTS } from "./config";
import type {
  ApiResponse,
  Assistant,
  AssistantApiRequest,
  ChatsApiRequest,
  Message,
} from "../types/api";

// export const askApi = {
//   // Add other project-related endpoints here
//   ask: (request: AskApiRequest) =>
//     fetcher<AskApiResponse>(API_ENDPOINTS.CHATS, {
//       method: "POST",
//       body: request.data,
//       headers: request.headers,
//     }),
// };
export const chatsApi = {
  // Add other project-related endpoints here
  getAllChats: (request: ChatsApiRequest) =>
    fetcher<ApiResponse<Message[]>>(API_ENDPOINTS.CHATS, {
      method: "GET",
      query: request.query,
      headers: request.headers,
    }),

  sendMessage: (request: ChatsApiRequest) =>
    fetcher<ApiResponse<Message>>(API_ENDPOINTS.CHATS, {
      method: "POST",
      body: request.data,
      headers: request.headers,
    }),
};

export const assistantsApi = {
  // Add other project-related endpoints here
  get: (request: AssistantApiRequest) =>
    fetcher<ApiResponse<Assistant>>(API_ENDPOINTS.ASSISTANTS, {
      method: "GET",
      query: request.query,
      headers: request.headers,
    }),
};
