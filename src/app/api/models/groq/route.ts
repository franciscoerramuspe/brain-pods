import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY, dangerouslyAllowBrowser: true });

export async function main() {
  try {
    console.log('Starting main function...');
    const messages = [{ role: 'user', content: 'Hello, Groq!' }];
    const chatCompletion = await getGroqChatCompletion(messages);
    console.log('Chat completion received:');
    console.log(
      chatCompletion.choices[0]?.message?.content || 'No content received'
    );
  } catch (error) {
    console.error('Error in main function:', error);
  }
}

export async function getGroqChatCompletion(messages: any) {
  console.log('Sending request to Groq API...');
  return groq.chat.completions.create({
    messages: messages,
    model: 'mixtral-8x7b-32768',
    temperature: 0.5,
    max_tokens: 150,
    top_p: 1,
    stream: false,
    stop: null,
  });
}

// Only call the main function if this file is being run directly
if (import.meta.url === new URL(import.meta.url).href) {
  main().catch((error) => console.error('Unhandled error:', error));
}
