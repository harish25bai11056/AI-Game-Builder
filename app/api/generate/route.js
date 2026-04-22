import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Generate a complete, single-file HTML5 game using Phaser 3 CDN. Return ONLY the <html> code. No talk." },
        { role: "user", content: `Prompt: ${prompt}` }
      ],
    });
    return NextResponse.json({ code: response.choices[0].message.content });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
