# 问津

用 AI 提问的中文助手。基于 Next.js、Vercel AI SDK 与 AI Gateway，支持流式对话、当前时间查询和精确计算。

## 本地运行

1. 安装依赖：`npm install`
2. 复制环境变量：`cp .env.example .env.local`
3. 在 [Vercel AI Gateway](https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai&title=Go+to+AI+Gateway) 创建 API Key，写入 `.env.local` 的 `AI_GATEWAY_API_KEY`
4. 启动：`npm run dev`
5. 打开 [http://localhost:3000](http://localhost:3000)

部署到 Vercel 时可通过 OIDC 自动鉴权，不必再放提供商自己的 API Key。

## 能力

- 流式中文对话（Claude Sonnet 5，经 AI Gateway）
- `getCurrentTime`：查询任意 IANA 时区的当前时间
- `calculate`：安全计算四则运算表达式
