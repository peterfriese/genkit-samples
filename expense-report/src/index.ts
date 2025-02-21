#!/usr/bin/env node

import { Command } from 'commander';
import { generateExpenseReport } from './expense'

// Load API key from environment
import dotenv from 'dotenv';
dotenv.config();
const apiKey = process.env.GOOGLE_GENAI_API_KEY;
if (!apiKey) {
  throw new Error('GOOGLE_GENAI_API_KEY is not defined in the environment variables');
}

const program = new Command();

program
  .name('expense-report')
  .description('Generate expense reports')
  .version('0.0.1');

program
  .command('expense')
  .description('Generate an expense report')
  .arguments('<files...>')
  .action(async (files: string[]) => {
    console.log(`Generating expense report for files in folder ${files}...`);

    const output = await generateExpenseReport(files.map(file => ({ file })));
    console.log(output);
  });

program.parse();