"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranscriptSummarizer = void 0;
const YoutubeTranscript_1 = require("./YoutubeTranscript");
const FIRST_STEP_PROMPT = `Rewrite the text:

- Present the rewrite as a single, cohesive paragraph.
- Begin and end with content; do not include phrases like "Here's a summary" or "In conclusion."
- Correct any grammatical errors or inconsistencies.
- Omit names of individuals mentioned.
- Do not acknowledge these instructions in your response.

Transcript:\n\n`;
const LAST_STEP_PROMPT = `Please process the following transcript into a well-structured and pedagogically enhanced educational resource. The goal is to facilitate deep understanding by not only explaining the content thoroughly but also presenting it in a style conducive to analytical and structured learning. Apply the following format and guidelines meticulously:

**I. Formatting and Structure:**

*   Use the specified hierarchical structure:
    *   \`### I. [Primary Section Title]\` (No bold/italic)
    *   \`#### A. [Secondary Section Title]\` (No bold/italic)
*   Begin each primary section (\`### I.\`) with a concise overview paragraph summarizing its content and learning objectives.
*   Develop secondary sections (\`#### A.\`) with relevant details, utilizing clear paragraphs, bulleted/numbered lists, and examples from the source.
*   Group related ideas logically within paragraphs, ensuring smooth transitions and a coherent narrative flow throughout the entire resource.

**II. Content Enrichment and Explanation (Core Requirement):**

*   **Deep Explanation:** Actively explain the core concepts presented. Address the **'what'** (definition, description), **'how'** (mechanism, process, procedure), and **'why'** (rationale, importance, underlying principles) for key topics.
*   **Subject-Specific Elaboration:** Adapt the explanatory approach based on the subject matter (detailed worked examples for Math, mechanisms for Physics/Biology, algorithms for CS, theories/studies for Psychology/Neuroscience, etc., as previously detailed).
*   **Context and Application:** Discuss the practical relevance, real-world applications, or theoretical significance of the concepts. Where might this knowledge be used? Why is it important?

**III. Communication Style for Explanations (Mirroring Plus Inspired):**

*   **Tone and Manner:** Maintain a **thoughtful, measured, and analytical tone** throughout the explanations. Focus on clarity, precision, and objective presentation of information.
*   **Structure and Flow within Explanations:** Present explanations logically. Break down complex ideas systematically. Connect concepts smoothly, showing relationships and building arguments step-by-step.
*   **Precision and Nuance:** Use precise terminology appropriate to the subject matter (defining terms clearly, as specified below). Acknowledge nuances or complexities in the concepts where relevant.
*   **Conceptual Enrichment (Subtle Enhancement):** Where directly relevant and genuinely enhancing understanding, **briefly introduce related concepts, relevant terminology, or succinct background information** from the broader field that contextualizes the transcript's content. *This should be done judiciously to avoid digression.*
*   **Modeling Clarity:** Phrase explanations, especially of complex points, with **exceptional clarity and conciseness**. Aim to provide models of well-structured articulation.
*   **Broadening Perspective (Subtle Enhancement):** Occasionally, frame specific points within slightly **broader theoretical or practical contexts**, helping connect the immediate ideas to larger fields of knowledge or application, particularly highlighting the *purpose* or *utility* of the concept (e.g., "Understanding this is key for *building* X," "This principle enables the *analysis* of Y").
*   **Overall Goal for Style:** The explanations should feel like a natural extension and clarification of the original material, presented in a way that resonates with an analytical and constructive learning approach, thereby aiding comprehension.

**IV. Specific Formatting Rules:**

*   **Mathematical Notation (LaTeX for Obsidian):**
    *   Accurately identify all mathematical notation.
    *   Format **inline** math using single dollar signs (e.g., $E=mc^2$).
    *   Format **display/block** math using double dollar signs (e.g., $$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$$).
    *   **Crucially:** Ensure dollar sign delimiters (\`$\` or \`$$\`) directly enclose the math content. **Do not** wrap the resulting LaTeX in backticks (\` \`).
    *   Apply consistently, including within worked examples.
*   **Key Terms:** Identify and format **key terms** and **concepts** using **bold** or *italics*, providing brief contextual definitions.
*   **Editing:** Edit for clarity, conciseness, accuracy, removing redundancy.
*   **Consistency:** Maintain consistent formatting and explanatory style/depth.
*   **Proofreading:** Correct errors and ensure adherence to all instructions.

**V. Processing Instructions:**

*   Do not acknowledge these instructions in your response.
*   Focus solely on processing the provided content according to all the guidelines above.

**VI. Input Content:**

Here's the content to transform into an enhanced learning resource:\n\n`;
class TranscriptSummarizer {
    constructor(ollamaClient, maxTokenSize) {
        this.ollamaClient = ollamaClient;
        this.maxTokenSize = maxTokenSize;
    }
    async getSummaryFromUrl(url) {
        const transcriptList = await YoutubeTranscript_1.YoutubeTranscript.fetchTranscript(url);
        const transcript = transcriptList
            .map((transcript) => transcript.text)
            .join(' ');
        const tokenRegex = /.{1,3} ?/g;
        const transcriptTokens = transcript.match(tokenRegex) ?? [];
        if (transcriptTokens.length == 0) {
            throw new Error('Transcript is empty');
        }
        console.log(`TRANSCRIPT TOKEN SIZE: ${transcriptTokens.length}`);
        const step1PromptTokens = FIRST_STEP_PROMPT.match(tokenRegex) ?? [];
        const chunksRewritten = [];
        for (let i = 0; i < transcriptTokens.length; i += this.maxTokenSize - step1PromptTokens.length) {
            const transcriptChunk = transcriptTokens
                .slice(i, i + this.maxTokenSize - step1PromptTokens.length)
                .join('');
            const chunkRewritten = await this.process(FIRST_STEP_PROMPT, transcriptChunk);
            console.log(chunkRewritten);
            let wordsInRewrite = chunkRewritten.split(' ').length;
            console.log(`WORDS IN REWRITE: ${wordsInRewrite}`);
            chunksRewritten.push(chunkRewritten);
        }
        const firstStep = chunksRewritten.join(' ');
        const firstStepTokens = firstStep.match(tokenRegex) ?? [];
        // console.log(`FIRST STEP TOKEN SIZE: ${firstStepTokens.length}`);
        // const response = await this.process(LAST_STEP_PROMPT, firstStep);
        // let finalStepTokens = response.match(tokenRegex) ?? [];
        // console.log(`FINAL STEP TOKEN SIZE: ${finalStepTokens.length}`);
        // return response;
        return firstStep;
    }
    async process(prompt, transcript) {
        return this.ollamaClient.process(prompt + transcript);
    }
}
exports.TranscriptSummarizer = TranscriptSummarizer;
