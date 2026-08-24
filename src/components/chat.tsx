"use client";

import { useChat } from "@ai-sdk/react";
import { CompassIcon, SparklesIcon } from "lucide-react";
import { useCallback } from "react";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import type { AssistantUIMessage } from "@/lib/agents/assistant";

const SUGGESTIONS = [
  "用三句话解释量子纠缠",
  "帮我写一封礼貌的请假邮件",
  "现在北京几点？",
  "计算 (128 + 64) × 3.5",
];

const TOOL_TITLES: Record<string, string> = {
  getCurrentTime: "当前时间",
  calculate: "精确计算",
};

export function Chat() {
  const { messages, sendMessage, status, error, stop } =
    useChat<AssistantUIMessage>();

  const busy = status === "submitted" || status === "streaming";

  const submitText = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || busy) {
        return;
      }
      void sendMessage({ text: trimmed });
    },
    [busy, sendMessage]
  );

  const handleSubmit = useCallback(
    (message: PromptInputMessage) => {
      submitText(message.text);
    },
    [submitText]
  );

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      <div className="paper-grain pointer-events-none absolute inset-0" />

      <header className="relative z-10 flex items-center justify-between gap-3 border-b border-border/70 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
            <CompassIcon className="size-4" />
          </div>
          <div>
            <p className="font-heading text-base font-semibold tracking-wide">
              问津
            </p>
            <p className="text-muted-foreground text-xs">
              一问即可，直抵要津
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Claude Sonnet 5</Badge>
          <ThemeToggle />
        </div>
      </header>

      <Conversation className="relative z-10 min-h-0 flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl gap-6 px-4 py-8 sm:px-6">
          {messages.length === 0 ? (
            <ConversationEmptyState
              className="min-h-[48vh]"
              description="问一句，我来帮你理清思路、写草稿，或查现在几点。"
              icon={<SparklesIcon className="size-8 text-primary" />}
              title="从一件具体的事问起"
            />
          ) : (
            messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  {message.parts.map((part, index) => {
                    if (part.type === "text") {
                      return (
                        <MessageResponse
                          isAnimating={
                            busy &&
                            message.role === "assistant" &&
                            index === message.parts.length - 1
                          }
                          key={`${message.id}-${index}`}
                        >
                          {part.text}
                        </MessageResponse>
                      );
                    }

                    if (part.type === "tool-getCurrentTime") {
                      return (
                        <Tool defaultOpen={part.state === "output-error"} key={`${message.id}-${index}`}>
                          <ToolHeader
                            state={part.state}
                            title={TOOL_TITLES.getCurrentTime}
                            type={part.type}
                          />
                          <ToolContent>
                            {(part.state === "input-available" ||
                              part.state === "output-available") && (
                              <ToolInput input={part.input} />
                            )}
                            {part.state === "output-available" && (
                              <ToolOutput
                                errorText={undefined}
                                output={part.output}
                              />
                            )}
                            {part.state === "output-error" && (
                              <ToolOutput
                                errorText={part.errorText}
                                output={undefined}
                              />
                            )}
                          </ToolContent>
                        </Tool>
                      );
                    }

                    if (part.type === "tool-calculate") {
                      return (
                        <Tool defaultOpen={part.state === "output-error"} key={`${message.id}-${index}`}>
                          <ToolHeader
                            state={part.state}
                            title={TOOL_TITLES.calculate}
                            type={part.type}
                          />
                          <ToolContent>
                            {(part.state === "input-available" ||
                              part.state === "output-available") && (
                              <ToolInput input={part.input} />
                            )}
                            {part.state === "output-available" && (
                              <ToolOutput
                                errorText={undefined}
                                output={part.output}
                              />
                            )}
                            {part.state === "output-error" && (
                              <ToolOutput
                                errorText={part.errorText}
                                output={undefined}
                              />
                            )}
                          </ToolContent>
                        </Tool>
                      );
                    }

                    return null;
                  })}
                </MessageContent>
              </Message>
            ))
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="relative z-10 mx-auto w-full max-w-3xl px-4 pb-6 sm:px-6">
        {error ? (
          <p className="mb-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-destructive text-sm">
            {error.message}
          </p>
        ) : null}

        {messages.length === 0 ? (
          <Suggestions className="mb-3 px-1">
            {SUGGESTIONS.map((item) => (
              <Suggestion
                key={item}
                onClick={submitText}
                suggestion={item}
              />
            ))}
          </Suggestions>
        ) : null}

        <PromptInput onSubmit={handleSubmit}>
          <PromptInputBody>
            <PromptInputTextarea
              disabled={busy}
              placeholder="问一件具体的事…"
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <span className="text-muted-foreground text-xs">
                Enter 发送 · Shift+Enter 换行
              </span>
            </PromptInputTools>
            <PromptInputSubmit onStop={stop} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
