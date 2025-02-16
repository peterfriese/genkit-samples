import { gemini20Flash, googleAI } from '@genkit-ai/googleai';
import { ollama } from 'genkitx-ollama';
import { Document, genkit } from 'genkit/beta';
import { createInterface } from "node:readline/promises";
import fs from 'node:fs';
import pdf from 'pdf-parse';

export async function chatWithPDF(userPrompt: string, pdfFile: string) {
	const ai = genkit({
		plugins: [
			googleAI(),
			ollama({
				models: [
					{
						name: 'deepseek-r1',
						type: 'chat',
					},
				],
				serverAddress: 'http://localhost:11434',
			}),
		],
		model: 'ollama/deepseek-r1',
	});

	let dataBuffer = fs.readFileSync(pdfFile);
	const { text } = await pdf(dataBuffer);
	const document = Document.fromText(text);

	const prompt = `
		${userPrompt}
		In the following text, you will find the full text of a PDF document. 
		You will be given a question about the document, and you will need to 
		answer the question based on the document. Please answer the question 
		based on the document, and only the document. If something isn't quite 
		clear, you can ask the user for more information.
	`;

	const chat = ai.chat({ system: prompt, docs: [document] });
	const readline = createInterface(process.stdin, process.stdout);

	while (true) {
		const userInput = await readline.question("> ");
		const { response, stream } = chat.sendStream(userInput);
		let accumulatedText = "";
		for await (const chunk of stream) {
			accumulatedText += chunk.text;
			if (chunk.text.includes('\n')) {
				console.log(accumulatedText);
				accumulatedText = "";
			}
		}
		if (accumulatedText) {
			console.log(accumulatedText);
		}
	}
}