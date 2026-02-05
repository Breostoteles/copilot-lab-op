import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ReviewModal from './ReviewModal';
import { Product } from '../types';

describe('ReviewModal', () => {
    const mockProduct: Product = {
        id: '1',
        name: 'Test Apple',
        price: 2.99,
        description: 'Fresh apple',
        image: 'apple.jpg',
        reviews: [
            {
                author: 'John Doe',
                comment: 'Great product!',
                date: '2025-01-15T10:00:00.000Z',
            },
            {
                author: 'Jane Smith',
                comment: 'Very fresh and tasty',
                date: '2025-01-20T14:30:00.000Z',
            },
        ],
        inStock: true,
    };

    const mockOnClose = vi.fn();
    const mockOnSubmit = vi.fn();

    beforeEach(() => {
        mockOnClose.mockClear();
        mockOnSubmit.mockClear();
    });

    it('should return null when product is null', () => {
        const { container } = render(
            <ReviewModal product={null} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );
        expect(container.firstChild).toBeNull();
    });

    it('should render modal when product is provided', () => {
        const { container } = render(
            <ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );
        const backdrop = container.querySelector('.modal-backdrop');
        expect(backdrop).toBeInTheDocument();
    });

    it('should display product name in heading', () => {
        render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
        expect(screen.getByText('Reviews for Test Apple')).toBeInTheDocument();
    });

    it('should display existing reviews', () => {
        render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Great product!')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('Very fresh and tasty')).toBeInTheDocument();
    });

    it('should format review dates correctly', () => {
        render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
        // Check that dates are formatted (will be locale-dependent)
        const reviewElements = screen.getAllByText(/\(/);
        expect(reviewElements.length).toBeGreaterThan(0);
    });

    it('should display "No reviews yet" when product has no reviews', () => {
        const productWithoutReviews: Product = {
            ...mockProduct,
            reviews: [],
        };
        render(
            <ReviewModal product={productWithoutReviews} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );
        expect(screen.getByText('No reviews yet.')).toBeInTheDocument();
    });

    it('should render review form', () => {
        render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
        expect(screen.getByText('Leave a Review')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Your review')).toBeInTheDocument();
    });

    it('should have required fields in form', () => {
        render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
        const nameInput = screen.getByPlaceholderText('Your name');
        const reviewTextarea = screen.getByPlaceholderText('Your review');

        expect(nameInput).toBeRequired();
        expect(reviewTextarea).toBeRequired();
    });

    it('should render submit button', () => {
        render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
        expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('should render close button', () => {
        render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
        expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', async () => {
        const user = userEvent.setup();
        render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

        const closeButton = screen.getByRole('button', { name: /close/i });
        await user.click(closeButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when backdrop is clicked', async () => {
        const user = userEvent.setup();
        const { container } = render(
            <ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );

        const backdrop = container.querySelector('.modal-backdrop');
        await user.click(backdrop!);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose when modal content is clicked', async () => {
        const user = userEvent.setup();
        const { container } = render(
            <ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );

        const content = container.querySelector('.modal-content');
        await user.click(content!);

        expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should submit review with correct data', async () => {
        const user = userEvent.setup();
        render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

        const nameInput = screen.getByPlaceholderText('Your name');
        const reviewTextarea = screen.getByPlaceholderText('Your review');
        const submitButton = screen.getByRole('button', { name: /submit/i });

        await user.type(nameInput, 'Test User');
        await user.type(reviewTextarea, 'This is a test review');
        await user.click(submitButton);

        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
        expect(mockOnSubmit).toHaveBeenCalledWith({
            author: 'Test User',
            comment: 'This is a test review',
            date: expect.any(String),
        });
    });

    it('should reset form after submission', async () => {
        const user = userEvent.setup();
        render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

        const nameInput = screen.getByPlaceholderText('Your name') as HTMLInputElement;
        const reviewTextarea = screen.getByPlaceholderText('Your review') as HTMLTextAreaElement;
        const submitButton = screen.getByRole('button', { name: /submit/i });

        await user.type(nameInput, 'Test User');
        await user.type(reviewTextarea, 'This is a test review');
        await user.click(submitButton);

        await waitFor(() => {
            expect(nameInput.value).toBe('');
            expect(reviewTextarea.value).toBe('');
        });
    });

    it('should render review with dangerouslySetInnerHTML for comment', () => {
        const productWithHtmlReview: Product = {
            ...mockProduct,
            reviews: [
                {
                    author: 'HTML User',
                    comment: '<strong>Bold review</strong>',
                    date: '2025-01-15T10:00:00.000Z',
                },
            ],
        };

        const { container } = render(
            <ReviewModal product={productWithHtmlReview} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );

        const reviewText = container.querySelector('.review p:last-child');
        expect(reviewText?.innerHTML).toContain('<strong>Bold review</strong>');
    });

    it('should have review form class', () => {
        const { container } = render(
            <ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );
        const form = container.querySelector('.review-form');
        expect(form).toBeInTheDocument();
    });

    it('should have reviews list class', () => {
        const { container } = render(
            <ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );
        const reviewsList = container.querySelector('.reviews-list');
        expect(reviewsList).toBeInTheDocument();
    });

    it('should have close button with correct class', () => {
        const { container } = render(
            <ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );
        const closeButton = container.querySelector('.close-button');
        expect(closeButton).toBeInTheDocument();
    });

    it('should create ISO date string when submitting review', async () => {
        const user = userEvent.setup();
        const beforeSubmit = new Date().toISOString();

        render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

        await user.type(screen.getByPlaceholderText('Your name'), 'Test User');
        await user.type(screen.getByPlaceholderText('Your review'), 'Test review');
        await user.click(screen.getByRole('button', { name: /submit/i }));

        const afterSubmit = new Date().toISOString();
        const submittedDate = mockOnSubmit.mock.calls[0][0].date;

        // Check that the date is in ISO format and within reasonable time range
        expect(submittedDate).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        expect(submittedDate >= beforeSubmit && submittedDate <= afterSubmit).toBe(true);
    });
});
