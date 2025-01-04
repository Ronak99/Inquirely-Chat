// import { useEffect } from "react";
// import { assistantsApi, chatsApi } from "../api/endpoints";
// import {
//   ApiResponse,
//   Assistant,
//   AssistantApiRequest,
//   ChatsApiRequest,
//   Message,
// } from "../types/api";
// import { useApi } from "./useApi";

// export function useApiHooks() {
//   // Assistant API
//   const { execute: getAssistant, isLoading: loadingAssistant } = useApi<
//     AssistantApiRequest,
//     ApiResponse<Assistant>
//   >(assistantsApi.get, {
//     onSuccess: (data) => {
//       handleAssistantSuccess(data);
//     },
//     onError: (error) => {
//       handleAssistantError(error);
//     },
//   });

//   // Get All Chats
//   const { execute: getAllChats, isLoading: loadingAllChats } = useApi<
//     ChatsApiRequest,
//     ApiResponse<Message[]>
//   >(chatsApi.getAllChats, {
//     onSuccess: (data) => {
//       handleChatsSuccess(data);
//     },
//     onError: (error) => {
//       handleChatsError(error);
//     },
//   });

//   // Send Message
//   const { execute: sendMessage, isLoading: sendingMessage } = useApi<
//     ChatsApiRequest,
//     ApiResponse<Message>
//   >(chatsApi.sendMessage, {
//     onSuccess: (data) => {
//         // hide the typing thing...
//       handleMessageSuccess(data);
//     },
//     onError: (error) => {
//       handleMessageError(error);
//     },
//   });

//   // Success handlers
//   const handleAssistantSuccess = (data: ApiResponse<Assistant>) => {
//     // store assistant
//   };

//   const handleChatsSuccess = (data: ChatsApiResponse) => {
//     // handle all chats
//   };

//   const handleMessageSuccess = (data: ChatsApiResponse) => {
//     // handle message
//   };

//   // Error handlers
//   const handleAssistantError = (error: Error) => {
//     console.error("Failed to fetch assistant:", error);
//   };

//   const handleChatsError = (error: Error) => {
//     console.error("Failed to fetch chats:", error);
//   };

//   const handleMessageError = (error: Error) => {
//     console.error("Failed to send message:", error);
//   };

//   return {
//     // Loading states
//     loadingStates: {
//       loadingAssistant,
//       loadingAllChats,
//       sendingMessage,
//     },
//     // Execute functions
//     actions: {
//       getAssistant,
//       getAllChats,
//       sendMessage,
//     },
//     // Success handlers
//     successHandlers: {
//       handleAssistantSuccess,
//       handleChatsSuccess,
//       handleMessageSuccess,
//     },
//     // Error handlers
//     errorHandlers: {
//       handleAssistantError,
//       handleChatsError,
//       handleMessageError,
//     },
//   };
// }
