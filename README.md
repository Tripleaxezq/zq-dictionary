# zq dictionary

An AI-powered dictionary that provides multi-sense definitions and contextual dialogues tailored to specific English proficiency levels (CET-4, CET-6, TOEFL, IELTS, GRE).

Built with React, Tailwind CSS, and the Google Gemini API.

## Features

- **Multi-sense Definitions**: Provides up to 3 most common meanings for a word.
- **Level-specific Context**: Definitions and dialogues are tailored to your target English level.
- **Realistic Dialogues**: See how words are used in real-world scenarios.
- **Audio Pronunciation**: Listen to the word using built-in speech synthesis.
- **Beautiful UI**: Clean, responsive interface with a Swiss snow mountain theme.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)
- A Google Gemini API Key (Get one at [Google AI Studio](https://aistudio.google.com/app/apikey))

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd zq-dictionary
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the development server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Building for Production

To create a production build:

```bash
npm run build
```

The optimized files will be in the `dist` directory.

## License

Apache-2.0
