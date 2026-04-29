import { getNotes } from '@/lib/actions';
import NotesList from '@/components/NotesList';
import NoteForm from '@/components/NoteForm';

export default async function Home() {
  const notes = await getNotes();
  return (
    <main className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
            <aside className="lg:w-80 lg:sticky lg:top-6 lg:self-start">
                <NoteForm />
            </aside>
            <div className="flex-1">
                <NotesList notes={notes}/>
            </div>
        </div>
    </main>
  );
}
