export class GeminiClient {
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
    }) {
      this.settings = settings;
    }
  
    async process(prompt: string): Promise<string> {
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
  