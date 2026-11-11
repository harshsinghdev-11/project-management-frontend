"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  Loader2,
  AlertCircle,
  RotateCcw,
  Bot,
  User as UserIcon,
  Copy,
  Check,
  Lightbulb,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { WaxSeal } from "@/components/stationery/wax-seal";
import { Pushpin } from "@/components/stationery/pushpin";
import { clearAgentMessages, getAgentMessages, runAgent } from "@/lib/agent-api";
import { useAuth } from "@/context/auth-context";

interface Message {
  id: string;
  sender: "user" | "agent";
  content: string;
  timestamp: string;
}

const STARTER_PROMPTS = [
  "List all my projects",
  "Create a project called Marketing Campaign",
  "What projects am I an admin of?",
  "List tasks in my active project",
];

const WELCOME_TEXT =
  "Hello! I am your Project Camp Agent. You can ask me to list your projects, create new projects, check tasks, or manage your workspace using natural language.";

function welcomeMessage(): Message {
  return {
    id: "welcome",
    sender: "agent",
    content: WELCOME_TEXT,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
}

function formatTurnTime(createdAt: string): string {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function AgentPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([welcomeMessage()]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      setHistoryLoading(true);
      try {
        const data = await getAgentMessages();
        if (cancelled) return;
        const stored = Array.isArray(data?.messages) ? data.messages : [];
        if (stored.length === 0) {
          setMessages([welcomeMessage()]);
          return;
        }
        setMessages(
          stored.map((turn) => ({
            id: turn._id,
            sender: turn.role === "user" ? "user" : "agent",
            content: turn.content,
            timestamp: formatTurnTime(turn.createdAt),
          })),
        );
      } catch (err: any) {
        if (cancelled) return;
        setError(err?.message || "Could not load previous conversation.");
        setMessages([welcomeMessage()]);
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    }

    loadHistory();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSend = async (queryToSend?: string) => {
    const query = (queryToSend ?? inputQuery).trim();
    if (!query || loading || historyLoading) return;

    setError(null);
    setInputQuery("");

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await runAgent(query);
      const agentMessage: Message = {
        id: `agent-${Date.now()}`,
        sender: "agent",
        content: response.answer || "Request processed, but no details were returned.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, agentMessage]);
    } catch (err: any) {
      const errorMsg =
        err?.message ||
        "Failed to reach the agent. Please make sure the backend and agent services are running.";
      setError(errorMsg);
    } finally {
      setLoading(false);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = async () => {
    if (loading) return;
    setError(null);
    try {
      await clearAgentMessages();
      setMessages([
        {
          id: "welcome-reset",
          sender: "agent",
          content:
            "Conversation cleared. How can I help you manage your projects or tasks today?",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err: any) {
      setError(err?.message || "Could not clear the saved conversation.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FBF9F5] text-[#1E2229]">
      {/* Top Header */}
      <Header
        breadcrumbs={[{ label: "Camp Agent" }]}
        actions={
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-[#7A6B58] hover:text-[#1E2229] hover:bg-[#EAE0D0] border border-[#DDD0BC] transition cursor-pointer"
            title="Clear Chat History"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Chat</span>
          </button>
        }
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto p-3 sm:p-6 overflow-hidden">
        {/* Banner / Card Header */}
        <div className="relative mb-4 p-4 rounded-2xl bg-[#F4EFE6] border border-[#D9CDB8] shadow-xs shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <WaxSeal text="AI" size="sm" />
            <div>
              <h1 className="text-base sm:text-lg font-bold font-editorial text-[#1E2229] flex items-center gap-2">
                Camp AI Assistant
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-[#E4D5BE] text-[#6E4F32] border border-[#D0BA9B]">
                  <Sparkles className="w-3 h-3 text-[#C86446]" />
                  Tool Agent
                </span>
              </h1>
              <p className="text-xs text-[#7A6A55] font-editorial">
                Connected to Node.js REST API with user permissions.
              </p>
            </div>
          </div>
          <div className="hidden sm:block">
            <Pushpin color="brass" size="sm" />
          </div>
        </div>

        {/* Messages Stream Container */}
        <div className="flex-1 overflow-y-auto px-1 sm:px-3 py-2 space-y-4 rounded-xl">
          {historyLoading && (
            <div className="flex items-center gap-2 px-2 py-3 text-xs font-mono text-[#7A6B58]">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C86446]" />
              <span>Loading previous conversation...</span>
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[90%] sm:max-w-[80%] ${
                msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-xs border ${
                  msg.sender === "user"
                    ? "bg-[#C86446] text-white border-[#A84B30]"
                    : "bg-[#ECE3D4] text-[#6E4F32] border-[#D5C6AF]"
                }`}
              >
                {msg.sender === "user" ? (
                  <UserIcon className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4 text-[#8C5E3A]" />
                )}
              </div>

              {/* Message Paper Card */}
              <div
                className={`relative group p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm border transition shadow-xs ${
                  msg.sender === "user"
                    ? "bg-[#FCFAF5] text-[#1E2229] border-[#D9CDB8] rounded-tr-xs"
                    : "bg-[#FFFFFF] text-[#242A35] border-[#D6C7B2] rounded-tl-xs"
                }`}
              >
                {/* Header info */}
                <div className="flex items-center justify-between gap-4 mb-1.5 pb-1 border-b border-[#EFE8DD] text-[10px] font-mono text-[#8C7D6B]">
                  <span className="font-semibold uppercase tracking-wider">
                    {msg.sender === "user" ? (user?.username || "You") : "Camp Agent"}
                  </span>
                  <div className="flex items-center gap-2">
                    <span>{msg.timestamp}</span>
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="opacity-0 group-hover:opacity-100 hover:text-[#1E2229] transition cursor-pointer p-0.5"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-[#2F6B38]" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="whitespace-pre-wrap leading-relaxed font-sans select-text">
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex gap-3 max-w-[85%] mr-auto items-start">
              <div className="w-8 h-8 rounded-full bg-[#ECE3D4] text-[#6E4F32] border border-[#D5C6AF] flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-4 h-4 text-[#8C5E3A]" />
              </div>
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FFFFFF] border border-[#D6C7B2] rounded-tl-xs shadow-xs text-xs sm:text-sm space-y-2">
                <div className="flex items-center gap-2 text-[#C86446] font-medium">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Camp Agent is coordinating with tools...</span>
                </div>
                <p className="text-[11px] font-mono text-[#8C7D6B]">
                  Reading backend state and planning actions. This may take 10–30s.
                </p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-[#FDF2F0] border border-[#F3C4BE] text-[#9A2C24] text-xs sm:text-sm flex items-start gap-2.5 shadow-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#C8453B] mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold font-editorial">Agent execution failed</p>
                <p className="mt-0.5 text-xs text-[#80251F]">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-xs font-mono text-[#9A2C24] hover:underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Starter Suggestion Chips */}
        {messages.length <= 2 && (
          <div className="pt-2 pb-2 shrink-0">
            <div className="flex items-center gap-1.5 mb-2 px-1 text-[11px] font-mono text-[#7A6B58]">
              <Lightbulb className="w-3.5 h-3.5 text-[#C86446]" />
              <span>Suggested prompts:</span>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {STARTER_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  disabled={loading || historyLoading}
                  className="px-2.5 py-1.5 rounded-lg text-xs bg-[#F4EFE6] hover:bg-[#EAE0D0] text-[#554737] border border-[#D9CDB8] transition font-editorial cursor-pointer disabled:opacity-50 text-left shadow-xs"
                >
                  &ldquo;{prompt}&rdquo;
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Query Input Box */}
        <div className="mt-2 shrink-0">
          <div className="relative rounded-2xl bg-[#FCFAF5] border border-[#D5C6AF] shadow-md focus-within:border-[#A83820] transition overflow-hidden">
            <textarea
              ref={textareaRef}
              rows={2}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading || historyLoading}
              placeholder="Ask Camp Agent to create or list projects, tasks, or query status... (Press Enter to send)"
              className="w-full px-4 pt-3 pb-10 text-xs sm:text-sm bg-transparent border-0 focus:ring-0 resize-none outline-none placeholder:text-[#A89885] text-[#1E2229]"
            />

            <div className="absolute bottom-2.5 left-4 right-3 flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#A89885] hidden sm:inline">
                Shift + Enter for new line • Enter to submit
              </span>
              <button
                onClick={() => handleSend()}
                disabled={!inputQuery.trim() || loading || historyLoading}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-editorial font-bold text-white bg-[#C86446] hover:bg-[#B34F34] disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition cursor-pointer border border-[#9A371F]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

