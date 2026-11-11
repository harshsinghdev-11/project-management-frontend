import { api } from "./api-client";
import { AgentMessagesResponse, AgentRunResponseData } from "@/types/api";

/**
 * Run a natural-language agent query via the Node.js agent proxy (POST /api/v1/agent/run).
 *
 * The Node server verifies the user's JWT, forwards it to the FastAPI agent worker,
 * and returns the final answer with tool execution data in an ApiResponse envelope.
 */
export async function runAgent(query: string): Promise<AgentRunResponseData> {
  return api.post<AgentRunResponseData>("/agent/run", { query });
}

/** Load the signed-in user's persisted Camp Agent turns. */
export async function getAgentMessages(): Promise<AgentMessagesResponse> {
  return api.get<AgentMessagesResponse>("/agent/messages");
}

/** Delete the signed-in user's persisted Camp Agent turns. */
export async function clearAgentMessages(): Promise<AgentMessagesResponse> {
  return api.delete<AgentMessagesResponse>("/agent/messages");
}

export const agentApi = {
  run: runAgent,
  list: getAgentMessages,
  clear: clearAgentMessages,
};

