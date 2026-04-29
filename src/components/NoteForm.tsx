'use client';

import { createNote} from '@/lib/actions';

export default function NoteForm(){
    return(
        <form action={createNote} className="bg-card border border-white/10 rounded-2xl p-4 space-y-3">
            <h2 className="text-lg font-bold text-foreground mb-6">Create Note</h2>
            <input type="text" name="title" placeholder="Title" className="border border-white/10 bg-bg text-foreground rounded-xl px-3 py-2 w-full focus:outline-none focus:border-primary/60" />
            <textarea name="content" placeholder="Content" className="border border-white/10 bg-bg text-foreground rounded-xl px-3 py-2 w-full focus:outline-none focus:border-primary/60 min-h-[120px]" />
            <button type="submit" className="cursor-pointer text-sm px-4 py-2 w-full font-medium bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors">
                Create Note
            </button>
        </form>
    );
}