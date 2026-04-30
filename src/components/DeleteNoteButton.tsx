'use client';

import {Note} from '@/generated/prisma/client';
import {deleteNote} from '@/lib/actions';
import {useState} from 'react';
import SubmitButton from '@/components/SubmitButton';

export default function DeleteNoteButton({note}: {note: Pick<Note, 'id'>}) {
    const [deleting, setDeleting] = useState(false);
    async function handleDelete() {
        await deleteNote(note.id);
        setDeleting(false);
    }
    return (
        <>
            <button type="button" onClick={() => setDeleting(true)} className="text-xs px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 transition-colors cursor-pointer">
                Delete
            </button>

            {deleting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setDeleting(false)}>
                    <form action={handleDelete} onClick={(e) => e.stopPropagation()} className="bg-card border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4 space-y-3">
                        <h2 className="font-semibold text-foreground text-lg">Delete this note?</h2>
                        <p className="text-sm text-muted">{"This can't be undone."}</p>
                        <div className="flex gap-2 items-center">
                            <SubmitButton pendingText="Deleting..." className="bg-red-500/20 hover:bg-red-500/40 text-red-300 text-sm px-4 py-2 rounded-xl transition-colors cursor-pointer">
                                Delete
                            </SubmitButton>
                            <button type="button" onClick={() => setDeleting(false)} className="text-muted hover:text-foreground text-sm px-3 py-2 transition-colors cursor-pointer">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
