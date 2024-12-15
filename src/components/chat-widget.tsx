import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, SparklesIcon } from "lucide-react";
import { useApi } from "../hooks/useApi";
import { AskApiRequest, AskApiResponse } from "../types/api";
import { askApi } from "../api/endpoints";
import SystemBubble from "./system-bubble";
import UserBubble from "./user-bubble";
import Message from "../types/message";

interface ChatWidgetProps {
  initialMessages?: Message[];
  onSendMessage?: (message: string) => void;
  primaryColor?: string;
  folderId: string;
}

const ChatWidget = ({
  initialMessages = [],
  onSendMessage = () => {},
  primaryColor = "#0070f3",
  folderId,
}: ChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { execute: executeQuery, isLoading } = useApi<
    AskApiRequest,
    AskApiResponse
  >(askApi.ask, {
    onSuccess: (data) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: data.response,
        sender: "system",
        timestamp: new Date(),
      };
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, newMessage];
        scrollToBottom(); // Scroll to bottom after updating messages
        return updatedMessages;
      });
    },
    onError: (error) => {
      console.error("Failed to fetch response:", error);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: inputValue,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);

      executeQuery({
        folder_id: folderId,
        query: inputValue,
      });

      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  const generateResponse = async () => {};

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-slate-100 rounded-lg shadow-xl w-80 h-[450px] flex flex-col">
          {/* Header */}
          <div
            className="py-2 px-4 flex justify-between items-center rounded-tl-md rounded-tr-md"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="flex items-center space-x-2">
              <SparklesIcon size={15} fill="white" />
              <h3 className="text-white font-semibold">Travel AI</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:opacity-75"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 pt-4 space-y-4">
            {messages.map((message) =>
              message.sender == "user" ? (
                <UserBubble
                  key={message.id}
                  message={message}
                  primaryColor={primaryColor}
                />
              ) : (
                <SystemBubble key={message.id} message={message} />
              )
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="shadow-md shadow-gray-300 bg-white ml-4 mr-4 mb-4 rounded-lg">
            <div className="flex">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Inquire about your trip..."
                className="flex-1 outline-none text-xs text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-0"
              />
              <button onClick={handleSendMessage} className="rounded-lg mr-3">
                <Send size={16} color={primaryColor} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          disabled={isLoading}
          className="rounded-full p-3 text-white shadow-lg hover:opacity-90"
          style={{ backgroundColor: primaryColor }}
        >
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
