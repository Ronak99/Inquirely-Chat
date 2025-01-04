export interface ApiResponse<T = any> {
  data?: T;
  error?: {
    code?: string;
    message: string;
  };
}

export interface ChatsApiRequest {
  query?: {
    assistant_id: string;
  };
  data?: {
    query: string;
    folder_id: string;
    assistant_id: string;
  };
  headers: {
    Authorization: string;
  };
}

export interface AssistantApiRequest {
  query: {
    project_id: string;
  };
  headers: {
    Authorization: string;
  };
}

export interface Assistant {
  id: string;
  name: string;
  designation: string;
  base_prompt: string;
  avatar_url: string;
  created_at: string;
  color: string;
  conversation_starter: string;
  project_id: string;
}

export interface Message {
  id?: string;
  content: string;
  sent_on?: string;
  sender: string;
  role: string;
  // Assistant ID
  thread_id: string;
}
