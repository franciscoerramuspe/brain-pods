import { NextResponse } from 'next/server';
import dotenv from 'dotenv';

dotenv.config();

export async function POST(req: Request) {
  try {
    const { podId } = await req.json();

    if (!podId) {
      return NextResponse.json({ error: 'Pod ID is required' }, { status: 400 });
    }

    const response = await fetch(`https://${process.env.NEXT_PUBLIC_SERVICE_API}/start`, {
      method: 'POST',
      body: JSON.stringify({ podId: podId }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error starting session:', error);
    return NextResponse.json({ error: 'Failed to start session' }, { status: 500 });
  }
}
