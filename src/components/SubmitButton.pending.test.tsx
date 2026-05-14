import {render, screen } from '@testing-library/react';
import {describe, it, expect, vi} from 'vitest';
import SubmitButton from './SubmitButton';

vi.mock('react-dom', async () => {
    const actual = await vi.importActual<typeof import('react-dom')>('react-dom');
    return {
      ...actual,
      useFormStatus: () => ({pending: true, data: null, method: null, action: null}),
    };
});

describe('SubmitButton (pending)', () => {
    it('shows pendingText when pending', () => {
        render(
            <form>
                <SubmitButton pendingText="Saving..." className="">
                    Save
                </SubmitButton>
            </form>
        );
        expect(screen.getByRole('button')).toHaveTextContent('Saving...');
    });
    it('is disabled when pending', () => {
        render(
            <form>
                <SubmitButton pendingText="Saving..." className="">
                    Save
                </SubmitButton>
            </form>
        );
        expect(screen.getByRole('button')).toBeDisabled();
    });
});

