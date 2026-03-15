import { nanoid } from "nanoid/non-secure";
import { create } from "zustand";
import { llamaService } from "../services/llama.service";
import { storageService } from "../services/storage.service";
import { Chat, Message } from "../types";

interface ChatStore {
  chats: Chat[];
  activeChatId: string | null;
  isGenerating: boolean;

  loadChats: () => Promise<void>;
  createChat: (modelId: string) => Chat;
  deleteChat: (id: string) => Promise<void>;
  setActiveChat: (id: string) => void;

  sendMessage: (
    chatId: string,
    content: string,
    modelFamily: string,
  ) => Promise<void>;
  getChat: (id: string) => Chat | undefined;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  activeChatId: null,
  isGenerating: false,

  loadChats: async () => {
    const chats = await storageService.getAllChats();
    set({ chats });
  },

  createChat: (modelId) => {
    const chat: Chat = {
      id: nanoid(),
      title: "New Chat",
      modelId,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    set((s) => ({ chats: [chat, ...s.chats] }));
    storageService.saveChat(chat);
    return chat;
  },

  deleteChat: async (id) => {
    set((s) => ({ chats: s.chats.filter((c) => c.id !== id) }));
    await storageService.deleteChat(id);
  },

  setActiveChat: (id) => set({ activeChatId: id }),

  getChat: (id) => get().chats.find((c) => c.id === id),

  sendMessage: async (chatId, content, modelFamily) => {
    const userMsg: Message = {
      id: nanoid(),
      role: "user",
      content,
      createdAt: Date.now(),
    };

    // placeholder for streaming assistant response
    const assistantMsg: Message = {
      id: nanoid(),
      role: "assistant",
      content: "",
      createdAt: Date.now(),
      isGenerating: true,
    };

    // add user message + empty assistant bubble
    set((s) => ({
      chats: s.chats.map((c) =>
        c.id === chatId
          ? {
              ...c,
              messages: [...c.messages, userMsg, assistantMsg],
              updatedAt: Date.now(),
            }
          : c,
      ),
      isGenerating: true,
    }));

    const chat = get().getChat(chatId)!;
    // pass full message history for context — this is what keeps the AI "aware" of the conversation
    const contextMessages = [...chat.messages.slice(0, -1)]; // exclude empty assistant placeholder

    let fullResponse = "";

    // stream tokens into the assistant bubble in real time
    await llamaService.generateStream(contextMessages, modelFamily, (token) => {
      fullResponse += token;
      set((s) => ({
        chats: s.chats.map((c) =>
          c.id === chatId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === assistantMsg.id
                    ? { ...m, content: fullResponse }
                    : m,
                ),
              }
            : c,
        ),
      }));
    });

    // mark generation done + persist
    const finalChat = get().getChat(chatId)!;
    const updatedChat: Chat = {
      ...finalChat,
      title:
        finalChat.title === "New Chat"
          ? content.slice(0, 40) // use first user message as title
          : finalChat.title,
      messages: finalChat.messages.map((m) =>
        m.id === assistantMsg.id
          ? { ...m, content: fullResponse, isGenerating: false }
          : m,
      ),
    };

    set((s) => ({
      chats: s.chats.map((c) => (c.id === chatId ? updatedChat : c)),
      isGenerating: false,
    }));

    await storageService.saveChat(updatedChat);
  },
}));
