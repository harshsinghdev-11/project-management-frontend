"use client";

import React from "react";
import { ChatMessage } from "@/types/api";
import { FileText, Paperclip, Download } from "lucide-react";

interface ChatMessageItemProps {
  message: ChatMessage;
  isOwnMessage: boolean;
}

export function ChatMessageItem({ message, isOwnMessage }: ChatMessageItemProps) {
  const senderName =
    message.sender?.fullName || message.sender?.username || "Team Member";
  const avatarUrl = message.sender?.avatar?.url;
  const initial = senderName.charAt(0).toUpperCase();

  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex items-end gap-2.5 my-2.5 ${
        isOwnMessage ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar (only shown for others) */}
      {!isOwnMessage && (
        <div className="w-7 h-7 rounded-full bg-[#E8DEC8] border border-[#DDD0BC] flex items-center justify-center shrink-0 overflow-hidden text-xs font-bold text-[#5C4A33] shadow-xs select-none">
          {avatarUrl && !avatarUrl.includes("placehold.co") ? (
            <img
              src={avatarUrl}
              alt={senderName}
              className="w-full h-full object-cover"
            />
          ) : (
            initial
          )}
        </div>
      )}

      {/* Message Bubble Container */}
      <div
        className={`max-w-[78%] flex flex-col ${
          isOwnMessage ? "items-end" : "items-start"
        }`}
      >
        {/* Sender name for other people's messages */}
        {!isOwnMessage && (
          <span className="text-[11px] font-semibold text-[#6E5E4C] mb-1 px-1">
            {senderName}
          </span>
        )}

        <div
          className={`rounded-2xl px-3.5 py-2 text-xs shadow-xs break-words relative leading-relaxed ${
            isOwnMessage
              ? "bg-[#C86446] text-white rounded-br-xs border border-[#B34F34]"
              : "bg-white text-[#1E2229] rounded-bl-xs border border-[#DDD3C4]"
          }`}
          style={{
            boxShadow: isOwnMessage
              ? "0 2px 6px rgba(180, 60, 30, 0.15)"
              : "0 2px 6px rgba(0, 0, 0, 0.04)",
          }}
        >
          {/* Text Content */}
          <p className="whitespace-pre-wrap">{message.content}</p>

          {/* Attachments if any */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-1.5 pt-1.5 border-t border-black/10">
              {message.attachments.map((att, idx) => {
                const isImage = att.mimetype?.startsWith("image/");
                return isImage ? (
                  <div key={idx} className="rounded-lg overflow-hidden border border-black/10 my-1">
                    <img
                      src={att.url}
                      alt="attachment"
                      className="max-h-48 max-w-full object-cover cursor-pointer hover:opacity-90 transition"
                      onClick={() => window.open(att.url, "_blank")}
                    />
                  </div>
                ) : (
                  <a
                    key={idx}
                    href={att.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center gap-2 p-1.5 rounded-lg text-[11px] font-medium transition ${
                      isOwnMessage
                        ? "bg-[#B55237] text-white hover:bg-[#A3452B]"
                        : "bg-[#F7F4EE] text-[#4E4133] hover:bg-[#EFE8DC]"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate flex-1">Attachment {idx + 1}</span>
                    <Download className="w-3 h-3 shrink-0 opacity-70" />
                  </a>
                );
              })}
            </div>
          )}

          {/* Timestamp */}
          <div
            className={`text-[9px] mt-1 text-right select-none ${
              isOwnMessage ? "text-[#FAD9D0]" : "text-[#8E7E6C]"
            }`}
          >
            {formattedTime}
          </div>
        </div>
      </div>
    </div>
  );
}
