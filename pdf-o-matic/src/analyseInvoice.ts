import { gemini20Flash, googleAI } from '@genkit-ai/googleai';
import { genkit, z } from 'genkit/beta';

const LineItemSchema = z.object({
	description: z.string(),
	quantity: z.number(),
	grossWorth: z.number(),
});

const InvoiceSchema = z.object({
	invoiceNumber: z.string(),
	date: z.string().describe("The invoice date"),
	items: z.array(LineItemSchema),
	totalGrossWorth: z.number()
});

const ai = genkit({
	plugins: [googleAI()],
	model: gemini20Flash,
});

export async function analyseInvoice(url: string) {
	const { output } = await ai.generate({
		prompt: [
			{ media: { url } },
			{ text: "Extract the structured data from the following PDF file" }
		],
		output: {
			schema: InvoiceSchema
		}
	});
	return output;
}