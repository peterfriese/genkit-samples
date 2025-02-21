import { gemini20Flash, googleAI } from '@genkit-ai/googleai';
import { genkit, z } from 'genkit/beta';
import { readFile } from 'node:fs/promises';
import path from 'path';

const ai = genkit({
  plugins: [googleAI()],
  model: gemini20Flash,
});

const ExpenseSchema = ai.defineSchema(
  'ExpenseSchema',
  z.object({
    category: z.string().describe("What category of expense this is (e.g. 'food', 'travel', 'accommodation', 'other')"),
    amount: z.number().describe("The amount of the expense"),
    currency: z.string().describe("The currency of the expense"),
    date: z.string().describe("The date of the expense"),
    description: z.string().describe("The description of the expense"),
    vendor: z.string().describe("The vendor of the expense"),
    address: z.string().describe("The address of vendor. Make sure to include the city, state, and country."),
    country: z.string().describe("The country of the vendor"),
    city: z.string().describe("The city of the vendor"),
    state: z.string().describe("The state of the vendor"),
    zip: z.string().describe("The zip code of the vendor"),
    phone: z.string().describe("The phone number of the vendor"),
    email: z.string().describe("The email of the vendor"),
    website: z.string().describe("The website of the vendor"),
  })
);

export const extractExpenses = ai.defineFlow(
  {
    name: 'extractExpenses',
    inputSchema: z.object({
      file: z.string()
    }),
    outputSchema: ExpenseSchema
  },
  async (input) => {
    const { dataUrl } = await ai.run('load-expense-file', async () => {
      const filePath = path.resolve(input.file);
      const fileExtension = path.extname(filePath).toLowerCase();
      let mimeType = 'application/pdf';
      if (fileExtension === '.png' || fileExtension === '.jpg') {
        mimeType = `image/${fileExtension.slice(1)}`;
      }
      const b64Data = await readFile(filePath, { encoding: 'base64' });
      return { dataUrl: `data:${mimeType};base64,${b64Data}` };
    });

    const { output } = await ai.generate({
      prompt: [
        { media: { url: dataUrl } },
        { text: "Extract the expenses from the following files." },
      ],
      output: {
        schema: ExpenseSchema
      }
    });
    if (!output) {
      throw new Error('No output');
    }
    return output;
  });

export const generateExpenseReport = ai.defineFlow(
  {
    name: 'generateExpenseReport',
    inputSchema: z.array(z.object({ file: z.string() })),
  },
  async (input) => {
    const expenses = await Promise.all(input.map(item => extractExpenses(item)));

    const expensesPrompt = ai.prompt('expensereport');
    const output = await expensesPrompt({
      expenses: JSON.stringify(expenses)
    });

    if (!output) {
      throw new Error('No output');
    }
    return output.text;
  });

const getCurrencyConversionRate = ai.defineTool(
  {
    name: 'getCurrencyConversionRate',
    description: 'Gets the conversion rate of a currency at a specific date',
    inputSchema: z.object({
      baseCurrency: z.string().describe('The base currency'),
      targetCurrency: z.string().describe('The target currency'),
      date: z.string().describe('The date for which to get the conversion rate')
    }),
    outputSchema: z.number(),
  },
  async (input) => {
    const FREECURRENCYAPI_API_KEY = process.env.FREECURRENCYAPI_API_KEY;
    const response = await fetch(`https://api.freecurrencyapi.com/v1/historical?date=${input.date}&apikey=${FREECURRENCYAPI_API_KEY}&base_currency=${input.baseCurrency}&currencies=${input.targetCurrency}`);
    const data = await response.json();
    return data.data[input.date][input.targetCurrency];
  }
);