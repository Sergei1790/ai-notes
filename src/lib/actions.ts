'use server';

import {prisma} from '@/lib/prisma';
import {revalidatePath} from 'next/cache';
import {auth} from '@/auth';
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

export type ActionState = {
    ok: boolean;
    error?: string;
};

export async function getNotes() {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Not authenticated');
    
    return await prisma.note.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'asc' },
    });
}

export async function createNote(
    _prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    try{
        const session = await auth();
        if (!session?.user?.id){
            return {ok:false, error: 'Not authenticated'};
        } 
    
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;

        if(!title || !content) {
            return {ok: false, error: 'Title and content are required'};
        }

        await prisma.note.create({
            data: {title, content, userId: session.user.id},
        });
        revalidatePath('/');
        return {ok: true};
    } catch (err) {
        console.error('createNote failed:', err);
        return { ok: false, error: 'Failed to create note. Try again.' };
    }
}

export async function editNote(
    noteId: number,
    _prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { ok: false, error: 'Not authenticated' };
        }

        const title = formData.get('title') as string;
        const content = formData.get('content') as string;

        if (!title || !content) {
            return { ok: false, error: 'Title and content are required' };
        }
        
        await prisma.note.update({
            where: {id: noteId, userId: session.user.id},
            data: {title, content},
        });
        revalidatePath('/');
        return { ok: true };
    } catch (err) {
        console.error('editNote failed:', err);
        return { ok: false, error: 'Failed to update note. Try again.' };
    }
}

export async function deleteNote(id: number) {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error('Not authenticated');
        await prisma.note.delete({ where: { id, userId: session.user.id } });
        revalidatePath('/');
    } catch (err) {
        console.error('deleteNote failed:', err);
        throw err;
    }
}

export async function generateSummary(noteId: number){
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error('Not authenticated');

        const note = await prisma.note.findFirst({
            where: { id: noteId, userId: session.user.id },
        });
        if (!note) throw new Error('Note not found');

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Summarize this note in 1-2 sentences:\n\n${note.content}`,
        });

        await prisma.note.update({
            where: { id: noteId },
            data: { summary: response.text },
        });
        revalidatePath('/');
    } catch (err) {
        console.error('generateSummary failed:', err);
        throw err;
    }
}

export async function generateTags(noteId: number){
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error('Not authenticated');

        const note = await prisma.note.findFirst({
            where: { id: noteId, userId: session.user.id },
        });
        if (!note) throw new Error('Note not found');

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Generate 3 tags for this note. Return only comma-separated lowercase keywords, no other text.\n\n${note.content}`,
        });

        await prisma.note.update({
            where: { id: noteId },
            data: { tags: response.text },
        });
        revalidatePath('/');
    } catch (err) {
        console.error('generateTags failed:', err);
        throw err;
    }
}