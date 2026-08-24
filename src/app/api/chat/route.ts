import { createAgentUIStreamResponse } from "ai";

import { assistantAgent } from "@/lib/agents/assistant";

export async function POST(request: Request) {
  const { messages } = await request.json();

  return createAgentUIStreamResponse({
    agent: assistantAgent,
    uiMessages: messages,
    abortSignal: request.signal,
  });
}
