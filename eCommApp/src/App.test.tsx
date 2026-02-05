import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import App from './App';

const renderWithRouter = (initialRoute = '/') => {
    return render(
        <MemoryRouter initialEntries={[initialRoute]}>
            <App />
        </MemoryRouter>
    );
};

describe('App', () => {
    it('should render HomePage at root route', () => {
        renderWithRouter('/');
        expect(screen.getByText(/Welcome to the The Daily Harvest!/i)).toBeInTheDocument();
    });

    it('should render ProductsPage at /products route', () => {
        renderWithRouter('/products');
        // ProductsPage shows loading initially
        expect(screen.getByText(/Loading products.../i)).toBeInTheDocument();
    });

    it('should render LoginPage at /login route', () => {
        renderWithRouter('/login');
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    });

    it('should render AdminPage at /admin route', () => {
        renderWithRouter('/admin');
        expect(screen.getByText(/Welcome to the admin portal/i)).toBeInTheDocument();
    });

    it('should render CartPage at /cart route', () => {
        renderWithRouter('/cart');
        expect(screen.getByRole('heading', { name: /your cart/i })).toBeInTheDocument();
    });

    it('should wrap routes with CartProvider', () => {
        renderWithRouter('/cart');
        // If CartProvider is working, CartPage should render without errors
        expect(screen.getByRole('heading', { name: /your cart/i })).toBeInTheDocument();
    });

    it('should render header on all pages', () => {
        renderWithRouter('/');
        expect(screen.getByText('The Daily Harvest')).toBeInTheDocument();
    });

    it('should have navigation links', () => {
        renderWithRouter('/');
        expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /products/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /cart/i })).toBeInTheDocument();
    });

    it('should render footer on all pages', () => {
        renderWithRouter('/');
        expect(screen.getByText(/© 2025 The Daily Harvest/i)).toBeInTheDocument();
    });

    it('should provide cart context to all routes', () => {
        // Test that cart functionality is available by rendering cart page
        renderWithRouter('/cart');
        expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
    });
});
