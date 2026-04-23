'use client';

import { createNote} from '@/lib/actions';

export default function NoteForm(){
    return(
        <form action={createNote} className="flex flex-col gap-3 w-80">
            <input type="text" name="title" placeholder="Title" className="border p-2 rounded" />
            <textarea name="content" placeholder="Content" className="border p-2 rounded" />
            <button type="submit" className="cursor-pointer w-full bg-primary text-white px-4 py-2 rounded-xl">
                Create Note
            </button>
        </form>
    );
}