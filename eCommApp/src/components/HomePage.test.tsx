import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
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
        expect(screen.getByText(/Welcome to the The Daily Harvest!/i)).toBeInTheDocument();
    });

    it('should display welcome message', () => {
        renderHomePage();
        expect(screen.getByText(/Check out our products page for some great deals/i)).toBeInTheDocument();
    });

    it('should render h2 heading', () => {
        renderHomePage();
        const heading = screen.getByRole('heading', { level: 2 });
        expect(heading).toHaveTextContent('Welcome to the The Daily Harvest!');
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
        expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /products/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /cart/i })).toBeInTheDocument();
    });
});
