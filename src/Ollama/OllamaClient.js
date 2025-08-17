"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OllamaClient = void 0;
class OllamaClient {
    constructor(settings) {
        this.settings = settings;
    }
    async process(prompt) {
        const requestBody = {
            prompt: prompt,
            model: this.settings.ollamaModel,
            options: {
                num_ctx: this.settings.maxTokenSize,
                temperature: this.settings.temperature,
            },
            stream: false,
        };
        const url = `${this.settings.ollamaUrl}/api/generate`;
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(requestBody),
            signal: AbortSignal.timeout(1000 * 300),
        });
        const json = await response.json();
        return json.response;
    }
    static async getModels(baseUrl) {
        const response = await fetch(`${baseUrl}/api/tags`);
        const json = await response.json();
        if (!json.models || json.models.length === 0) {
            return Promise.reject();
        }
        return json.models.reduce((acc, el) => {
            const name = el.name.replace(":latest", "");
            acc[name] = name;
            return acc;
        }, {});
    }
}
exports.OllamaClient = OllamaClient;
