import { Message } from "@/types";
import { initLlama, LlamaContext } from "llama.rn";

class LlamaService {
  private context: LlamaContext | null = null;
  private loadedModelId: string | null = null;

  async loadModel(modelId: string, modelPath: string): Promise<void> {
    // avoid reloading if same model is already in memory
    if (this.loadedModelId === modelId && this.context) return;

    // release previous context to free memory
    if (this.context) {
      await this.context.release();
      this.context = null;
    }

    this.context = await initLlama({
      model: modelPath,
      use_mlock: true, // lock model in RAM, prevent swapping
      n_ctx: 4096, // context window size
      n_threads: 4, // tune based on device
      n_gpu_layers: 0, // 0 = CPU only; increase if device has GPU support
    });

    this.loadedModelId = modelId;
  }

  // Converts your Message[] to the prompt format the model expects
  private formatPrompt(messages: Message[], modelFamily: string): string {
    // each model family has its own chat template
    if (modelFamily === "gemma") {
      return (
        messages
          .map((m) =>
            m.role === "user"
              ? `<start_of_turn>user\n${m.content}<end_of_turn>`
              : `<start_of_turn>model\n${m.content}<end_of_turn>`,
          )
          .join("\n") + "\n<start_of_turn>model\n"
      );
    }

    if (modelFamily === "llama") {
      const system = messages.find((m) => m.role === "system");
      const convo = messages.filter((m) => m.role !== "system");
      const sysBlock = system
        ? `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n${system.content}<|eot_id|>`
        : "<|begin_of_text|>";
      const turns = convo
        .map(
          (m) =>
            `<|start_header_id|>${m.role}<|end_header_id|>\n${m.content}<|eot_id|>`,
        )
        .join("");
      return (
        sysBlock + turns + "<|start_header_id|>assistant<|end_header_id|>\n"
      );
    }

    // fallback: simple concatenation
    return (
      messages.map((m) => `${m.role}: ${m.content}`).join("\n") + "\nassistant:"
    );
  }

  async *generateStream(
    messages: Message[],
    modelFamily: string,
    onToken?: (token: string) => void,
  ): AsyncGenerator<string> {
    if (!this.context) throw new Error("No model loaded");

    const prompt = this.formatPrompt(messages, modelFamily);

    // llama.rn returns a completion object with an async iterator
    const result = await this.context.completion(
      {
        prompt,
        n_predict: 512,
        temperature: 0.7,
        top_p: 0.9,
        stop: ["<end_of_turn>", "<|eot_id|>", "</s>"],
      },
      (data) => {
        // this callback fires for every token
        onToken?.(data.token);
      },
    );

    yield result.text;
  }

  async release() {
    await this.context?.release();
    this.context = null;
    this.loadedModelId = null;
  }

  isModelLoaded(modelId: string) {
    return this.loadedModelId === modelId && this.context !== null;
  }
}

// singleton — one instance for the whole app
export const llamaService = new LlamaService();
