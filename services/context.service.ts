import { Message } from "../types";

// rough token estimate: ~4 chars per token
const estimateTokens = (text: string) => Math.ceil(text.length / 4);

export function trimToContextWindow(
  messages: Message[],
  maxTokens: number,
  systemPrompt?: string,
): Message[] {
  const systemOverhead = systemPrompt ? estimateTokens(systemPrompt) + 10 : 0;
  const budget = maxTokens - systemOverhead - 200;

  let total = 0;
  const kept: Message[] = [];

  for (let i = messages.length - 1; i >= 0; i--) {
    const tokens = estimateTokens(messages[i].content);
    if (total + tokens > budget) break;
    kept.unshift(messages[i]);
    total += tokens;
  }

  return kept;
}
