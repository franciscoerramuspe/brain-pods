import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function main() {
  try {
    console.log('Starting main function...');
    const chatCompletion = await getGroqChatCompletion();
    console.log('Chat completion received:');
    console.log(
      chatCompletion.choices[0]?.message?.content || 'No content received'
    );
  } catch (error) {
    console.error('Error in main function:', error);
  }
}

export async function getGroqChatCompletion() {
  console.log('Sending request to Groq API...');
  return groq.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: 'Explain the importance of fast language models',
      },
    ],
    model: 'llama3-8b-8192',
  });
}

// Only call the main function if this file is being run directly
if (import.meta.url === new URL(import.meta.url).href) {
  main().catch((error) => console.error('Unhandled error:', error));
}
