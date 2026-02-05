import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Header from './Header';

const renderHeader = () => {
    return render(
        <BrowserRouter>
            <Header />
        </BrowserRouter>
    );
};

describe('Header', () => {
    it('should render header element', () => {
        const { container } = renderHeader();
        const header = container.querySelector('header');
        expect(header).toBeInTheDocument();
    });

    it('should have correct class name', () => {
        const { container } = renderHeader();
        const header = container.querySelector('.app-header');
        expect(header).toBeInTheDocument();
    });

    it('should display app title', () => {
        renderHeader();
        expect(screen.getByText('The Daily Harvest')).toBeInTheDocument();
    });

    it('should render navigation', () => {
        const { container } = renderHeader();
        const nav = container.querySelector('nav');
        expect(nav).toBeInTheDocument();
    });

    it('should have Home link', () => {
        renderHeader();
        const homeLink = screen.getByRole('link', { name: /home/i });
        expect(homeLink).toBeInTheDocument();
        expect(homeLink).toHaveAttribute('href', '/');
    });

    it('should have Products link', () => {
        renderHeader();
        const productsLink = screen.getByRole('link', { name: /products/i });
        expect(productsLink).toBeInTheDocument();
        expect(productsLink).toHaveAttribute('href', '/products');
    });

    it('should have Cart link', () => {
        renderHeader();
        const cartLink = screen.getByRole('link', { name: /cart/i });
        expect(cartLink).toBeInTheDocument();
        expect(cartLink).toHaveAttribute('href', '/cart');
    });

    it('should have Admin Login button', () => {
        renderHeader();
        const adminButton = screen.getByRole('button', { name: /admin login/i });
        expect(adminButton).toBeInTheDocument();
    });

    it('should have Admin Login link pointing to login page', () => {
        const { container } = renderHeader();
        const adminLink = container.querySelector('a[href="/login"]');
        expect(adminLink).toBeInTheDocument();
    });

    it('should render all navigation links', () => {
        renderHeader();
        const links = screen.getAllByRole('link');
        expect(links).toHaveLength(4); // Home, Products, Cart, Login
    });

    it('should render h1 with correct text', () => {
        renderHeader();
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toHaveTextContent('The Daily Harvest');
    });
});
