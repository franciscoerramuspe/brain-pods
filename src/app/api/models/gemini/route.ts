import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('API_KEY is not defined in environment variables');
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const randomPrompts = [
  'Tell me a joke about programming',
  'Explain quantum computing in simple terms',
  'Write a haiku about artificial intelligence',
  'Describe the taste of colors',
  'Invent a new sport combining elements of chess and basketball',
];

export async function generateContent() {
  try {
    const randomPrompt =
      randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
    console.log('Random prompt selected:', randomPrompt);

    const result = await model.generateContent(randomPrompt);
    const generatedText = result.response.text();

    console.log('Generated text:', generatedText);

    return { prompt: randomPrompt, generatedText };
  } catch (error) {
    console.error('Error generating content:', error);
    throw new Error('Failed to generate content');
  }
}

// Example usage
if (import.meta.url === `file://${process.argv[1]}`) {
  generateContent()
    .then(({ prompt, generatedText }) => {
      console.log('Prompt:', prompt);
      console.log('Gemini response:', generatedText);
    })
    .catch((error) => console.error('Error:', error.message));
}
