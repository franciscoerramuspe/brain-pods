import { NextResponse } from 'next/server';
import dotenv from 'dotenv';

dotenv.config();

export async function POST(req: Request) {
  try {
    const { podId } = await req.json();

    await fetch(`https://${process.env.NEXT_PUBLIC_SERVICE_API}/start`, {
      method: 'POST',
      body: JSON.stringify({ podId: podId }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error starting session:', error);
    return NextResponse.json(
      { error: 'Failed to start session' },
      { status: 500 }
    );
  }
}
