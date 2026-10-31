
import { api } from "./api-client";
import { Conversation, ChatMessage, ChatMessagesResponse } from "@/types/api";

export const chatApi = {
  /**
   * Fetch the default group conversation for a project
   */
  getProjectDefaultChat: async (projectId: string): Promise<Conversation> => {
    return api.get<Conversation>(`/chat/project/${projectId}`);
  },

  /**
   * Fetch paginated message history for a conversation
   */
  getConversationMessages: async (
    conversationId: string,
    page = 1,
    limit = 50,
  ): Promise<ChatMessagesResponse> => {
    return api.get<ChatMessagesResponse>(
      `/chat/${conversationId}/messages?page=${page}&limit=${limit}`,
    );
  },

  /**
   * Send a message to a conversation (supports optional file attachments)
   */
  sendChatMessage: async (
    conversationId: string,
    content: string,
    attachments?: File[],
  ): Promise<ChatMessage> => {
    if (attachments && attachments.length > 0) {
      const formData = new FormData();
      formData.append("content", content);
      attachments.forEach((file) => {
        formData.append("attachments", file);
      });
      return api.upload<ChatMessage>(`/chat/${conversationId}/messages`, formData);
    }

    return api.post<ChatMessage>(`/chat/${conversationId}/messages`, { content });
  },
};
