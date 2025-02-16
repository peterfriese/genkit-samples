#!/usr/bin/env node

import { Command } from 'commander';
import { extract } from './extract';
import { chatWithPDF } from './chat';
import { analyseInvoice } from './analyseInvoice'

const program = new Command();

program
	.name('pdf-o-matic')
	.description('Do stuff with PDFs')
	.version('0.0.1');

program
	.command('analyseInvoice')
	.description('Analyse the provided invoice')
	.argument('<pdf-url>', 'URL of the invoice PDF file')
	.action(async (pdfUrl: string, options: { prompt?: string }) => {
		console.log(`Extracting data from ${pdfUrl}...`);

		const output = await analyseInvoice(pdfUrl);
		console.log(output);
	});


program
	.command('extract')
	.description('Extract structured data from a PDF')
	.argument('<pdf-url>', 'URL of the PDF file')
	.option('-p, --prompt <file>', 'name of the prompt file')
	.action(async (pdfUrl: string, options: { prompt?: string }) => {
		console.log(`Extracting data from ${pdfUrl}...`);
		console.log(`Using prompt from ${options.prompt || 'default'}`);

		const output = await extract(options.prompt || 'default', pdfUrl);
		console.log(output);
	});

program
	.command('chat')
	.description('Chat with a PDF')
	.argument('<pdf-url>', 'URL of the PDF file')
	.option('-p, --prompt <string>', 'prompt')
	.action(async (pdfFile: string, options: { prompt?: string }) => {
		const defaultPrompt = 'Answer the user\'s questions about the contents of the attached PDF file.';
		console.log(`Chatting with ${pdfFile}...`);
		console.log(`Using prompt: ${options.prompt || defaultPrompt}`);

		const output = await chatWithPDF(options.prompt || defaultPrompt, pdfFile);
		console.log(output);
	});

program.parse();