import { Note } from '@/generated/prisma/client';
import NoteCard from '@/components/NoteCard';
export default async function NotesList({notes}: {notes: Note[]}) {
    return (
        <>
            {notes.length === 0 ? (
            <div className="text-center py-16 text-muted">
                <p className="text-lg mb-2">No notes yet</p>
                <p className="text-sm">Create your first note using the form on the left.</p>
            </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {notes.map((note) => <NoteCard key={note.id} note={note} />)}
                </div>
            )}
        </>
    );
}
