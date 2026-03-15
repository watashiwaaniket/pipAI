import {
  selectDownloadState,
  selectModelMeta,
  useModelStore,
} from "@/stores/modelStore";

export function useModel(modelId: string) {
  const model = useModelStore((s) => s.models.find((m) => m.id === modelId));
  const downloadState = useModelStore(selectDownloadState(modelId));
  const isLoaded = useModelStore((s) => s.loadedModelId === modelId);
  const meta = useModelStore(selectModelMeta(modelId));

  return { model, downloadState, isLoaded, meta };
}
