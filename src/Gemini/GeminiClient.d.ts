export declare class GeminiClient {
    settings: {
        geminiModel: string;
        geminiApiKey: string;
        maxTokenSize: number;
        temperature: number;
    };
    constructor(settings: {
        geminiModel: string;
        geminiApiKey: string;
        maxTokenSize: number;
        temperature: number;
    });
    process(prompt: string): Promise<string>;
}
