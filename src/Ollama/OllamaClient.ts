export class OllamaClient {
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
  }) {
    this.settings = settings;
  }

  async process(prompt: string): Promise<string> {
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

  static async getModels(baseUrl: string) {
    const response = await fetch(`${baseUrl}/api/tags`);
    const json = await response.json();

    if (!json.models || json.models.length === 0) {
      return Promise.reject();
    }
    return json.models.reduce((acc: any, el: any) => {
      const name = el.name.replace(":latest", "");
      acc[name] = name;
      return acc;
    }, {});
  }
}
