import * as FileSystem from "expo-file-system";
import { DownloadState, ModelConfig } from "../types";
import { storageService } from "./storage.service";

const MODEL_DIR = `${(FileSystem as any).documentDirectory}models/`;

export const downloadService = {
  async ensureDir() {
    const info = await FileSystem.getInfoAsync(MODEL_DIR);
    if (!info.exists)
      await FileSystem.makeDirectoryAsync(MODEL_DIR, { intermediates: true });
  },

  getModelPath(filename: string) {
    return `${MODEL_DIR}${filename}`;
  },

  async downloadModel(
    model: ModelConfig,
    onProgress: (state: DownloadState) => void,
  ): Promise<string> {
    await this.ensureDir();
    const destPath = this.getModelPath(model.filename);

    const callback = FileSystem.createDownloadResumable(
      model.url,
      destPath,
      {},
      ({ totalBytesWritten, totalBytesExpectedToWrite }) => {
        onProgress({
          modelId: model.id,
          progress: totalBytesWritten / totalBytesExpectedToWrite,
          status: "downloading",
          bytesWritten: totalBytesWritten,
        });
      },
    );

    await callback.downloadAsync();

    await storageService.updateModelState(model.id, {
      isDownloaded: true,
      localPath: destPath,
    });

    return destPath;
  },

  async deleteModel(model: ModelConfig) {
    const path = this.getModelPath(model.filename);
    const info = await FileSystem.getInfoAsync(path);
    if (info.exists) await FileSystem.deleteAsync(path);
    await storageService.updateModelState(model.id, { isDownloaded: false });
  },
};
