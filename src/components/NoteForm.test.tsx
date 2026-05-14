import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import NoteForm from './NoteForm';

vi.mock('@/lib/actions', () => ({
    createNote: vi.fn().mockResolvedValue({ok:true}),
}));

describe('NoteForm', () => {
    it('renders title input, content textarea, and submit button', () => {
        render(<NoteForm />);
        expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Content')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Create Note' })).toBeInTheDocument();
    });

    it('lets user type into inputs', async () => {
        const user = userEvent.setup();
        render(<NoteForm />);

        const titleInput = screen.getByPlaceholderText('Title');
        const contentInput = screen.getByPlaceholderText('Content');

        await user.type(titleInput, 'My Note');
        await user.type(contentInput, 'Some content');

        expect(titleInput).toHaveValue('My Note');
        expect(contentInput).toHaveValue('Some content');
    });
});