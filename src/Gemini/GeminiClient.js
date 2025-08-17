"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiClient = void 0;
class GeminiClient {
    constructor(settings) {
        this.settings = settings;
    }
    async process(prompt) {
        const requestBody = {
            contents: [{
                    parts: [{
                            text: prompt
                        }]
                }]
        };
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.settings.geminiModel}:generateContent?key=${this.settings.geminiApiKey}`;
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(requestBody),
            signal: AbortSignal.timeout(1000 * 300),
        });
        const json = await response.json();
        let text = "";
        for (const part of json.candidates[0].content.parts) {
            if (part.text) {
                text += part.text;
            }
        }
        return text;
    }
}
exports.GeminiClient = GeminiClient;
