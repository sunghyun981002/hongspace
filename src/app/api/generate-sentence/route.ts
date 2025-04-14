import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Create a prompt that outputs a sentence in both English and Korean for language study purposes.
          The sentence should be grammatically correct and suitable for learning purposes.
          Output format:
          English: [Example Sentence in English]
          Korean: [한글로 된 예문]`
        },
        {
          role: "user",
          content: "Generate a new sentence pair"
        }
      ],
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('No response from API');

    const [english, korean] = content.split('\n').map(line => line.split(': ')[1]);
    
    return NextResponse.json({ english, korean });
  } catch (error) {
    console.error('Error generating sentence:', error);
    return NextResponse.json(
      { error: '문장 생성 중 오류가 발생했습니다. 다시 시도해주세요.' },
      { status: 500 }
    );
  }
} 