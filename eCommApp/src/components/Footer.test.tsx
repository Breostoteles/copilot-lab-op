import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from './Footer';

describe('Footer', () => {
    it('should render footer element', () => {
        const { container } = render(<Footer />);
        const footer = container.querySelector('footer');
        expect(footer).toBeInTheDocument();
    });

    it('should have correct class name', () => {
        const { container } = render(<Footer />);
        const footer = container.querySelector('.app-footer');
        expect(footer).toBeInTheDocument();
    });

    it('should display copyright text', () => {
        render(<Footer />);
        expect(screen.getByText(/© 2025 The Daily Harvest/i)).toBeInTheDocument();
    });

    it('should display all rights reserved text', () => {
        render(<Footer />);
        expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
    });

    it('should render complete copyright message', () => {
        render(<Footer />);
        expect(screen.getByText('© 2025 The Daily Harvest. All rights reserved.')).toBeInTheDocument();
    });
});
