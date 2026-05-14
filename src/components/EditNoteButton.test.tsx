import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import EditNoteButton from './EditNoteButton';

vi.mock('@/lib/actions', () => ({
    editNote: vi.fn(),
}));

const mockNote = { id: 1, title: 'My Note', content: 'Some content' };

describe('EditNoteButton', () => {
    it('renders Edit Note button initially without modal', () => {
        render(<EditNoteButton note={mockNote} />);
        expect(screen.getByRole('button', {name: 'Edit Note'})).toBeInTheDocument();
        expect(screen.queryByRole('heading', {name: 'Edit Note'})).not.toBeInTheDocument();
    });

    it('opens modal with prefilled values when Edit Note is clicked', async () =>{
        const user = userEvent.setup();
        render(<EditNoteButton note={mockNote} />);

        await user.click(screen.getByRole('button', {name: 'Edit Note'}));

        expect(screen.getByRole('heading', { name: 'Edit Note' })).toBeInTheDocument();
        expect(screen.getByDisplayValue('My Note')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Some content')).toBeInTheDocument();
    });

    it('closes modal when Cancel is clicked', async () =>{
        const user = userEvent.setup();
        render(<EditNoteButton note={mockNote} />);

        await user.click(screen.getByRole('button', { name: 'Edit Note' }));
        expect(screen.getByRole('heading', { name: 'Edit Note' })).toBeInTheDocument();

        await user.click(screen.getByRole('button', {name: 'Cancel'}));
        expect(screen.queryByRole('heading', { name: 'Edit Note' })).not.toBeInTheDocument();
    });

    it('lets user edit prefilled values', async () =>{
        const user = userEvent.setup();
        render(<EditNoteButton note={mockNote} />);

        await user.click(screen.getByRole('button', { name: 'Edit Note' }));
        expect(screen.getByRole('heading', { name: 'Edit Note' })).toBeInTheDocument();

        const titleInput = screen.getByDisplayValue('My Note');
        await user.clear(titleInput);
        await user.type(titleInput, 'Updated title');

        expect(titleInput).toHaveValue('Updated title');
    });
});