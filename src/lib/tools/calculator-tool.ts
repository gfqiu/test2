import { tool } from "ai";
import { z } from "zod";

const SAFE_EXPRESSION = /^[\d+\-*/().\s]+$/;

export const calculatorTool = tool({
  description:
    "计算数学表达式。仅支持数字与 + - * / 括号。用户要求精确计算时使用，不要心算。",
  inputSchema: z.object({
    expression: z.string().describe("要计算的表达式，例如 (128 + 64) * 3.5"),
  }),
  execute: async ({ expression }) => {
    const trimmed = expression.trim();

    if (!trimmed) {
      return { error: "表达式为空" };
    }

    if (!SAFE_EXPRESSION.test(trimmed)) {
      return { error: "只支持数字和 + - * / ( ) 运算符" };
    }

    try {
      const value = Function(`"use strict"; return (${trimmed})`)() as unknown;

      if (typeof value !== "number" || !Number.isFinite(value)) {
        return { error: "无法得到有效数值" };
      }

      return { expression: trimmed, value };
    } catch {
      return { error: "表达式无效" };
    }
  },
});
