import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X } from "lucide-react";
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
import Link from "next/link";

import "../styles/chat-widget.css";

interface ChatWidgetProps {
  folderId: string;
  projectId: string;
  threadId: string;
}

const ChatWidget = ({ folderId, projectId, threadId }: ChatWidgetProps) => {
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
      const assistantId = data.data!.id;
      // get the chats
      getAllChats({
        query: { thread_id: threadId, assistant_id: assistantId },
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
      if (data.data) {
        setMessages(data.data!);
      }
    },
    onError: (error) => {},
  });

  // Send Message
  const { execute: sendMessage, isLoading: sendingMessage } = useApi<
    ChatsApiRequest,
    ApiResponse<Message>
  >(chatsApi.sendMessage, {
    onSuccess: (data) => {
      console.log(data);
      // hide the typing thing
      setMessages((prevMessages) => [...prevMessages, data.data!]);
      removeSystemTyping();
    },
    onError: (error) => {},
  });

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  useEffect(() => {
    getAssistant({
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
      id: new Date().toISOString(),
      content: "system_typing",
      sent_on: new Date().toISOString(),
      thread_id: threadId,
      role: "assistant",
      assistant_id: assistant!.id,
      project_id: projectId,
    };

    setMessages((prevMessages) => [...prevMessages, typingIndicator]);
  };

  const addNewMessage = ({
    sentByAssistant,
    content,
  }: {
    sentByAssistant: boolean;
    content: string;
  }) => {
    const message: Message = {
      id: new Date().toISOString(),
      content: content,
      role: sentByAssistant ? "assistant" : "user",
      thread_id: threadId,
      assistant_id: assistant!.id,
      project_id: projectId,
    };
    // Update the chat list
    setMessages((prevMessages) =>
      prevMessages ? [...prevMessages, message] : [message]
    );
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
    });

    setTimeout(() => {
      addTypingIndicator();
    }, 10);

    // Simulate assistant response (replace with actual logic)
    try {
      await sendMessage({
        data: {
          folder_id: folderId,
          query: inputMessage.trim(),
          thread_id: threadId,
          assistant_id: assistant!.id,
          project_id: projectId,
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
    <div className="fixed-bottom-right">
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
              <p className="font-semibold text-white">{assistant.name}</p>
              <p className="text-xs text-white/70">{assistant.designation}</p>
            </div>
            <X
              width={30}
              height={20}
              className="text-white cursor-pointer"
              onClick={() => {
                setIsOpen(false);
              }}
            />
          </div>

          {/* Message List */}
          <div className="flex flex-col flex-grow rounded-b-md space-y-2 overflow-y-auto border">
            <div className="px-2 pt-2 space-y-2 flex-grow overflow-y-auto">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <ChatBubble
                    key={message.id}
                    message={message}
                    themeColor={assistant.color}
                  />
                ))
              ) : (
                <div className="text-center text-gray-800 py-4">
                  {assistant.conversation_starter}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Control */}

            <div className="rounded-md flex border border-neutral-300 px-2 mx-2 mb-4 mt-2">
              <input
                placeholder="Enter a message"
                className="border-none focus:border-none focus:outline-none text-black bg-white flex flex-grow text-sm px-2 py-4"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button onClick={handleSendMessage} className="mr-3">
                <Send size={18} className="bg-transparent" color="#000" />
              </button>
            </div>

            <div className="bg-neutral-100 border-t border-neutral-300 text-[10px] text-black/60 font-medium text-center rounded-b-md py-2">
              <span>Powered by </span>
              <Link href="https://inquirely-web.vercel.app" target="_blank">
                <span className="hover:underline">Inquirely.io</span>
              </Link>
            </div>
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
