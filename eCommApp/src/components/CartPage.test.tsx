import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import CartPage from './CartPage';
import { CartContext, CartItem } from '../context/CartContext';

// Mock components
vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

vi.mock('./CheckoutModal', () => ({
    default: ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) => (
        <div data-testid="checkout-modal">
            <button onClick={onConfirm} data-testid="confirm-checkout">Confirm</button>
            <button onClick={onCancel} data-testid="cancel-checkout">Cancel</button>
        </div>
    )
}));

const mockCartItems: CartItem[] = [
    {
        id: '1',
        name: 'Test Product 1',
        price: 29.99,
        quantity: 2,
        image: 'test1.jpg',
        reviews: [],
        inStock: true
    },
    {
        id: '2',
        name: 'Test Product 2',
        price: 49.99,
        quantity: 1,
        image: 'test2.jpg',
        reviews: [],
        inStock: true
    }
];

const mockCartContext = {
    cartItems: mockCartItems,
    addToCart: vi.fn(),
    clearCart: vi.fn()
};

// Helper function for test data
const createMockCartItem = (overrides?: Partial<CartItem>): CartItem => ({
    id: '1',
    name: 'Test Product',
    price: 29.99,
    quantity: 1,
    image: 'test.jpg',
    reviews: [],
    inStock: true,
    ...overrides
});

const renderWithCartContext = (cartContext = mockCartContext) => {
    return render(
        <CartContext.Provider value={cartContext}>
            <CartPage />
        </CartContext.Provider>
    );
};

describe('CartPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should display cart title', () => {
        // Arrange & Act
        renderWithCartContext();

        // Assert
        expect(screen.getByText('Your Cart')).toBeInTheDocument();
    });

    it('should display first product name in cart', () => {
        // Arrange & Act
        renderWithCartContext();

        // Assert
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    });

    it('should display second product name in cart', () => {
        // Arrange & Act
        renderWithCartContext();

        // Assert
        expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    });

    it('should display first product price', () => {
        // Arrange & Act
        renderWithCartContext();

        // Assert
        expect(screen.getByText('Price: $29.99')).toBeInTheDocument();
    });

    it('should display second product price', () => {
        // Arrange & Act
        renderWithCartContext();

        // Assert
        expect(screen.getByText('Price: $49.99')).toBeInTheDocument();
    });

    it('should display first product quantity', () => {
        // Arrange & Act
        renderWithCartContext();
        
        // Assert
        expect(screen.getByText('Quantity: 2')).toBeInTheDocument();
    });

    it('should display second product quantity', () => {
        // Arrange & Act
        renderWithCartContext();

        // Assert
        expect(screen.getByText('Quantity: 1')).toBeInTheDocument();
    });

    it('should display empty cart message when cart is empty', () => {
        // Arrange & Act
        renderWithCartContext({ ...mockCartContext, cartItems: [] });

        // Assert
        expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
    });

    it('should render header component', () => {
        // Arrange & Act
        renderWithCartContext();

        // Assert
        expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('should render footer component', () => {
        // Arrange & Act
        renderWithCartContext();

        // Assert
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('should not render item details when cart is empty', () => {
        // Arrange & Act
        renderWithCartContext({ ...mockCartContext, cartItems: [] });

        // Assert
        expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
        expect(screen.queryByText('Test Product 1')).not.toBeInTheDocument();
        expect(screen.queryByText('Test Product 2')).not.toBeInTheDocument();
        expect(screen.queryByText('Price: $29.99')).not.toBeInTheDocument();
        expect(screen.queryByText('Quantity: 2')).not.toBeInTheDocument();
    });

    describe('Checkout Flow', () => {
        it('should display checkout button when cart contains items', () => {
            // Arrange
            renderWithCartContext();

            // Act & Assert
            const checkoutBtn = screen.getByRole('button', { name: /checkout/i });
            expect(checkoutBtn).toBeInTheDocument();
        });

        it('should hide checkout button when cart is empty', () => {
            // Arrange
            renderWithCartContext({ ...mockCartContext, cartItems: [] });

            // Act & Assert
            expect(screen.queryByRole('button', { name: /checkout/i })).not.toBeInTheDocument();
        });

        it('should open checkout modal when checkout button is clicked', () => {
            // Arrange
            renderWithCartContext();
            const checkoutBtn = screen.getByRole('button', { name: /checkout/i });

            // Act
            fireEvent.click(checkoutBtn);

            // Assert
            expect(screen.getByTestId('checkout-modal')).toBeInTheDocument();
        });

        it('should close modal when cancel button is clicked', () => {
            // Arrange
            renderWithCartContext();
            fireEvent.click(screen.getByRole('button', { name: /checkout/i }));
            const cancelBtn = screen.getByTestId('cancel-checkout');

            // Act
            fireEvent.click(cancelBtn);

            // Assert
            expect(screen.queryByTestId('checkout-modal')).not.toBeInTheDocument();
        });

        it('should clear cart when checkout is confirmed', () => {
            // Arrange
            const clearCartMock = vi.fn();
            renderWithCartContext({ ...mockCartContext, clearCart: clearCartMock });
            fireEvent.click(screen.getByRole('button', { name: /checkout/i }));

            // Act
            fireEvent.click(screen.getByTestId('confirm-checkout'));

            // Assert
            expect(clearCartMock).toHaveBeenCalledOnce();
        });

        it('should display success message after order confirmation', () => {
            // Arrange
            renderWithCartContext({ ...mockCartContext, clearCart: vi.fn() });
            fireEvent.click(screen.getByRole('button', { name: /checkout/i }));

            // Act
            fireEvent.click(screen.getByTestId('confirm-checkout'));

            // Assert
            expect(screen.getByText('Your order has been processed!')).toBeInTheDocument();
        });

        it('should hide checkout modal after order is confirmed', () => {
            // Arrange
            renderWithCartContext({ ...mockCartContext, clearCart: vi.fn() });
            fireEvent.click(screen.getByRole('button', { name: /checkout/i }));

            // Act
            fireEvent.click(screen.getByTestId('confirm-checkout'));

            // Assert
            expect(screen.queryByTestId('checkout-modal')).not.toBeInTheDocument();
        });
    });

    describe('Order Processed State', () => {
        it('should display first processed item details after checkout', () => {
            // Arrange
            renderWithCartContext({ ...mockCartContext, clearCart: vi.fn() });
            fireEvent.click(screen.getByRole('button', { name: /checkout/i }));
            fireEvent.click(screen.getByTestId('confirm-checkout'));

            // Assert
            expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        });

        it('should display second processed item details after checkout', () => {
            // Arrange
            renderWithCartContext({ ...mockCartContext, clearCart: vi.fn() });
            fireEvent.click(screen.getByRole('button', { name: /checkout/i }));
            fireEvent.click(screen.getByTestId('confirm-checkout'));

            // Assert
            expect(screen.getByText('Test Product 2')).toBeInTheDocument();
        });

        it('should display correct price for first processed item', () => {
            // Arrange
            renderWithCartContext({ ...mockCartContext, clearCart: vi.fn() });
            fireEvent.click(screen.getByRole('button', { name: /checkout/i }));
            fireEvent.click(screen.getByTestId('confirm-checkout'));

            // Assert
            expect(screen.getByText('Price: $29.99')).toBeInTheDocument();
        });

        it('should display correct price for second processed item', () => {
            // Arrange
            renderWithCartContext({ ...mockCartContext, clearCart: vi.fn() });
            fireEvent.click(screen.getByRole('button', { name: /checkout/i }));
            fireEvent.click(screen.getByTestId('confirm-checkout'));

            // Assert
            expect(screen.getByText('Price: $49.99')).toBeInTheDocument();
        });

        it('should display correct quantity for first processed item', () => {
            // Arrange
            renderWithCartContext({ ...mockCartContext, clearCart: vi.fn() });
            fireEvent.click(screen.getByRole('button', { name: /checkout/i }));
            fireEvent.click(screen.getByTestId('confirm-checkout'));

            // Assert
            expect(screen.getByText('Quantity: 2')).toBeInTheDocument();
        });

        it('should display correct quantity for second processed item', () => {
            // Arrange
            renderWithCartContext({ ...mockCartContext, clearCart: vi.fn() });
            fireEvent.click(screen.getByRole('button', { name: /checkout/i }));
            fireEvent.click(screen.getByTestId('confirm-checkout'));

            // Assert
            expect(screen.getByText('Quantity: 1')).toBeInTheDocument();
        });

        it('should render header on order processed page', () => {
            // Arrange
            renderWithCartContext({ ...mockCartContext, clearCart: vi.fn() });
            fireEvent.click(screen.getByRole('button', { name: /checkout/i }));

            // Act
            fireEvent.click(screen.getByTestId('confirm-checkout'));

            // Assert
            expect(screen.getByTestId('header')).toBeInTheDocument();
        });

        it('should render footer on order processed page', () => {
            // Arrange
            renderWithCartContext({ ...mockCartContext, clearCart: vi.fn() });
            fireEvent.click(screen.getByRole('button', { name: /checkout/i }));
            fireEvent.click(screen.getByTestId('confirm-checkout'));

            // Assert
            expect(screen.getByTestId('footer')).toBeInTheDocument();
        });
    });

    describe('Error Handling', () => {
        it('should throw error when CartContext is not provided', () => {
            // Arrange
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            // Act & Assert
            expect(() => {
                render(<CartPage />);
            }).toThrow('CartContext must be used within a CartProvider');

            consoleErrorSpy.mockRestore();
        });

        it('should throw error when CartContext value is null', () => {
            // Arrange
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            // Act & Assert
            expect(() => {
                render(
                    <CartContext.Provider value={null as any}>
                        <CartPage />
                    </CartContext.Provider>
                );
            }).toThrow('CartContext must be used within a CartProvider');

            consoleErrorSpy.mockRestore();
        });
    });

    describe('Edge Cases - High Values', () => {
        it('should handle items with very high prices', () => {
            // Arrange
            const expensiveItem = createMockCartItem({ name: 'Luxury Item', price: 999999.99 });
            renderWithCartContext({ ...mockCartContext, cartItems: [expensiveItem] });

            // Act & Assert
            expect(screen.getByText('Price: $999999.99')).toBeInTheDocument();
        });

        it('should handle items with very large quantities', () => {
            // Arrange
            const bulkItem = createMockCartItem({ name: 'Bulk Item', quantity: 10000 });
            renderWithCartContext({ ...mockCartContext, cartItems: [bulkItem] });

            // Act & Assert
            expect(screen.getByText('Quantity: 10000')).toBeInTheDocument();
        });

        it('should handle very long product names without truncation', () => {
            // Arrange
            const longName = 'A'.repeat(200);
            const longNameItem = createMockCartItem({ name: longName });
            renderWithCartContext({ ...mockCartContext, cartItems: [longNameItem] });

            // Act & Assert
            expect(screen.getByText(longName)).toBeInTheDocument();
        });
    });

    describe('Edge Cases - Special Characters and Formatting', () => {
        it('should display product names with special characters correctly', () => {
            // Arrange
            const specialName = 'Product & "Special" <Name> with ™ symbol';
            const specialItem = createMockCartItem({ name: specialName });
            renderWithCartContext({ ...mockCartContext, cartItems: [specialItem] });

            // Act & Assert
            expect(screen.getByText(specialName)).toBeInTheDocument();
        });

        it('should round decimal prices to two places', () => {
            // Arrange
            const precisionItem = createMockCartItem({ price: 19.999 });
            renderWithCartContext({ ...mockCartContext, cartItems: [precisionItem] });

            // Act & Assert
            expect(screen.getByText('Price: $20.00')).toBeInTheDocument();
        });
    });

    describe('Edge Cases - Invalid Values', () => {
        it('should display items with zero price', () => {
            // Arrange
            const freeItem = createMockCartItem({ name: 'Free Item', price: 0 });
            renderWithCartContext({ ...mockCartContext, cartItems: [freeItem] });

            // Act & Assert
            expect(screen.getByText('Price: $0.00')).toBeInTheDocument();
        });

        it('should display items with zero quantity', () => {
            // Arrange
            const zeroQuantityItem = createMockCartItem({ quantity: 0 });
            renderWithCartContext({ ...mockCartContext, cartItems: [zeroQuantityItem] });

            // Act & Assert
            expect(screen.getByText('Quantity: 0')).toBeInTheDocument();
        });

        it('should display items with negative quantity', () => {
            // Arrange
            const negativeItem = createMockCartItem({ name: 'Invalid Item', quantity: -5 });
            renderWithCartContext({ ...mockCartContext, cartItems: [negativeItem] });

            // Act & Assert
            expect(screen.getByText('Quantity: -5')).toBeInTheDocument();
        });

        it('should display items with negative price', () => {
            // Arrange
            const refundItem = createMockCartItem({ name: 'Refund Item', price: -10.00 });
            renderWithCartContext({ ...mockCartContext, cartItems: [refundItem] });

            // Act & Assert
            expect(screen.getByText('Price: $-10.00')).toBeInTheDocument();
        });
    });

    describe('Cart Item Count Variations', () => {
        it('should render single item in cart', () => {
            // Arrange
            const singleItem = [mockCartItems[0]];
            renderWithCartContext({ ...mockCartContext, cartItems: singleItem });

            // Act & Assert
            expect(screen.getByText('Test Product 1')).toBeInTheDocument();
            expect(screen.queryByText('Test Product 2')).not.toBeInTheDocument();
        });

        it('should render multiple items in cart', () => {
            // Arrange
            renderWithCartContext();

            // Act & Assert
            expect(screen.getByText('Test Product 1')).toBeInTheDocument();
            expect(screen.getByText('Test Product 2')).toBeInTheDocument();
        });

        it('should render many items in cart without performance issues', () => {
            // Arrange
            const manyItems: CartItem[] = Array.from({ length: 10 }, (_, i) =>
                createMockCartItem({ id: String(i), name: `Product ${i}` })
            );
            renderWithCartContext({ ...mockCartContext, cartItems: manyItems });

            // Act & Assert
            expect(screen.getByText('Product 0')).toBeInTheDocument();
            expect(screen.getByText('Product 9')).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('should have proper heading hierarchy on cart page', () => {
            // Arrange & Act
            renderWithCartContext();

            // Assert
            expect(screen.getByRole('heading', { name: /your cart/i }))
                .toBeInTheDocument();
        });

        it('should have buttons with accessible names', () => {
            // Arrange & Act
            renderWithCartContext();

            // Assert
            expect(screen.getByRole('button', { name: /checkout/i }))
                .toBeInTheDocument();
        });

        it('should announce empty cart status to users', () => {
            // Arrange & Act
            renderWithCartContext({ ...mockCartContext, cartItems: [] });

            // Assert
            expect(screen.getByText('Your cart is empty.'))
                .toBeInTheDocument();
        });

        it('should have semantic HTML for cart items list', () => {
            // Arrange & Act
            renderWithCartContext();

            // Act & Assert
            const items = screen.getAllByRole('listitem');
            expect(items).toHaveLength(2);
            expect(items[0]).toHaveTextContent('Test Product 1');
            expect(items[1]).toHaveTextContent('Test Product 2');
        });
    });

});
