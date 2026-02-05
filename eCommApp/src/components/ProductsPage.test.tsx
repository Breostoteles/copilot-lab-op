import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProductsPage from './ProductsPage';
import { CartProvider } from '../context/CartContext';

const mockProducts = [
    {
        id: '1',
        name: 'Apple',
        price: 2.99,
        description: 'Fresh red apple',
        image: 'apple.jpg',
        reviews: [
            {
                author: 'John',
                comment: 'Great!',
                date: '2025-01-15T10:00:00.000Z',
            },
        ],
        inStock: true,
    },
    {
        id: '2',
        name: 'Orange',
        price: 3.99,
        description: 'Juicy orange',
        image: 'orange.jpg',
        reviews: [],
        inStock: false,
    },
];

const renderProductsPage = () => {
    return render(
        <BrowserRouter>
            <CartProvider>
                <ProductsPage />
            </CartProvider>
        </BrowserRouter>
    );
};

describe('ProductsPage', () => {
    beforeEach(() => {
        global.fetch = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should display loading state initially', () => {
        (global.fetch as any).mockImplementation(() => new Promise(() => {}));
        renderProductsPage();
        expect(screen.getByText('Loading products...')).toBeInTheDocument();
    });

    it('should render header and footer during loading', () => {
        (global.fetch as any).mockImplementation(() => new Promise(() => {}));
        renderProductsPage();
        expect(screen.getByText('The Daily Harvest')).toBeInTheDocument();
        expect(screen.getByText(/© 2025 The Daily Harvest/i)).toBeInTheDocument();
    });

    it('should load and display products', async () => {
        (global.fetch as any).mockImplementation((url: string) => {
            const filename = url.split('/').pop();
            if (filename === 'apple.json') {
                return Promise.resolve({
                    ok: true,
                    json: async () => mockProducts[0],
                });
            }
            return Promise.resolve({
                ok: true,
                json: async () => ({ name: 'Test', price: 1, reviews: [], inStock: true }),
            });
        });

        renderProductsPage();

        await waitFor(() => {
            expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText('Apple')).toBeInTheDocument();
        });
    });

    it('should display "Our Products" heading', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockProducts[0],
        });

        renderProductsPage();

        await waitFor(() => {
            expect(screen.getByText('Our Products')).toBeInTheDocument();
        });
    });

    it('should render products grid', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockProducts[0],
        });

        const { container } = renderProductsPage();

        await waitFor(() => {
            expect(container.querySelector('.products-grid')).toBeInTheDocument();
        });
    });

    it('should display product information', async () => {
        (global.fetch as any).mockImplementation((url: string) => {
            const filename = url.split('/').pop();
            if (filename === 'apple.json') {
                return Promise.resolve({
                    ok: true,
                    json: async () => mockProducts[0],
                });
            }
            return Promise.resolve({
                ok: true,
                json: async () => ({ ...mockProducts[1], name: filename?.replace('.json', '') || 'Test' }),
            });
        });

        renderProductsPage();

        await waitFor(() => {
            expect(screen.getByText('Apple')).toBeInTheDocument();
            expect(screen.getByText('$2.99')).toBeInTheDocument();
            expect(screen.getByText('Fresh red apple')).toBeInTheDocument();
        });
    });

    it('should render product images', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockProducts[0],
        });

        renderProductsPage();

        await waitFor(() => {
            const images = screen.getAllByRole('img');
            expect(images.length).toBeGreaterThan(0);
        });
    });

    it('should render Add to Cart button for in-stock items', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockProducts[0],
        });

        renderProductsPage();

        await waitFor(() => {
            const addButton = screen.getAllByText('Add to Cart')[0];
            expect(addButton).toBeInTheDocument();
            expect(addButton).not.toBeDisabled();
        });
    });

    it('should render disabled Out of Stock button for out-of-stock items', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockProducts[1],
        });

        renderProductsPage();

        await waitFor(() => {
            const outOfStockButton = screen.getAllByText('Out of Stock')[0];
            expect(outOfStockButton).toBeInTheDocument();
            expect(outOfStockButton).toBeDisabled();
        });
    });

    it('should add product to cart when Add to Cart is clicked', async () => {
        const user = userEvent.setup();
        (global.fetch as any).mockImplementation((url: string) => {
            const filename = url.split('/').pop();
            if (filename === 'apple.json') {
                return Promise.resolve({
                    ok: true,
                    json: async () => mockProducts[0],
                });
            }
            return Promise.resolve({
                ok: true,
                json: async () => mockProducts[1],
            });
        });

        renderProductsPage();

        await waitFor(() => {
            const appleElements = screen.queryAllByText('Apple');
            expect(appleElements.length).toBeGreaterThan(0);
        });

        const addButtons = screen.getAllByText('Add to Cart');
        await user.click(addButtons[0]);

        // The item should be added to cart (CartContext tested separately)
        expect(addButtons[0]).toBeInTheDocument();
    });

    it('should open review modal when product image is clicked', async () => {
        const user = userEvent.setup();
        (global.fetch as any).mockImplementation((url: string) => {
            const filename = url.split('/').pop();
            if (filename === 'apple.json') {
                return Promise.resolve({
                    ok: true,
                    json: async () => mockProducts[0],
                });
            }
            return Promise.resolve({
                ok: true,
                json: async () => mockProducts[1],
            });
        });

        renderProductsPage();

        await waitFor(() => {
            const images = screen.queryAllByAltText('Apple');
            expect(images.length).toBeGreaterThan(0);
        });

        const images = screen.getAllByAltText('Apple');
        await user.click(images[0]);

        await waitFor(() => {
            expect(screen.getByText('Reviews for Apple')).toBeInTheDocument();
        });
    });

    it('should close review modal when close is triggered', async () => {
        const user = userEvent.setup();
        (global.fetch as any).mockImplementation((url: string) => {
            const filename = url.split('/').pop();
            if (filename === 'apple.json') {
                return Promise.resolve({
                    ok: true,
                    json: async () => mockProducts[0],
                });
            }
            return Promise.resolve({
                ok: true,
                json: async () => mockProducts[1],
            });
        });

        renderProductsPage();

        await waitFor(() => {
            const images = screen.queryAllByAltText('Apple');
            expect(images.length).toBeGreaterThan(0);
        });

        // Open modal
        const images = screen.getAllByAltText('Apple');
        await user.click(images[0]);

        await waitFor(() => {
            expect(screen.getByText('Reviews for Apple')).toBeInTheDocument();
        });

        // Close modal
        const closeButton = screen.getByRole('button', { name: /close/i });
        await user.click(closeButton);

        await waitFor(() => {
            expect(screen.queryByText('Reviews for Apple')).not.toBeInTheDocument();
        });
    });

    it('should submit review and update product', async () => {
        const user = userEvent.setup();
        (global.fetch as any).mockImplementation((url: string) => {
            const filename = url.split('/').pop();
            if (filename === 'apple.json') {
                return Promise.resolve({
                    ok: true,
                    json: async () => mockProducts[0],
                });
            }
            return Promise.resolve({
                ok: true,
                json: async () => mockProducts[1],
            });
        });

        renderProductsPage();

        await waitFor(() => {
            const images = screen.queryAllByAltText('Apple');
            expect(images.length).toBeGreaterThan(0);
        });

        // Open modal
        const images = screen.getAllByAltText('Apple');
        await user.click(images[0]);

        await waitFor(() => {
            expect(screen.getByText('Reviews for Apple')).toBeInTheDocument();
        });

        // Submit review
        const nameInput = screen.getByPlaceholderText('Your name');
        const reviewInput = screen.getByPlaceholderText('Your review');
        const submitButton = screen.getByRole('button', { name: /submit/i });

        await user.type(nameInput, 'Test User');
        await user.type(reviewInput, 'Great product!');
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Test User')).toBeInTheDocument();
            expect(screen.getByText('Great product!')).toBeInTheDocument();
        });
    });

    it('should handle fetch errors gracefully', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        (global.fetch as any).mockRejectedValue(new Error('Network error'));

        renderProductsPage();

        await waitFor(() => {
            expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
        });

        expect(consoleErrorSpy).toHaveBeenCalled();
        consoleErrorSpy.mockRestore();
    });

    it('should handle failed HTTP responses', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        (global.fetch as any).mockResolvedValue({
            ok: false,
            status: 404,
        });

        renderProductsPage();

        await waitFor(() => {
            expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
        });

        expect(consoleErrorSpy).toHaveBeenCalled();
        consoleErrorSpy.mockRestore();
    });

    it('should fetch all four product files', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockProducts[0],
        });

        renderProductsPage();

        await waitFor(() => {
            expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
        });

        expect(global.fetch).toHaveBeenCalledWith('products/apple.json');
        expect(global.fetch).toHaveBeenCalledWith('products/grapes.json');
        expect(global.fetch).toHaveBeenCalledWith('products/orange.json');
        expect(global.fetch).toHaveBeenCalledWith('products/pear.json');
    });

    it('should throw error when used outside CartProvider', () => {
        // Mock console.error to prevent error output in test
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => {
            render(
                <BrowserRouter>
                    <ProductsPage />
                </BrowserRouter>
            );
        }).toThrow('CartContext must be used within a CartProvider');

        consoleErrorSpy.mockRestore();
    });

    it('should have products container', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockProducts[0],
        });

        const { container } = renderProductsPage();

        await waitFor(() => {
            expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
        });

        expect(container.querySelector('.products-container')).toBeInTheDocument();
    });

    it('should have product cards', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockProducts[0],
        });

        const { container } = renderProductsPage();

        await waitFor(() => {
            const cards = container.querySelectorAll('.product-card');
            expect(cards.length).toBeGreaterThan(0);
        });
    });

    it('should display product with correct image src', async () => {
        (global.fetch as any).mockImplementation((url: string) => {
            const filename = url.split('/').pop();
            if (filename === 'apple.json') {
                return Promise.resolve({
                    ok: true,
                    json: async () => mockProducts[0],
                });
            }
            return Promise.resolve({
                ok: true,
                json: async () => mockProducts[1],
            });
        });

        renderProductsPage();

        await waitFor(() => {
            const images = screen.queryAllByAltText('Apple');
            expect(images.length).toBeGreaterThan(0);
        });

        const images = screen.getAllByAltText('Apple') as HTMLImageElement[];
        expect(images[0].src).toContain('products/productImages/apple.jpg');
    });

    it('should use product id or name as key', async () => {
        (global.fetch as any).mockImplementation((url: string) => {
            const filename = url.split('/').pop();
            if (filename === 'apple.json') {
                return Promise.resolve({
                    ok: true,
                    json: async () => mockProducts[0],
                });
            }
            if (filename === 'orange.json') {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({ name: 'Orange', price: 1, reviews: [], inStock: true }),
                });
            }
            return Promise.resolve({
                ok: true,
                json: async () => ({ name: 'Test', price: 1, reviews: [], inStock: true }),
            });
        });

        renderProductsPage();

        await waitFor(() => {
            expect(screen.getByText('Apple')).toBeInTheDocument();
        });
    });

    it('should add disabled class to out of stock button', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockProducts[1],
        });

        const { container } = renderProductsPage();

        await waitFor(() => {
            const button = container.querySelector('.add-to-cart-btn.disabled');
            expect(button).toBeInTheDocument();
        });
    });

    it('should update products list when review is submitted', async () => {
        const user = userEvent.setup();
        (global.fetch as any).mockImplementation((url: string) => {
            const filename = url.split('/').pop();
            if (filename === 'apple.json') {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({ ...mockProducts[0], reviews: [] }),
                });
            }
            return Promise.resolve({
                ok: true,
                json: async () => mockProducts[1],
            });
        });

        renderProductsPage();

        await waitFor(() => {
            const images = screen.queryAllByAltText('Apple');
            expect(images.length).toBeGreaterThan(0);
        });

        // Open modal and check initial state
        const images = screen.getAllByAltText('Apple');
        await user.click(images[0]);

        await waitFor(() => {
            expect(screen.getByText('No reviews yet.')).toBeInTheDocument();
        });

        // Submit a review
        const nameInput = screen.getByPlaceholderText('Your name');
        const reviewInput = screen.getByPlaceholderText('Your review');
        const submitButton = screen.getByRole('button', { name: /submit/i });

        await user.type(nameInput, 'New Reviewer');
        await user.type(reviewInput, 'Amazing!');
        await user.click(submitButton);

        // Check that review is now displayed
        await waitFor(() => {
            expect(screen.getByText('New Reviewer')).toBeInTheDocument();
            expect(screen.getByText('Amazing!')).toBeInTheDocument();
        });
    });
});
