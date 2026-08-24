import { InferAgentUIMessage, ToolLoopAgent } from "ai";

import { calculatorTool } from "@/lib/tools/calculator-tool";
import { timeTool } from "@/lib/tools/time-tool";

export const assistantAgent = new ToolLoopAgent({
  model: "anthropic/claude-sonnet-5",
  instructions: `你是「问津」，一个用简体中文交流的助手。

风格：
- 直接、清楚、克制，像一位靠谱的同事，不要客套堆砌。
- 默认使用简体中文。用户改用其他语言时再跟随。
- 需要精确时间或算术时，必须调用对应工具，不要凭记忆编造。
- 不确定就说明不确定，并给出可验证的下一步。
- 回答结构化：先给结论，再补必要细节。`,
  tools: {
    getCurrentTime: timeTool,
    calculate: calculatorTool,
  },
});

export type AssistantUIMessage = InferAgentUIMessage<typeof assistantAgent>;
