import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, it, expect, vi} from 'vitest';
import DeleteNoteButton from './DeleteNoteButton';


// Mock the actions module so it doesn't pull in NextAuth → next/server chain
vi.mock('@/lib/actions', () => ({
    deleteNote: vi.fn(),
}));

const mockNote = {id: 1};

describe('DeleteNoteButton', () => {
    it('renders Delete button initially without modal', () => {
        render(<DeleteNoteButton note={mockNote} />);
        expect(screen.getByRole('button', {name: 'Delete'})).toBeInTheDocument();
        expect(screen.queryByText('Delete this note?')).not.toBeInTheDocument();
    });

    it('opens modal when Delete is clicked', async () => {
        const user = userEvent.setup();
        render(<DeleteNoteButton note={mockNote} />);

        await user.click(screen.getByRole('button', {name: 'Delete'}));

        expect(screen.getByText('Delete this note?')).toBeInTheDocument();
        expect(screen.getByText(/can't be undone/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('closes modal when Cancel is clicked', async () => {
        const user = userEvent.setup();
        render(<DeleteNoteButton note={mockNote} />);

        await user.click(screen.getByRole('button', { name: 'Delete' }));
        expect(screen.getByText('Delete this note?')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Cancel' }));
        expect(screen.queryByText('Delete this note?')).not.toBeInTheDocument();
    });

    it('closes modal when backdrop is clicked', async () => {
        const user = userEvent.setup();
        const {container} = render(<DeleteNoteButton note={mockNote} />);

        await user.click(screen.getByRole('button', {name: 'Delete'}));
        expect(screen.getByText('Delete this note?')).toBeInTheDocument();
        
        // backdrop is the fixed overlay div
        const backdrop = container.querySelector('.fixed.inset-0');
        if (!backdrop) throw new Error('Backdrop not found');
        await user.click(backdrop as HTMLElement);

        expect(screen.queryByText('Delete this note?')).not.toBeInTheDocument();
    });

    it('calls deleteNote with note id when confirm is clicked', async () => {
        const user = userEvent.setup();
        const {deleteNote} = await import('@/lib/actions');

        render(<DeleteNoteButton note={mockNote} />);

        await user.click(screen.getByRole('button', { name: 'Delete' }));

        // get the confirm Delete inside the modal (form's submit button)
        const buttons = screen.getAllByRole('button', {name: 'Delete'});
        const confirmButton = buttons[1];

        await user.click(confirmButton);

        expect(deleteNote).toHaveBeenCalledWith(mockNote.id);
    });
});