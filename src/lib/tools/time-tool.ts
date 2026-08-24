import { tool } from "ai";
import { z } from "zod";

export const timeTool = tool({
  description:
    "获取指定时区的当前日期与时间。用户询问现在几点、今天日期、某城市当地时间时使用。",
  inputSchema: z.object({
    timeZone: z
      .string()
      .optional()
      .describe("IANA 时区，例如 Asia/Shanghai、America/New_York。默认 Asia/Shanghai"),
  }),
  execute: async ({ timeZone }) => {
    const zone = timeZone || "Asia/Shanghai";
    const now = new Date();

    try {
      const local = new Intl.DateTimeFormat("zh-CN", {
        timeZone: zone,
        dateStyle: "full",
        timeStyle: "long",
      }).format(now);

      return {
        iso: now.toISOString(),
        local,
        timeZone: zone,
      };
    } catch {
      return {
        error: `无法识别时区：${zone}`,
        iso: now.toISOString(),
        timeZone: zone,
      };
    }
  },
});
