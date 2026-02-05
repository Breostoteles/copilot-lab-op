import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import CheckoutModal from './CheckoutModal';

describe('CheckoutModal', () => {
    const mockOnConfirm = vi.fn();
    const mockOnCancel = vi.fn();

    beforeEach(() => {
        mockOnConfirm.mockClear();
        mockOnCancel.mockClear();
    });

    it('should render modal with backdrop', () => {
        const { container } = render(
            <CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />
        );
        const backdrop = container.querySelector('.modal-backdrop');
        expect(backdrop).toBeInTheDocument();
    });

    it('should render modal content', () => {
        const { container } = render(
            <CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />
        );
        const content = container.querySelector('.modal-content');
        expect(content).toBeInTheDocument();
    });

    it('should display confirmation heading', () => {
        render(<CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
        expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    });

    it('should display confirmation message', () => {
        render(<CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
        expect(screen.getByText('Do you want to proceed with the checkout?')).toBeInTheDocument();
    });

    it('should render Continue Checkout button', () => {
        render(<CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
        expect(screen.getByRole('button', { name: /continue checkout/i })).toBeInTheDocument();
    });

    it('should render Return to cart button', () => {
        render(<CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
        expect(screen.getByRole('button', { name: /return to cart/i })).toBeInTheDocument();
    });

    it('should call onConfirm when Continue Checkout is clicked', async () => {
        const user = userEvent.setup();
        render(<CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);

        const confirmButton = screen.getByRole('button', { name: /continue checkout/i });
        await user.click(confirmButton);

        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
        expect(mockOnCancel).not.toHaveBeenCalled();
    });

    it('should call onCancel when Return to cart is clicked', async () => {
        const user = userEvent.setup();
        render(<CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);

        const cancelButton = screen.getByRole('button', { name: /return to cart/i });
        await user.click(cancelButton);

        expect(mockOnCancel).toHaveBeenCalledTimes(1);
        expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    it('should have cancel button with cancel-btn class', () => {
        const { container } = render(
            <CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />
        );
        const cancelButton = container.querySelector('.cancel-btn');
        expect(cancelButton).toBeInTheDocument();
        expect(cancelButton).toHaveTextContent('Return to cart');
    });

    it('should have modal actions container', () => {
        const { container } = render(
            <CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />
        );
        const actions = container.querySelector('.checkout-modal-actions');
        expect(actions).toBeInTheDocument();
    });

    it('should render h2 heading', () => {
        render(<CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
        const heading = screen.getByRole('heading', { level: 2 });
        expect(heading).toHaveTextContent('Are you sure?');
    });
});
