import { GoogleGenAI } from '@google/genai';
import { auth } from '@/auth';

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return new Response('Unauthorized', { status: 401 });

    const { content } = await req.json();
    
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const stream = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: `Summarize this note in 1-2 sentences:\n\n${content}`,
    });
    
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
        async start(controller) {
            for await (const chunk of stream) {
                controller.enqueue(encoder.encode(chunk.text || ''));
            }
            controller.close();
        },
    });
    
    return new Response(readable);
}
