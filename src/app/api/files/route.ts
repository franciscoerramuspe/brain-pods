import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

async function uploadEmbeddings({
  podId,
  context,
}: {
  podId: string;
  context: string;
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in the environment');
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

  const result = await model.embedContent(context);
  const embedding = result.embedding;

  console.log(embedding);

  // INSERT EMBEDDING INTO DATABASE
  await supabase
    .from('pod')
    .update({
      embedding: embedding,
    })
    .eq('id', podId);

  return embedding;
}

export async function POST(req: Request) {
  const { context } = await req.json();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('GEMINI_API_KEY is not defined in the environment');
    return new Response(JSON.stringify({ error: 'API key is missing' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

  try {
    const podId = req.headers.get('podId');
    if (!podId) {
      return NextResponse.json(
        { success: false, error: 'podId is missing in the request headers' },
        { status: 400 }
      );
    }

    const embedding = await uploadEmbeddings({
      podId,
      context,
    });
    return NextResponse.json({ success: true, embedding });
  } catch (error) {
    console.error('Error uploading embeddings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload embeddings' },
      { status: 500 }
    );
  }
}
