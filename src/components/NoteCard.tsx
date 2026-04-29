'use client'
import { useState } from "react";
import { useRouter } from 'next/navigation';
import {Note} from '@/generated/prisma/client';
import {deleteNote, generateTags} from '@/lib/actions';
import EditNoteButton from '@/components/EditNoteButton';

export default function NoteCard({note} : { note: Note}){
    const [streamingSummary, setStreamingSummary] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const router = useRouter();
    async function handleGenerateSummary(){
        setIsStreaming(true);
        setStreamingSummary('');

        const res = await fetch('/api/summarize', {
            method: 'POST',
            body: JSON.stringify({ content: note.content, noteId: note.id }),
        });

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let result = '';

        while (true) {
            const {done, value} = await reader.read();
            if (done) break;
            result += decoder.decode(value);
            setStreamingSummary(result);
        }
        router.refresh();
        setStreamingSummary('');
        setIsStreaming(false);
    }
    
    const summaryToShow = isStreaming ? streamingSummary : note.summary;
    
    return (
        <div className="min-w-0 bg-card border border-white/10 rounded-2xl p-4 space-y-3 hover:border-primary/40 transition-colors">
            <h2 className="text-lg font-semibold text-foreground">{note.title}</h2>

            {note.tags && (
                <div className="flex flex-wrap gap-1.5">
                    {note.tags.split(',').map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                            {tag.trim()}
                        </span>
                    ))}
                </div>
            )}

            {summaryToShow && (
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/5 to-highlight/5 border border-primary/20">
                    <p className="text-xs text-primary font-medium mb-1">✨ AI Summary</p>
                    <p className="text-sm text-muted italic">{summaryToShow}</p>
                </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                <EditNoteButton note={note} />
                <form action={deleteNote.bind(null, note.id)}>
                    <button type="submit" className="text-xs px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 transition-colors cursor-pointer">
                        Delete
                    </button>
                </form>
                <form action={generateTags.bind(null, note.id)}>
                    <button type="submit" className="cursor-pointer text-xs px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors">
                        Generate Tags
                    </button>
                </form>
                <button onClick={handleGenerateSummary} disabled={isStreaming} className="cursor-pointer text-xs px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50">
                    {isStreaming ? 'Generating...' : 'Generate Summary'}
                </button>
            </div>

            <p className="text-sm text-muted whitespace-pre-wrap">{note.content}</p>
        </div>
    );
}