import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { text, language } = await request.json();
    
    const voice = language === 'ko' ? 'nova' : 'alloy'; // Korean: nova, English: alloy
    
    const mp3 = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: voice,
      input: text,
      response_format: 'mp3',
    });

    // Convert the raw audio data to base64
    const audioData = await mp3.arrayBuffer();
    const base64Audio = Buffer.from(audioData).toString('base64');

    return NextResponse.json({ audio: base64Audio });
  } catch (error) {
    console.error('TTS Error:', error);
    return NextResponse.json(
      { error: 'TTS 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 