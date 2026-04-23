import { getNotes } from '@/lib/actions';
import NotesList from '@/components/NotesList';
import NoteForm from '@/components/NoteForm';
export default async function Home() {
  const notes = await getNotes();
  return (
    <main className="p-6">
        <h1 className="text-3xl font-bold mb-8 tracking-tight bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(to right, var(--color-primary), var(--color-highlight))' }}>
            My Ai Notes
        </h1>
        <NotesList notes={notes}/>
        <NoteForm />
    </main>
  );
}
