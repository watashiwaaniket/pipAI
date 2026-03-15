/**
 * appStore.ts
 * PIP-AI — Global application state store
 *
 * Handles: onboarding flow, active model tracking,
 * app-wide settings, and boot state.
 *
 * Uses Zustand with AsyncStorage persistence via
 * the middleware pattern — state survives app kills.
 */

import { SURVIVAL_SYSTEM_PROMPT } from "@/constants/systemPrompt";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ModelTier = "light" | "heavy";

export type AppStatus =
  | "booting"
  | "onboarding"
  | "downloading"
  | "ready"
  | "error";

export interface AppSettings {
  typewriterSpeed: number;
  scanlineEnabled: boolean;
  streamingEnabled: boolean;
  systemPrompt: string;
  maxContextTokens: number;
}

export interface AppState {
  status: AppStatus;
  onboardingComplete: boolean;
  selectedTier: ModelTier | null;
  activeModelId: string | null;
  settings: AppSettings;
  bootAnimationPlayed: boolean;
  setStatus: (status: AppStatus) => void;
  completeOnboarding: (tier: ModelTier, modelId: string) => void;
  setActiveModel: (modelId: string) => void;
  updateSettings: (patch: Partial<AppSettings>) => void;
  resetSettings: () => void;
  markBootPlayed: () => void;
  reset: () => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  typewriterSpeed: 18,
  scanlineEnabled: true,
  streamingEnabled: true,
  systemPrompt: SURVIVAL_SYSTEM_PROMPT,
  maxContextTokens: 3800,
};

const DEFAULT_STATE = {
  status: "booting" as AppStatus,
  onboardingComplete: false,
  selectedTier: null as ModelTier | null,
  activeModelId: null as string | null,
  settings: DEFAULT_SETTINGS,
  bootAnimationPlayed: false,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, _get) => ({
      ...DEFAULT_STATE,

      setStatus: (status) => set({ status }),

      completeOnboarding: (tier, modelId) =>
        set({
          onboardingComplete: true,
          selectedTier: tier,
          activeModelId: modelId,
          status: "ready",
        }),

      setActiveModel: (modelId) => set({ activeModelId: modelId }),

      updateSettings: (patch) =>
        set((state) => ({
          settings: { ...state.settings, ...patch },
        })),

      resetSettings: () =>
        set((state) => ({
          settings: {
            ...DEFAULT_SETTINGS,
            systemPrompt: state.settings.systemPrompt,
          },
        })),

      markBootPlayed: () => set({ bootAnimationPlayed: true }),

      reset: () =>
        set({
          ...DEFAULT_STATE,
          bootAnimationPlayed: true,
          status: "onboarding",
        }),
    }),

    {
      name: "pip-ai-app-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        onboardingComplete: state.onboardingComplete,
        selectedTier: state.selectedTier,
        activeModelId: state.activeModelId,
        settings: state.settings,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        if (!state.onboardingComplete) {
          state.status = "onboarding";
        } else if (!state.activeModelId) {
          // edge case: onboarding marked done but no model set
          state.status = "onboarding";
        } else {
          state.status = "ready";
        }
      },
    },
  ),
);
export const selectIsReady = (s: AppState) => s.status === "ready";

export const selectNeedsOnboarding = (s: AppState) =>
  !s.onboardingComplete || !s.activeModelId;

export const selectTypewriterSpeed = (s: AppState) =>
  s.settings.typewriterSpeed;

export const selectScanlineEnabled = (s: AppState) =>
  s.settings.scanlineEnabled;

export const selectSystemPrompt = (s: AppState) => s.settings.systemPrompt;
export const selectMaxContextTokens = (s: AppState) =>
  s.settings.maxContextTokens;
