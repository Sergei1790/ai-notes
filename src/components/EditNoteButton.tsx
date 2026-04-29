'use client'

import { Note } from '@/generated/prisma/client';
import {editNote} from '@/lib/actions';
import {useState} from 'react';

export default function EditNoteButton({note}: {note: Pick<Note, 'id' | 'title' | 'content'>}) {
    const [editing, setEditing] = useState(false);
    async function handleSave(formData: FormData) {
        await editNote(note.id, formData);
        setEditing(false);
    }
    return(
        <>
            <button type="button" onClick={() => setEditing(true)} className="text-xs px-3 py-1.5 rounded-lg bg-accent/40 hover:bg-accent text-foreground transition-colors cursor-pointer">
                Edit Note
            </button>
            {editing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setEditing(false)}>
                    <form action={handleSave} onClick={(e) => e.stopPropagation()} className="bg-card border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4 space-y-3 overflow-y-auto max-h-[90vh]">
                      <h2 className="font-semibold text-foreground text-lg">Edit Note</h2>
                        <input name="title" defaultValue={note.title} className="border border-white/10 bg-bg text-foreground rounded-xl px-3 py-2 w-full focus:outline-none focus:border-primary/60" />
                        <textarea name="content" defaultValue={note.content} className="border border-white/10 bg-bg text-foreground rounded-xl px-3 py-2 w-full min-h-[120px] focus:outline-none focus:border-primary/60" />
                        <div className="flex gap-2 items-center">
                            <button type="submit" className="bg-primary hover:bg-primary/80 text-white text-sm px-4 py-2 rounded-xl transition-colors cursor-pointer">Save</button>
                            <button type="button" onClick={() => setEditing(false)} className="text-muted hover:text-foreground text-sm px-3 py-2 transition-colors cursor-pointer">Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};