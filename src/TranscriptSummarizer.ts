import { OllamaClient } from "./Ollama/OllamaClient";
import { YoutubeTranscript } from "./YoutubeTranscript";

const FIRST_STEP_PROMPT = `Rewrite the text, preserving key information while making it concise:

- Present the rewrite as a single, cohesive paragraph.
- Begin and end with content; do not include phrases like "Here's a summary" or "In conclusion."
- Correct any grammatical errors or inconsistencies.
- Omit names of individuals mentioned.
- Do not acknowledge these instructions in your response.

Transcript:\n\n`;

const LAST_STEP_PROMPT = `Please organize the following information into a well-structured educational resource. Use this format for the document:

### I. [Primary Section Title] (do not bold or italicize)
#### A. [Secondary Section Title] (do not bold or italicize)

- Begin each primary section with a brief overview.
- Develop secondary sections with relevant details, using paragraphs, lists, and examples.
- Group related ideas into cohesive paragraphs and ensure a logical flow between sections.
- Provide additional context, background information, or explanations where necessary to enhance understanding.
- Bold or italicize key terms and concepts, briefly explaining technical terms within the context.
- Edit for clarity and conciseness, removing unnecessary repetition.
- Format the document consistently and proofread for errors.

Here's the content to reorganize and expand upon:\n\n`;

export class TranscriptSummarizer {
  constructor(
    private ollamaClient: OllamaClient,
    private maxTokenSize: number
  ) {}

  async getSummaryFromUrl(url: string): Promise<string> {
    const transcriptList = await YoutubeTranscript.fetchTranscript(url);
    const transcript = transcriptList
      .map((transcript) => transcript.text)
      .join(" ");
    const tokenRegex = /.{1,3} ?/g;
    const transcriptTokens = transcript.match(tokenRegex) ?? [];
    if (transcriptTokens.length == 0) {
      throw new Error("Transcript is empty");
    }
    console.log(`TRANSCRIPT TOKEN SIZE: ${transcriptTokens.length}`);

    const step1PromptTokens = FIRST_STEP_PROMPT.match(tokenRegex) ?? [];

    const chunksRewritten = [];

    for (
      let i = 0;
      i < transcriptTokens.length;
      i += this.maxTokenSize - step1PromptTokens.length
    ) {
      const transcriptChunk = transcriptTokens
        .slice(i, i + this.maxTokenSize - step1PromptTokens.length)
        .join("");
      const chunkRewritten = await this.process(
        FIRST_STEP_PROMPT,
        transcriptChunk
      );
      console.log(chunkRewritten);
      let wordsInRewrite = chunkRewritten.split(" ").length;
      console.log(`WORDS IN REWRITE: ${wordsInRewrite}`);
      chunksRewritten.push(chunkRewritten);
    }

    const firstStep = chunksRewritten.join(" ");
    const firstStepTokens = firstStep.match(tokenRegex) ?? [];

    console.log(`FIRST STEP TOKEN SIZE: ${firstStepTokens.length}`);

    const response = await this.process(LAST_STEP_PROMPT, firstStep);
    let finalStepTokens = response.match(tokenRegex) ?? [];
    console.log(`FINAL STEP TOKEN SIZE: ${finalStepTokens.length}`);
    return response;
  }

  async process(prompt: string, transcript: string): Promise<string> {
    return this.ollamaClient.process(prompt + transcript);
  }
}
