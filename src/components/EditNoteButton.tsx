'use client';

import {Note} from '@/generated/prisma/client';
import {editNote, type ActionState} from '@/lib/actions';
import {useActionState, useState} from 'react';

const initialState: ActionState = { ok: false, error: '' };

export default function EditNoteButton({note}: {note: Pick<Note, 'id' | 'title' | 'content'>}) {
    const [editing, setEditing] = useState(false);

    const [state, formAction, isPending] = useActionState(async (prev: ActionState, formData: FormData) => {
        const result = await editNote(note.id, prev, formData);
        if (result.ok) setEditing(false);
        return result;
    }, initialState);

    return (
        <>
            <button type="button" onClick={() => setEditing(true)} className="cursor-pointer text-xs px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors">
                Edit Note
            </button>
            {editing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setEditing(false)}>
                    <form action={formAction} onClick={(e) => e.stopPropagation()} className="bg-card border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4 space-y-3 overflow-y-auto max-h-[90vh]">
                        <h2 className="font-semibold text-foreground text-lg">Edit Note</h2>
                        <input name="title" defaultValue={note.title} className="border border-white/10 bg-bg text-foreground rounded-xl px-3 py-2 w-full focus:outline-none focus:border-primary/60" />
                        <textarea name="content" defaultValue={note.content} className="border border-white/10 bg-bg text-foreground rounded-xl px-3 py-2 w-full min-h-[120px] focus:outline-none focus:border-primary/60" />
                        {!state.ok && state.error && <p className="text-sm text-red-400">{state.error}</p>}
                        <div className="flex gap-2 items-center">
                            <button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/80 text-white text-sm px-4 py-2 rounded-xl transition-colors cursor-pointer disabled:opacity-50">
                                {isPending ? 'Saving...' : 'Save'}
                            </button>
                            <button type="button" onClick={() => setEditing(false)} className="text-muted hover:text-foreground text-sm px-3 py-2 transition-colors cursor-pointer">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
