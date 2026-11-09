import { api } from "./api-client";
import { AgentRunResponseData } from "@/types/api";

/**
 * Run a natural-language agent query via the Node.js agent proxy (POST /api/v1/agent/run).
 *
 * The Node server verifies the user's JWT, forwards it to the FastAPI agent worker,
 * and returns the final answer with tool execution data in an ApiResponse envelope.
 *
 * @param query The natural language prompt/command from the user.
 * @returns Promise resolving to { answer: string, messages?: unknown[] }
 */
export async function runAgent(query: string): Promise<AgentRunResponseData> {
  return api.post<AgentRunResponseData>("/agent/run", { query });
}

export const agentApi = {
  run: runAgent,
};

