"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, X, FileText, Loader2 } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (content: string, files?: File[]) => Promise<void>;
  onTyping: () => void;
  onStopTyping: () => void;
  disabled?: boolean;
}

export function ChatInput({
  onSendMessage,
  onTyping,
  onStopTyping,
  disabled = false,
}: ChatInputProps) {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);

    // Typing indication with debounce
    onTyping();
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      onStopTyping();
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selected]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    const trimmed = content.trim();
    if ((!trimmed && files.length === 0) || sending || disabled) return;

    try {
      setSending(true);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      onStopTyping();

      await onSendMessage(trimmed || (files.length > 0 ? "Shared attachments" : ""), files);
      setContent("");
      setFiles([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } finally {
      setSending(false);
    }
  };

  // Auto-resize textarea height as content changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120,
      )}px`;
    }
  }, [content]);

  return (
    <div className="p-3 bg-[#FAF7F0] border-t border-[#DDD3C4]">
      {/* Attached Files Chips */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2 max-h-20 overflow-y-auto">
          {files.map((file, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#DDD0BC] rounded-lg text-[11px] text-[#4E4133] shadow-2xs"
            >
              <FileText className="w-3 h-3 text-[#8C5E3A]" />
              <span className="max-w-[130px] truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="text-[#8E7E6C] hover:text-[#C86446] transition cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Row */}
      <div className="flex items-end gap-2 bg-white rounded-xl border border-[#DDD0BC] p-1.5 shadow-2xs focus-within:border-[#C86446] focus-within:ring-1 focus-within:ring-[#C86446]/20 transition">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* Paperclip Attachment Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || sending}
          title="Attach files"
          className="p-1.5 text-[#8C7D6B] hover:text-[#C86446] hover:bg-[#F8F4EC] rounded-lg transition cursor-pointer shrink-0 disabled:opacity-50"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={content}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Enter to send)"
          disabled={disabled || sending}
          className="flex-1 max-h-28 bg-transparent text-xs text-[#1E2229] placeholder-[#9E9080] outline-none resize-none py-1.5 px-1 leading-relaxed font-sans"
        />

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={(!content.trim() && files.length === 0) || sending || disabled}
          className="p-1.5 rounded-lg bg-[#C86446] hover:bg-[#B34F34] text-white transition cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
        >
          {sending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
