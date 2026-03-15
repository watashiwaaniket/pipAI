import { AVAILABLE_MODELS } from "@/constants/models";
import { useChatStore } from "@/stores/chatStore";
import { useAppStore } from "@/stores/appStore";

export function useChat(chatId: string) {
  const chat = useChatStore((s) => s.chats.find((c) => c.id === chatId));
  const isGenerating = useChatStore((s) => s.isGenerating);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const activeModelId = useAppStore((s) => s.activeModelId);
  const activeModel = activeModelId
    ? AVAILABLE_MODELS.find((m) => m.id === activeModelId) ?? null
    : null;

  return { chat, isGenerating, sendMessage, activeModel };
}
