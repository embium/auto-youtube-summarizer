import { OllamaClient } from './Ollama/OllamaClient';
export declare class TranscriptSummarizer {
    private ollamaClient;
    private maxTokenSize;
    constructor(ollamaClient: OllamaClient, maxTokenSize: number);
    getSummaryFromUrl(url: string): Promise<string>;
    process(prompt: string, transcript: string): Promise<string>;
}
