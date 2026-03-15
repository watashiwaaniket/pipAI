import { ModelConfig } from "@/types";

// src/constants/models.ts
export const MODEL_TIERS = {
  light: { modelId: "llama-3.2-1b-q4", label: "LIGHT UNIT" },
  heavy: { modelId: "gemma-2b-it-q4", label: "HEAVY UNIT" },
};

export const AVAILABLE_MODELS: ModelConfig[] = [
  {
    id: "llama-3.2-1b-q4",
    name: "Llama 3.2 1B",
    filename: "Llama-3.2-1B-Instruct-Q4_K_M.gguf",
    url: "https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF/resolve/main/Llama-3.2-1B-Instruct-Q4_K_M.gguf",
    sizeBytes: 800_000_000,
    contextLength: 4096,
    params: "1B",
    family: "llama",
    tier: "light",
    isDownloaded: false,
  },
  {
    id: "gemma-2b-it-q4",
    name: "Gemma 2B Instruct",
    filename: "gemma-2b-it-q4_k_m.gguf",
    url: "https://huggingface.co/google/gemma-2b-it-GGUF/resolve/main/gemma-2b-it-q4_k_m.gguf",
    sizeBytes: 1_500_000_000,
    contextLength: 8192,
    params: "2B",
    family: "gemma",
    tier: "heavy",
    isDownloaded: false,
  },
];
