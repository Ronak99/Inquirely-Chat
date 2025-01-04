import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, SparklesIcon } from "lucide-react";
import { assistantsApi, chatsApi } from "../api/endpoints";
import {
  ApiResponse,
  Assistant,
  AssistantApiRequest,
  ChatsApiRequest,
  Message,
} from "../types/api";
import { useApi } from "../hooks/useApi";
import ChatBubble from "./chat_bubble";

interface ChatWidgetProps {
  primaryColor?: string;
  folderId: string;
  projectId: string;
  apiKey: string;
}

const ChatWidget = ({ folderId, projectId, apiKey }: ChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [assistant, setAssistant] = useState<Assistant | null>(null);

  // Assistant API
  const { execute: getAssistant, isLoading: loadingAssistant } = useApi<
    AssistantApiRequest,
    ApiResponse<Assistant>
  >(assistantsApi.get, {
    onSuccess: (data) => {
      setAssistant(data.data!);

      // get the chats
      getAllChats({
        headers: { Authorization: apiKey },
        query: { assistant_id: data.data!.id },
      });
    },
    onError: (error) => {
      // handleAssistantError(error);
    },
  });

  // Get All Chats
  const { execute: getAllChats, isLoading: loadingAllChats } = useApi<
    ChatsApiRequest,
    ApiResponse<Message[]>
  >(chatsApi.getAllChats, {
    onSuccess: (data) => {
      setMessages(data.data!);
    },
    onError: (error) => {},
  });

  // Send Message
  const { execute: sendMessage, isLoading: sendingMessage } = useApi<
    ChatsApiRequest,
    ApiResponse<Message>
  >(chatsApi.sendMessage, {
    onSuccess: (data) => {
      // hide the typing thing
      setMessages((prevMessages) => [...prevMessages, data.data!]);
      removeSystemTyping();
    },
    onError: (error) => {},
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    getAssistant({
      headers: { Authorization: apiKey },
      query: { project_id: projectId },
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const removeSystemTyping = () => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message.content != "system_typing")
    );
  };

  const addTypingIndicator = () => {
    const typingIndicator: Message = {
      content: "system_typing",
      id: new Date().toISOString(),
      sender: assistant!.id,
      sent_on: new Date().toISOString(),
      thread_id: assistant!.id,
      role: "assistant",
    };

    setMessages((prevMessages) => [...prevMessages, typingIndicator]);
  };

  const addNewMessage = ({
    sentByAssistant,
    content,
    sender,
  }: {
    sentByAssistant: boolean;
    content: string;
    sender: string;
  }) => {
    const message: Message = {
      content: content,
      role: sentByAssistant ? "assistant" : "user",
      sender: sender,
      thread_id: assistant!.id,
    };

    // Update the chat list
    setMessages((prevMessages) => [...prevMessages, message]);

    // Clear input message.
    setInputMessage("");
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!assistant) return;
    if (inputMessage.trim() === "") return;

    addNewMessage({
      content: inputMessage.trim(),
      sentByAssistant: false,
      sender: projectId,
    });

    addTypingIndicator();

    // Simulate assistant response (replace with actual logic)
    try {
      await sendMessage({
        data: {
          folder_id: folderId,
          query: inputMessage.trim(),
          assistant_id: assistant.id,
        },
        headers: {
          Authorization: apiKey,
        },
      });
    } catch (e) {
    } finally {
    }
  };

  // Handle input key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // ************ UI BEGINS ***********
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && assistant ? (
        <div className="w-[400px] flex flex-col h-[650px] bg-white rounded-md">
          <div
            className={`h-[60px] py-4 rounded-t-md flex items-center px-2 space-x-2`}
            style={{ background: assistant.color }}
          >
            <img
              className="rounded-full"
              src={assistant.avatar_url}
              alt=""
              width={40}
              height={40}
            />
            <div className="flex flex-col flex-grow">
              <p className="font-semibold">{assistant.name}</p>
              <p className="text-xs text-white/70">{assistant.designation}</p>
            </div>
            <SparklesIcon width={30} height={20} />
          </div>

          {/* Message List */}
          <div className="bg-white flex flex-col flex-grow px-2 pt-2 space-y-2 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center text-gray-800 py-4">
                {assistant.conversation_starter}
              </div>
            ) : (
              messages.map((message) => (
                <ChatBubble message={message} themeColor={assistant.color} />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Control */}
          <div className="bg-white">
            <div className="rounded-md flex border border-neutral-300 py-4 px-2 mx-2 mb-4 mt-2">
              <input
                placeholder="Enter a message"
                className="border-none focus:border-none focus:outline-none text-black bg-white flex flex-grow text-sm px-2"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button onClick={handleSendMessage} className="mr-3">
                <Send size={18} className="bg-transparent" color="#000" />
              </button>
            </div>
          </div>
          <div className="bg-neutral-100 border-t border-neutral-300 text-[10px] text-black/60 font-medium text-center rounded-b-md py-2">
            Powered by Inquirely.io
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          disabled={false}
          className="rounded-full p-3 text-white hover:opacity-90 transition"
          style={{ background: assistant?.color }}
        >
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
