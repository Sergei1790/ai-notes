import {Note} from '@/generated/prisma/client';
import {deleteNote} from '@/lib/actions';
export default async function NotesList({notes}: {notes: Note[]}) {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-foreground mb-6">My Notes</h1>
            <div className="flex gap-4 items-start overflow-x-auto pb-4">
                {notes.map((note) => (
                    <div key={note.id}>
                        {note.title} <br />
                        {note.content}
                        <form action={deleteNote.bind(null, note.id)}>
                            <button type="submit" className="cursor-pointer w-full bg-primary text-white px-4 py-2 rounded-xl">
                                Delete Note
                            </button>
                        </form>
                    </div>
                ))}
            </div>
        </div>
    );
}
