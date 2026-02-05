import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import HomePage from './HomePage';

const renderHomePage = () => {
    return render(
        <BrowserRouter>
            <HomePage />
        </BrowserRouter>
    );
};

describe('HomePage', () => {
    it('should render app container', () => {
        const { container } = renderHomePage();
        const app = container.querySelector('.app');
        expect(app).toBeInTheDocument();
    });

    it('should render Header component', () => {
        const { container } = renderHomePage();
        const header = container.querySelector('header');
        expect(header).toBeInTheDocument();
    });

    it('should render Footer component', () => {
        const { container } = renderHomePage();
        const footer = container.querySelector('footer');
        expect(footer).toBeInTheDocument();
    });

    it('should render main content area', () => {
        const { container } = renderHomePage();
        const main = container.querySelector('.main-content');
        expect(main).toBeInTheDocument();
    });

    it('should display welcome heading', () => {
        renderHomePage();
        expect(screen.getByText(/Welcome to The Daily Harvest!/i)).toBeInTheDocument();
    });

    it('should display welcome message', () => {
        renderHomePage();
        expect(screen.getByText(/Your source for fresh, organic produce delivered daily/i)).toBeInTheDocument();
    });

    it('should render h2 heading', () => {
        renderHomePage();
        const heading = screen.getByRole('heading', { level: 2 });
        expect(heading).toHaveTextContent('Welcome to The Daily Harvest!');
    });

    it('should have main element', () => {
        renderHomePage();
        const main = screen.getByRole('main');
        expect(main).toBeInTheDocument();
    });

    it('should render complete page structure', () => {
        const { container } = renderHomePage();

        // Check for header
        expect(container.querySelector('header')).toBeInTheDocument();

        // Check for main content
        expect(container.querySelector('main')).toBeInTheDocument();

        // Check for footer
        expect(container.querySelector('footer')).toBeInTheDocument();
    });

    it('should display app title in header', () => {
        renderHomePage();
        expect(screen.getByText('The Daily Harvest')).toBeInTheDocument();
    });

    it('should have navigation links in header', () => {
        renderHomePage();
        expect(screen.getByRole('link', { name: /^home$/i })).toBeInTheDocument();
        const productLinks = screen.getAllByRole('link', { name: /products/i });
        expect(productLinks.length).toBeGreaterThan(0);
        expect(screen.getByRole('link', { name: /cart/i })).toBeInTheDocument();
    });

    it('should render Funny Animal button', () => {
        renderHomePage();
        const button = screen.getByRole('button', { name: /funny animal/i });
        expect(button).toBeInTheDocument();
    });

    it('should fetch and display animal image when button is clicked', async () => {
        const mockImageUrl = 'https://random.dog/test-dog.jpg';
        globalThis.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ url: mockImageUrl }),
            })
        ) as unknown as typeof fetch;

        renderHomePage();
        const button = screen.getByRole('button', { name: /funny animal/i });
        
        await userEvent.click(button);

        await waitFor(() => {
            const image = screen.getByAltText('Random funny animal');
            expect(image).toBeInTheDocument();
            expect(image).toHaveAttribute('src', mockImageUrl);
        });

        expect(globalThis.fetch).toHaveBeenCalledWith('https://random.dog/woof.json');
    });

    it('should show loading state when fetching image', async () => {
        globalThis.fetch = vi.fn(() =>
            new Promise(resolve => setTimeout(() => resolve({
                ok: true,
                json: () => Promise.resolve({ url: 'https://random.dog/test.jpg' }),
            }), 100))
        ) as unknown as typeof fetch;

        renderHomePage();
        const button = screen.getByRole('button', { name: /funny animal/i });
        
        await userEvent.click(button);

        expect(screen.getByRole('button', { name: /loading/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /loading/i })).toBeDisabled();
    });

    it('should display error message when fetch fails', async () => {
        globalThis.fetch = vi.fn(() =>
            Promise.reject(new Error('Network error'))
        ) as unknown as typeof fetch;

        renderHomePage();
        const button = screen.getByRole('button', { name: /funny animal/i });
        
        await userEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText(/failed to load image/i)).toBeInTheDocument();
        });
    });

    it('should display error message when response is not ok', async () => {
        globalThis.fetch = vi.fn(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({}),
            })
        ) as unknown as typeof fetch;

        renderHomePage();
        const button = screen.getByRole('button', { name: /funny animal/i });
        
        await userEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText(/failed to load image/i)).toBeInTheDocument();
        });
    });
});
