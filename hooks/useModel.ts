import { useCallback } from "react";
import { EMPTY_META, useModelStore } from "@/stores/modelStore";

export function useModel(modelId: string) {
  const model = useModelStore(useCallback((s) => s.models.find((m) => m.id === modelId), [modelId]));
  const downloadState = useModelStore(useCallback((s) => s.downloads[modelId] ?? null, [modelId]));
  const isLoaded = useModelStore(useCallback((s) => s.loadedModelId === modelId, [modelId]));
  const meta = useModelStore(useCallback((s) => s.meta[modelId] ?? EMPTY_META, [modelId]));

  return { model, downloadState, isLoaded, meta };
}
