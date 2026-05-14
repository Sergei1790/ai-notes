import {render, screen} from '@testing-library/react';
import {describe, it, expect} from 'vitest';
import SubmitButton from './SubmitButton';

describe('SubmitButton', () => {
    it('renders children inside a form', () => {
        render(
            <form>
                <SubmitButton pendingText="Loading..." className="">
                    Click me
                </SubmitButton>
            </form>
        );
        expect(screen.getByRole('button')).toHaveTextContent('Click me');
    });
    it('has type submit', () => {
        render(
            <form>
                <SubmitButton pendingText="Loading..." className="">
                    Click me
                </SubmitButton>
            </form>
        );
        expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });
    it('is not disabled when not pending', () => {
        render(
            <form>
                <SubmitButton pendingText="Loading..." className="">
                    Click me
                </SubmitButton>
            </form>
        );
        expect(screen.getByRole('button')).not.toBeDisabled();
    });
    it('applies the passsed className', () => {
        render(
            <form>
                <SubmitButton pendingText="Loading..." className="bg-red-500 px-4">
                    Submit
                </SubmitButton>
            </form>
        );
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-red-500');
        expect(button).toHaveClass('px-4');
        expect(button).toHaveClass('disabled:opacity-50');
    });
});