export declare class OllamaClient {
    settings: {
        ollamaModel: string;
        ollamaUrl: string;
        maxTokenSize: number;
        temperature: number;
    };
    constructor(settings: {
        ollamaModel: string;
        ollamaUrl: string;
        maxTokenSize: number;
        temperature: number;
    });
    process(prompt: string): Promise<string>;
    static getModels(baseUrl: string): Promise<any>;
}
