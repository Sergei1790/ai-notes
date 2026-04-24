'use server';

import {prisma} from '@/lib/prisma';
import {revalidatePath} from 'next/cache';
import {auth} from '@/auth';
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
export async function getNotes() {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Not authenticated');
    
    return await prisma.note.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
    });
}

export async function createNote(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Not authenticated');

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    await prisma.note.create({
        data: {title, content, userId: session.user.id},
    });
    revalidatePath('/');
}

export async function deleteNote(id: number) {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Not authenticated');

    await prisma.note.delete({where: {id}});
    revalidatePath('/');
}

export async function generateSummary(noteId: number){
    const session = await auth();
    if (!session?.user?.id) throw new Error('Not authenticated');

    const note = await prisma.note.findFirst({
        where: { id : noteId, userId: session.user.id },
    })
    if (!note) throw new Error('Note not found');
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Summarize this note in 1-2 sentences:\n\n${note.content}`,
    });
    
    await prisma.note.update({
        where: { id : noteId  },
        data: { summary: response.text },
    });
    revalidatePath('/');
}

export async function generateTags(noteId: number){
    const session = await auth();
    if(!session?.user?.id) throw new Error('Not authenticated');

    const note = await prisma.note.findFirst({
        where: {id: noteId, userId: session.user.id}
    });
    if (!note) throw new Error('Note not found');

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate 3 tags for this note. Return only comma-separated lowercase keywords, no other text.\n\n${note.content}`,
    });

    await prisma.note.update({
        where: {id: noteId},
        data: { tags: response.text },
    });

    revalidatePath('/');
}