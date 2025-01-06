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
    <div
      style={{
        position: "fixed",
        bottom: "16px",
        right: "16px",
        zIndex: 50,
        fontFamily: "sans-serif",
      }}
    >
      {isOpen && assistant ? (
        <div
          style={{
            width: "400px",
            display: "flex",
            flexDirection: "column",
            height: "650px",
            backgroundColor: "white",
            borderRadius: "6px",
          }}
        >
          <div
            style={{
              height: "60px",
              paddingTop: "8px",
              paddingBottom: "8px",
              borderTopLeftRadius: "6px",
              borderTopRightRadius: "6px",
              display: "flex",
              alignItems: "center",
              paddingLeft: "8px",
              paddingRight: "8px",
              gap: "8px",
              background: assistant.color,
            }}
          >
            <img
              style={{ borderRadius: "9999px" }}
              src={assistant.avatar_url}
              alt=""
              width={40}
              height={40}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                gap: 0,
              }}
            >
              <span
                style={{
                  fontWeight: 600,
                  color: "white",
                }}
              >
                {assistant.name}
              </span>
              <span
                style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.7)" }}
              >
                {assistant.designation}
              </span>
            </div>
            <X
              width={30}
              height={20}
              style={{ color: "white", cursor: "pointer" }}
              onClick={() => {
                setIsOpen(false);
              }}
            />
          </div>

          {/* Message List */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              borderBottomLeftRadius: "6px",
              borderBottomRightRadius: "6px",
              gap: "8px",
              overflowY: "auto",
              border: "1px solid rgb(212, 212, 212)",
            }}
          >
            <div
              style={{
                padding: "8px 8px 0 8px",
                gap: "8px",
                flexGrow: 1,
                overflowY: "auto",
              }}
            >
              {messages.length > 0 ? (
                messages.map((message) => (
                  <ChatBubble
                    key={message.id}
                    message={message}
                    themeColor={assistant.color}
                  />
                ))
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    color: "rgb(31, 41, 55)",
                    padding: "16px 0",
                  }}
                >
                  {assistant.conversation_starter}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Control */}
            <div
              style={{
                borderRadius: "6px",
                display: "flex",
                border: "1px solid rgb(212, 212, 212)",
                padding: "0 8px",
                margin: "0px 8px 0px 8px",
              }}
            >
              <input
                placeholder="Enter a message"
                style={{
                  border: "none",
                  outline: "none",
                  color: "black",
                  backgroundColor: "white",
                  display: "flex",
                  flexGrow: 1,
                  fontSize: "14px",
                  padding: "16px 8px",
                }}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                onClick={handleSendMessage}
                style={{ marginRight: "12px" }}
              >
                <Send
                  size={18}
                  style={{ backgroundColor: "transparent" }}
                  color="#000"
                />
              </button>
            </div>

            <div
              style={{
                backgroundColor: "rgb(243, 244, 246)",
                borderTop: "1px solid rgb(212, 212, 212)",
                fontSize: "10px",
                color: "rgba(0, 0, 0, 0.6)",
                fontWeight: 500,
                textAlign: "center",
                borderBottomLeftRadius: "6px",
                borderBottomRightRadius: "6px",
                padding: "8px 0",
              }}
            >
              <span>Powered by </span>
              <Link href="https://inquirely-web.vercel.app" target="_blank">
                <span style={{ cursor: "pointer" }}>Inquirely.io</span>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          disabled={false}
          style={{
            borderRadius: "9999px",
            padding: "12px",
            color: "white",
            transition: "opacity 0.3s",
            background: assistant?.color,
            cursor: "pointer",
            border: 0,
          }}
        >
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
