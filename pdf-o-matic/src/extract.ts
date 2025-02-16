import { gemini20Flash, googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit/beta';

const ai = genkit({
  plugins: [googleAI()],
  model: gemini20Flash,
});

export async function extract(promptName: string, pdfUrl: string) {
  const prompt = ai.prompt(promptName);
  const { output } = await prompt({ pdfUrl });
  return output;
}
