import { OllamaClient } from "./src/Ollama/OllamaClient";
import { TranscriptSummarizer } from "./src/TranscriptSummarizer";
export declare class YoutubeVideoSummary {
    ollamaClient: OllamaClient;
    transcriptSummarizer: TranscriptSummarizer;
    constructor(settings: {
        ollamaModel: string;
        ollamaUrl: string;
        maxTokenSize: number;
        temperature: number;
    });
    summarize(url: string): Promise<string>;
}
