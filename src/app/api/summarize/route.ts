import { prisma } from '@/lib/prisma';
import { GoogleGenAI } from '@google/genai';
import { auth } from '@/auth';

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return new Response('Unauthorized', { status: 401 });
    const userId = session.user.id;
    const { content, noteId } = await req.json();
    
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    

    const stream = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: `Summarize this note in 1-2 sentences:\n\n${content}`,
    });

    let fullText = '';
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
        async start(controller) {
            for await (const chunk of stream) {
                const text = chunk.text || '';
                fullText += text;
                controller.enqueue(encoder.encode(text));
            }
            await prisma.note.update({
                where: {id: noteId, userId},
                data: {summary: fullText},
            });
            controller.close();
        },
    });
    
    return new Response(readable);
}
