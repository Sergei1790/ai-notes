'use client';

import { createNote, type ActionState } from '@/lib/actions';
import { useActionState } from 'react';

const initialState: ActionState = { ok: false, error: '' };

export default function NoteForm() {
    const [state, formAction, isPending] = useActionState(createNote, initialState);

    return (
        <form action={formAction} className="bg-card border border-white/10 rounded-2xl p-4 space-y-3">
            <h2 className="text-lg font-bold text-foreground mb-6">Create Note</h2>
            <input type="text" name="title" placeholder="Title" className="border border-white/10 bg-bg text-foreground rounded-xl px-3 py-2 w-full focus:outline-none focus:border-primary/60" />
            <textarea name="content" placeholder="Content" className="border border-white/10 bg-bg text-foreground rounded-xl px-3 py-2 w-full focus:outline-none focus:border-primary/60 min-h-[120px]" />
            {!state.ok && state.error && <p className="text-sm text-red-400">{state.error}</p>}
            <button type="submit" disabled={isPending} className="cursor-pointer text-sm px-4 py-2 w-full font-medium bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50">
                {isPending ? 'Creating...' : 'Create Note'}
            </button>
        </form>
    );
}