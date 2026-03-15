/**
 * modelStore.ts
 * PIP-AI — Model lifecycle management store
 *
 * Handles: download state, local file tracking,
 * model activation, deletion, and storage accounting.
 *
 * Coordinates between:
 *   - AVAILABLE_MODELS registry  (what exists)
 *   - AsyncStorage               (what's downloaded + paths)
 *   - expo-file-system           (actual .gguf files on disk)
 *   - llamaService               (inference context in RAM)
 *   - appStore.setActiveModel    (cross-store sync)
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { AVAILABLE_MODELS } from "../constants/models";
import { llamaService } from "../services/llama.service";
import type { DownloadState, DownloadStatus, ModelConfig } from "../types";
import { useAppStore } from "./appStore";

const MODEL_DIR = `${FileSystem.documentDirectory}models/`;
const STORE_KEY = "pip-ai-model-store";

export interface PersistedModelMeta {
  isDownloaded: boolean;
  localPath: string | null;
  downloadedAt: number | null;
  bytesOnDisk: number;
}

export type DownloadMap = Record<string, DownloadState>;

type ResumableMap = Record<string, FileSystem.DownloadResumable>;

export interface ModelStore {
  models: ModelConfig[];
  meta: Record<string, PersistedModelMeta>;
  downloads: DownloadMap;
  loadedModelId: string | null;
  isLoadingModel: boolean;
  lastError: string | null;

  initialize: () => Promise<void>;
  startDownload: (modelId: string) => Promise<void>;
  pauseDownload: (modelId: string) => Promise<void>;
  cancelDownload: (modelId: string) => Promise<void>;
  activateModel: (modelId: string) => Promise<void>;
  deleteModel: (modelId: string) => Promise<void>;
  verifyDownloads: () => Promise<void>;
  getTotalStorageUsed: () => number;
  clearError: () => void;
}

function modelPath(filename: string): string {
  return `${MODEL_DIR}${filename}`;
}

async function ensureModelDir(): Promise<void> {
  const info = await FileSystem.getInfoAsync(MODEL_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(MODEL_DIR, { intermediates: true });
  }
}

export const EMPTY_META: PersistedModelMeta = {
  isDownloaded: false,
  localPath: null,
  downloadedAt: null,
  bytesOnDisk: 0,
};

function emptyMeta(): PersistedModelMeta {
  return EMPTY_META;
}

function buildModels(meta: Record<string, PersistedModelMeta>): ModelConfig[] {
  return AVAILABLE_MODELS.map((m) => ({
    ...m,
    isDownloaded: meta[m.id]?.isDownloaded ?? false,
    localPath: meta[m.id]?.localPath ?? undefined,
  }));
}

function _withoutKey<T extends Record<string, unknown>>(
  obj: T,
  key: string,
): T {
  const next = { ...obj };
  delete next[key];
  return next;
}

const _resumables: ResumableMap = {};

export const useModelStore = create<ModelStore>()(
  persist(
    (set, get) => ({
      models: buildModels({}),
      meta: {},
      downloads: {},
      loadedModelId: null,
      isLoadingModel: false,
      lastError: null,

      initialize: async () => {
        await ensureModelDir();

        const { meta } = get();
        const repairedMeta: Record<string, PersistedModelMeta> = { ...meta };

        await Promise.all(
          AVAILABLE_MODELS.map(async (model) => {
            const m = repairedMeta[model.id];
            if (!m?.isDownloaded || !m.localPath) return;

            const info = await FileSystem.getInfoAsync(m.localPath);
            if (!info.exists) {
              repairedMeta[model.id] = emptyMeta();
            } else {
              repairedMeta[model.id] = {
                ...m,
                bytesOnDisk: info.size ?? m.bytesOnDisk,
              };
            }
          }),
        );

        set({
          meta: repairedMeta,
          models: buildModels(repairedMeta),
        });
      },

      startDownload: async (modelId) => {
        const { downloads, meta } = get();

        if (downloads[modelId]?.status === "downloading") return;

        const model = AVAILABLE_MODELS.find((m) => m.id === modelId);
        if (!model) {
          set({ lastError: `Unknown model: ${modelId}` });
          return;
        }

        if (meta[modelId]?.isDownloaded) return;

        await ensureModelDir();
        const dest = modelPath(model.filename);
        const existingBytes = meta[modelId]?.bytesOnDisk ?? 0;

        set((s) => ({
          downloads: {
            ...s.downloads,
            [modelId]: {
              modelId,
              progress: existingBytes / model.sizeBytes,
              status: "downloading" as DownloadStatus,
              bytesWritten: existingBytes,
            },
          },
        }));

        const onProgress = (
          totalBytesWritten: number,
          totalBytesExpectedToWrite: number,
        ) => {
          const expected =
            totalBytesExpectedToWrite > 0
              ? totalBytesExpectedToWrite
              : model.sizeBytes;

          set((s) => ({
            downloads: {
              ...s.downloads,
              [modelId]: {
                modelId,
                progress: totalBytesWritten / expected,
                status: "downloading" as DownloadStatus,
                bytesWritten: totalBytesWritten,
              },
            },
            meta: {
              ...s.meta,
              [modelId]: {
                ...(s.meta[modelId] ?? emptyMeta()),
                bytesOnDisk: totalBytesWritten,
              },
            },
          }));
        };

        try {
          const fileInfo = await FileSystem.getInfoAsync(dest);
          const hasPartial = fileInfo.exists && existingBytes > 0;

          let resumable: FileSystem.DownloadResumable;

          if (hasPartial && _resumables[modelId]) {
            resumable = _resumables[modelId];
          } else {
            resumable = FileSystem.createDownloadResumable(
              model.url,
              dest,
              {},
              ({ totalBytesWritten, totalBytesExpectedToWrite }) =>
                onProgress(totalBytesWritten, totalBytesExpectedToWrite),
            );
          }

          _resumables[modelId] = resumable;

          const result = await resumable.downloadAsync();

          if (!result?.uri) {
            throw new Error(
              "Download returned no URI — may have been cancelled.",
            );
          }

          const finalInfo = await FileSystem.getInfoAsync(dest);
          if (!finalInfo.exists) {
            throw new Error("File not found after download completed.");
          }

          const nowMs = Date.now();
          set((s) => {
            const updatedMeta: Record<string, PersistedModelMeta> = {
              ...s.meta,
              [modelId]: {
                isDownloaded: true,
                localPath: dest,
                downloadedAt: nowMs,
                bytesOnDisk: finalInfo.size ?? model.sizeBytes,
              },
            };
            return {
              meta: updatedMeta,
              models: buildModels(updatedMeta),
              downloads: _withoutKey(s.downloads, modelId),
            };
          });

          delete _resumables[modelId];

          const { activeModelId } = useAppStore.getState();
          if (!activeModelId) {
            await get().activateModel(modelId);
          }
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : "Download failed";

          const current = get().downloads[modelId];
          if (current?.status !== "paused") {
            set((s) => ({
              downloads: {
                ...s.downloads,
                [modelId]: {
                  ...s.downloads[modelId],
                  status: "error" as DownloadStatus,
                },
              },
              lastError: `[${model.name}] ${message}`,
            }));
          }
        }
      },

      pauseDownload: async (modelId) => {
        const resumable = _resumables[modelId];
        if (!resumable) return;

        try {
          await resumable.pauseAsync();
          set((s) => ({
            downloads: {
              ...s.downloads,
              [modelId]: {
                ...s.downloads[modelId],
                status: "paused" as DownloadStatus,
              },
            },
          }));
        } catch {
          // intentionally silent
        }
      },

      cancelDownload: async (modelId) => {
        const resumable = _resumables[modelId];
        if (resumable) {
          try {
            await resumable.cancelAsync();
          } catch {
            // intentionally silent
          }
          delete _resumables[modelId];
        }

        const model = AVAILABLE_MODELS.find((m) => m.id === modelId);
        if (model) {
          const dest = modelPath(model.filename);
          const info = await FileSystem.getInfoAsync(dest);
          if (info.exists) {
            await FileSystem.deleteAsync(dest, { idempotent: true });
          }
        }

        set((s) => ({
          downloads: _withoutKey(s.downloads, modelId),
          meta: {
            ...s.meta,
            [modelId]: emptyMeta(),
          },
          models: buildModels({
            ...s.meta,
            [modelId]: emptyMeta(),
          }),
        }));
      },

      activateModel: async (modelId) => {
        const { meta } = get();
        const modelMeta = meta[modelId];

        if (!modelMeta?.isDownloaded || !modelMeta.localPath) {
          set({
            lastError: `Cannot activate — model not downloaded: ${modelId}`,
          });
          return;
        }

        if (get().loadedModelId === modelId) {
          useAppStore.getState().setActiveModel(modelId);
          return;
        }

        set({ isLoadingModel: true, lastError: null });

        try {
          await llamaService.loadModel(modelId, modelMeta.localPath);
          set({ loadedModelId: modelId, isLoadingModel: false });
          useAppStore.getState().setActiveModel(modelId);
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : "Failed to load model";
          set({
            isLoadingModel: false,
            lastError: `[${modelId}] ${message}`,
          });
        }
      },

      deleteModel: async (modelId) => {
        const { loadedModelId, meta } = get();

        if (loadedModelId === modelId) {
          set({
            lastError:
              "Cannot delete the active model. Switch to another model first.",
          });
          return;
        }

        const modelMeta = meta[modelId];
        if (modelMeta?.localPath) {
          const info = await FileSystem.getInfoAsync(modelMeta.localPath);
          if (info.exists) {
            await FileSystem.deleteAsync(modelMeta.localPath, {
              idempotent: true,
            });
          }
        }

        set((s) => {
          const updatedMeta = { ...s.meta, [modelId]: emptyMeta() };
          return {
            meta: updatedMeta,
            models: buildModels(updatedMeta),
          };
        });

        const { activeModelId } = useAppStore.getState();
        if (activeModelId === modelId) {
          useAppStore.getState().setActiveModel("");
        }
      },

      verifyDownloads: async () => {
        const { meta } = get();
        const repairedMeta = { ...meta };
        let changed = false;

        await Promise.all(
          Object.entries(repairedMeta).map(async ([id, m]) => {
            if (!m.isDownloaded || !m.localPath) return;
            const info = await FileSystem.getInfoAsync(m.localPath);
            if (!info.exists) {
              repairedMeta[id] = emptyMeta();
              changed = true;
            }
          }),
        );

        if (changed) {
          set({ meta: repairedMeta, models: buildModels(repairedMeta) });
        }
      },

      getTotalStorageUsed: () => {
        return Object.values(get().meta).reduce(
          (sum, m) => sum + (m.bytesOnDisk ?? 0),
          0,
        );
      },

      clearError: () => set({ lastError: null }),
    }),

    {
      name: STORE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        meta: state.meta,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.models = buildModels(state.meta);
      },
    },
  ),
);

export const selectAllModels = (s: ModelStore) => s.models;

export const selectDownloadedModels = (s: ModelStore) =>
  s.models.filter((m) => m.isDownloaded);

export const selectDownloadState = (modelId: string) => (s: ModelStore) =>
  s.downloads[modelId] ?? null;

export const selectIsAnyDownloading = (s: ModelStore) =>
  Object.values(s.downloads).some((d) => d.status === "downloading");

export const selectStorageUsedLabel = (s: ModelStore) => {
  const bytes = Object.values(s.meta).reduce(
    (sum, m) => sum + (m.bytesOnDisk ?? 0),
    0,
  );
  if (bytes === 0) return "0 MB";
  if (bytes < 1_000_000_000) return `${(bytes / 1e6).toFixed(0)} MB`;
  return `${(bytes / 1e9).toFixed(2)} GB`;
};

export const selectLoadedModel = (s: ModelStore) =>
  s.models.find((m) => m.id === s.loadedModelId) ?? null;

export const selectModelMeta = (modelId: string) => (s: ModelStore) =>
  s.meta[modelId] ?? EMPTY_META;
