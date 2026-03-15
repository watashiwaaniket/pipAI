import AsyncStorage from "@react-native-async-storage/async-storage";
import { Chat } from "../types";

const KEYS = {
  CHATS: "chats",
  MODELS: "models_state",
  ACTIVE_MODEL: "active_model_id",
};

export const storageService = {
  // Chats
  async getAllChats(): Promise<Chat[]> {
    const raw = await AsyncStorage.getItem(KEYS.CHATS);
    return raw ? JSON.parse(raw) : [];
  },

  async saveChat(chat: Chat): Promise<void> {
    const chats = await this.getAllChats();
    const idx = chats.findIndex((c) => c.id === chat.id);
    if (idx >= 0) chats[idx] = chat;
    else chats.unshift(chat); // newest first
    await AsyncStorage.setItem(KEYS.CHATS, JSON.stringify(chats));
  },

  async deleteChat(chatId: string): Promise<void> {
    const chats = await this.getAllChats();
    await AsyncStorage.setItem(
      KEYS.CHATS,
      JSON.stringify(chats.filter((c) => c.id !== chatId)),
    );
  },

  // Models
  async getModelStates(): Promise<
    Record<string, { isDownloaded: boolean; localPath?: string }>
  > {
    const raw = await AsyncStorage.getItem(KEYS.MODELS);
    return raw ? JSON.parse(raw) : {};
  },

  async updateModelState(
    modelId: string,
    patch: { isDownloaded: boolean; localPath?: string },
  ) {
    const states = await this.getModelStates();
    states[modelId] = patch;
    await AsyncStorage.setItem(KEYS.MODELS, JSON.stringify(states));
  },

  async getActiveModelId(): Promise<string | null> {
    return AsyncStorage.getItem(KEYS.ACTIVE_MODEL);
  },

  async setActiveModelId(id: string) {
    return AsyncStorage.setItem(KEYS.ACTIVE_MODEL, id);
  },
};
