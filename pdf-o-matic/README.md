# PDF-O-Matic

PDF-O-Matic is a TypeScript CLI application designed to interact with PDF files. It allows users to extract structured data from PDFs, chat with the contents of a PDF, and analyze invoices. This tool leverages AI capabilities to provide intelligent responses and data extraction from PDF documents.

## Features

- **Extract**: Extract structured data from a PDF file.
- **Chat**: Engage in a conversation about the contents of a PDF file.
- **Analyze Invoice**: Analyze invoice PDFs to retrieve structured information.

## Installation

To get started with PDF-O-Matic, clone the repository and install the dependencies:
```bash
git clone <repository-url>
cd pdf-o-matic
npm install
```

## Usage

### Extracting Data from a PDF

To extract structured data from a PDF, use the following command:

```bash
pdf-o-matic extract <pdf-url> --prompt <prompt-file>
```

- `<pdf-url>`: The URL of the PDF file you want to extract data from.
- `--prompt <prompt-file>`: (Optional) The name of the prompt file to use for extraction.

### Chatting with a PDF

To chat with the contents of a PDF, run:

```bash
pdf-o-matic chat <pdf-url> --prompt <prompt>
```

- `<pdf-url>`: The URL of the PDF file you want to chat about.
- `--prompt <prompt>`: (Optional) A custom prompt to guide the conversation.

### Analyzing an Invoice

To analyze an invoice PDF, use:

```bash
pdf-o-matic analyseInvoice <pdf-url>
```

- `<pdf-url>`: The URL of the invoice PDF file.
