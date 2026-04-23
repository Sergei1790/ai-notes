'use server';

import {prisma} from '@/lib/prisma';
import {revalidatePath} from 'next/cache';
import {auth} from '@/auth';

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
