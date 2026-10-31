"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  X,
  MessageSquare,
  Loader2,
  AlertCircle,
  Wifi,
  WifiOff,
  Users,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useSocket } from "@/context/socket-context";
import { chatApi } from "@/lib/chat-api";
import {
  JOIN_CHAT_EVENT,
  LEAVE_CHAT_EVENT,
  MESSAGE_RECEIVED_EVENT,
  TYPING_EVENT,
  STOP_TYPING_EVENT,
} from "@/lib/socket-events";
import { Conversation, ChatMessage } from "@/types/api";
import { ChatMessageItem } from "./chat-message-item";
import { ChatInput } from "./chat-input";

interface ChatDrawerProps {
  projectId: string;
  projectName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ChatDrawer({
  projectId,
  projectName,
  isOpen,
  onClose,
}: ChatDrawerProps) {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<
    { _id: string; username: string; fullName?: string }[]
  >([]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Load project default conversation and initial messages
  const loadChatData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const conv = await chatApi.getProjectDefaultChat(projectId);
      setConversation(conv);

      const history = await chatApi.getConversationMessages(conv._id, 1, 50);
      // History from backend is sorted createdAt: -1 (newest first), reverse for chronological display
      const chronological = (history?.messages || []).slice().reverse();
      setMessages(chronological);
    } catch (err: any) {
      setError(err?.message || "Failed to load project conversation");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (isOpen) {
      loadChatData();
    }
  }, [isOpen, loadChatData]);

  // Socket room connection and event handlers
  useEffect(() => {
    if (!socket || !conversation?._id || !isOpen) return;

    const conversationId = conversation._id;

    // Join room
    socket.emit(JOIN_CHAT_EVENT, { conversationId });

    // Listen for new messages
    const handleMessageReceived = (newMessage: ChatMessage) => {
      if (newMessage.conversation === conversationId) {
        setMessages((prev) => {
          // Avoid duplicate messages
          if (prev.some((m) => m._id === newMessage._id)) return prev;
          return [...prev, newMessage];
        });
      }
    };

    // Listen for typing events
    const handleUserTyping = (data: {
      conversationId: string;
      user: { _id: string; username: string; fullName?: string };
    }) => {
      if (
        data.conversationId === conversationId &&
        data.user._id !== user?._id
      ) {
        setTypingUsers((prev) => {
          if (prev.some((u) => u._id === data.user._id)) return prev;
          return [...prev, data.user];
        });
      }
    };

    const handleUserStopTyping = (data: {
      conversationId: string;
      user: { _id: string };
    }) => {
      if (data.conversationId === conversationId) {
        setTypingUsers((prev) => prev.filter((u) => u._id !== data.user._id));
      }
    };

    socket.on(MESSAGE_RECEIVED_EVENT, handleMessageReceived);
    socket.on(TYPING_EVENT, handleUserTyping);
    socket.on(STOP_TYPING_EVENT, handleUserStopTyping);

    return () => {
      socket.emit(LEAVE_CHAT_EVENT, { conversationId });
      socket.off(MESSAGE_RECEIVED_EVENT, handleMessageReceived);
      socket.off(TYPING_EVENT, handleUserTyping);
      socket.off(STOP_TYPING_EVENT, handleUserStopTyping);
    };
  }, [socket, conversation?._id, isOpen, user?._id]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, typingUsers]);

  // Send message handler
  const handleSendMessage = async (content: string, files?: File[]) => {
    if (!conversation?._id) return;

    try {
      const sentMessage = await chatApi.sendChatMessage(
        conversation._id,
        content,
        files,
      );

      // Optimistically append message if not already added by socket
      setMessages((prev) => {
        if (prev.some((m) => m._id === sentMessage._id)) return prev;
        return [...prev, sentMessage];
      });
    } catch (err: any) {
      console.error("Failed to send message:", err);
    }
  };

  // Typing state emitters
  const handleStartTyping = () => {
    if (socket && conversation?._id) {
      socket.emit(TYPING_EVENT, { conversationId: conversation._id });
    }
  };

  const handleStopTyping = () => {
    if (socket && conversation?._id) {
      socket.emit(STOP_TYPING_EVENT, { conversationId: conversation._id });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-md bg-[#FBF9F5] h-full shadow-2xl flex flex-col z-10 border-l border-[#DDD3C4] animate-in slide-in-from-right duration-300 ease-out">
        {/* Header */}
        <div className="px-5 py-4 bg-[#FAF7F0] border-b border-[#DDD3C4] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#F4EFE6] border border-[#DDD0BC] flex items-center justify-center text-[#C86446] shadow-xs shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>

            <div className="min-w-0">
              <h2 className="font-editorial text-sm sm:text-base font-bold text-[#1E2229] truncate">
                {conversation?.name || `${projectName} General`}
              </h2>

              {/* Status Badge */}
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isConnected
                      ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]"
                      : "bg-amber-400"
                  }`}
                />
                <span className="text-[11px] font-medium text-[#7D6E5D]">
                  {isConnected ? "Connected" : "Connecting..."}
                </span>
                <span className="text-[#C5B8A5]">•</span>
                <span className="text-[11px] text-[#8C7D6B]">Project Group</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#7E6F5E] hover:text-[#1E2229] hover:bg-[#EFE7D8] rounded-xl transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1 bg-[#FBF9F5]">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center text-[#8C7D6B] gap-2.5">
              <Loader2 className="w-6 h-6 animate-spin text-[#C86446]" />
              <span className="text-xs font-editorial">Loading chat...</span>
            </div>
          ) : error ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-2">
              <div className="p-2.5 rounded-full bg-[#FDF0ED] border border-[#EAA896] text-[#A83820]">
                <AlertCircle className="w-5 h-5" />
              </div>
              <p className="text-xs text-[#A83820] font-medium">{error}</p>
              <button
                onClick={loadChatData}
                className="mt-2 px-3 py-1 bg-[#F2ECE0] hover:bg-[#E5DDCB] text-xs font-editorial font-bold rounded-lg border border-[#DDD0BC] transition"
              >
                Try Again
              </button>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-2 select-none">
              <div className="w-12 h-12 rounded-2xl bg-[#F5EFE4] border border-[#DDD0BC] flex items-center justify-center text-[#C86446] mb-1">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-sm font-bold text-[#1E2229]">
                Welcome to the Group Chat!
              </h3>
              <p className="text-xs text-[#7A6B59] max-w-xs leading-relaxed">
                This is the default discussion room for all members of{" "}
                <span className="font-semibold text-[#1E2229]">{projectName}</span>.
                Send a message below to start collaborating.
              </p>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <ChatMessageItem
                  key={msg._id}
                  message={msg}
                  isOwnMessage={msg.sender?._id === user?._id}
                />
              ))}

              {/* Typing Indicator */}
              {typingUsers.length > 0 && (
                <div className="flex items-center gap-2 py-1 px-2 text-[11px] text-[#7A6B59] italic animate-pulse">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C86446] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C86446] animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C86446] animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span>
                    {typingUsers
                      .map((u) => u.fullName || u.username)
                      .join(", ")}{" "}
                    {typingUsers.length === 1 ? "is typing..." : "are typing..."}
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Chat Input Bar */}
        <ChatInput
          onSendMessage={handleSendMessage}
          onTyping={handleStartTyping}
          onStopTyping={handleStopTyping}
          disabled={loading || !!error}
        />
      </div>
    </div>
  );
}
