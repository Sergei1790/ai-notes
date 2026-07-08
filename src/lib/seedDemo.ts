import {prisma} from '@/lib/prisma';

export default async function seedDemo() {
    const demoUser = await prisma.user.upsert({
        where: {email: 'demo@ai-notes.app'},
        update: {},
        create: {email: 'demo@ai-notes.app'},
    });
    await prisma.note.deleteMany({where: {userId: demoUser.id}});

    await prisma.note.createMany({
        data: [
            {
                title: 'Team meeting notes',
                content: 'Discussed the Q3 roadmap. Agreed to prioritize the mobile app and push the analytics dashboard to Q4. Action items: Sarah drafts the spec, Tom estimates the effort.',
                summary: 'Q3 roadmap set: mobile app prioritized, analytics moved to Q4.',
                tags: 'work, meetings, roadmap',
                userId: demoUser.id,
            },
            {
                title: 'Book recommendations',
                content: 'Deep Work by Cal Newport for focus, The Pragmatic Programmer for coding habits, and Atomic Habits for building routines. Start with Atomic Habits.',
                summary: 'Three books to read: Deep Work, The Pragmatic Programmer, Atomic Habits.',
                tags: 'books, reading, productivity',
                userId: demoUser.id,
            },
            {
                title: 'App idea: habit tracker',
                content: 'A simple habit tracker with streaks, reminders, and a weekly summary email. Keep the UI minimal. Could reuse the stack from my budget app.',
                summary: 'Habit tracker idea: streaks, reminders, weekly email, minimal UI.',
                tags: 'ideas, projects, side-project',
                userId: demoUser.id,
            },
        ],
    });
}
