import { createAgentUIStreamResponse } from "ai";

import { assistantAgent } from "@/lib/agents/assistant";

function toClientError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  if (
    message.includes("AI_GATEWAY_API_KEY") ||
    message.includes("Unauthenticated") ||
    message.includes("GatewayAuthentication")
  ) {
    return "尚未配置 AI Gateway。请在项目根目录创建 .env.local，写入 AI_GATEWAY_API_KEY 后重启。";
  }

  return "模型暂时无法回答，请稍后重试。";
}

export async function POST(request: Request) {
  const { messages } = await request.json();

  return createAgentUIStreamResponse({
    agent: assistantAgent,
    uiMessages: messages,
    abortSignal: request.signal,
    onError: toClientError,
  });
}
