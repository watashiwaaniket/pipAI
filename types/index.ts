export type Role = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
  // for streaming — track if generation is done
  isGenerating?: boolean;
}

export interface Chat {
  id: string;
  title: string; // auto-generated from first message
  modelId: string; // which model was used
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  systemPrompt?: string; // per-chat system prompt
}

export interface ModelConfig {
  id: string;
  name: string; // "Gemma 2B"
  filename: string; // "gemma-2b-it-q4_k_m.gguf"
  url: string; // download URL (HuggingFace, etc.)
  sizeBytes: number;
  contextLength: number; // e.g. 4096
  params: string; // "2B"
  family: string; // "gemma" | "llama" | etc.
  localPath?: string; // set after download
  tier: "light" | "heavy";
  isDownloaded: boolean;
}

export type DownloadStatus =
  | "idle"
  | "downloading"
  | "paused"
  | "done"
  | "error";

export interface DownloadState {
  modelId: string;
  progress: number; // 0–1
  status: DownloadStatus;
  bytesWritten: number;
}
