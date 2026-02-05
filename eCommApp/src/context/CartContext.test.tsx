import { render, screen, renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CartProvider, CartContext } from './CartContext';
import { useContext } from 'react';
import { Product } from '../types';

const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    price: 29.99,
    description: 'A test product',
    image: 'test.jpg',
    reviews: [],
    inStock: true,
};

const anotherProduct: Product = {
    id: '2',
    name: 'Another Product',
    price: 49.99,
    description: 'Another test product',
    image: 'test2.jpg',
    reviews: [],
    inStock: true,
};

describe('CartContext', () => {
    describe('CartProvider', () => {
        it('should provide cart context to children', () => {
            const TestComponent = () => {
                const context = useContext(CartContext);
                return <div>{context ? 'Context Available' : 'No Context'}</div>;
            };

            render(
                <CartProvider>
                    <TestComponent />
                </CartProvider>
            );

            expect(screen.getByText('Context Available')).toBeInTheDocument();
        });

        it('should initialize with empty cart', () => {
            const TestComponent = () => {
                const context = useContext(CartContext);
                return <div>Items: {context?.cartItems.length}</div>;
            };

            render(
                <CartProvider>
                    <TestComponent />
                </CartProvider>
            );

            expect(screen.getByText('Items: 0')).toBeInTheDocument();
        });
    });

    describe('addToCart', () => {
        it('should add a new item to cart', () => {
            const { result } = renderHook(() => useContext(CartContext), {
                wrapper: CartProvider,
            });

            act(() => {
                result.current?.addToCart(mockProduct);
            });

            expect(result.current?.cartItems).toHaveLength(1);
            expect(result.current?.cartItems[0]).toMatchObject({
                ...mockProduct,
                quantity: 1,
            });
        });

        it('should increment quantity when adding existing item', () => {
            const { result } = renderHook(() => useContext(CartContext), {
                wrapper: CartProvider,
            });

            act(() => {
                result.current?.addToCart(mockProduct);
                result.current?.addToCart(mockProduct);
            });

            expect(result.current?.cartItems).toHaveLength(1);
            expect(result.current?.cartItems[0].quantity).toBe(2);
        });

        it('should add multiple different items', () => {
            const { result } = renderHook(() => useContext(CartContext), {
                wrapper: CartProvider,
            });

            act(() => {
                result.current?.addToCart(mockProduct);
                result.current?.addToCart(anotherProduct);
            });

            expect(result.current?.cartItems).toHaveLength(2);
            expect(result.current?.cartItems[0].id).toBe('1');
            expect(result.current?.cartItems[1].id).toBe('2');
        });

        it('should maintain other items when incrementing quantity', () => {
            const { result } = renderHook(() => useContext(CartContext), {
                wrapper: CartProvider,
            });

            act(() => {
                result.current?.addToCart(mockProduct);
                result.current?.addToCart(anotherProduct);
                result.current?.addToCart(mockProduct);
            });

            expect(result.current?.cartItems).toHaveLength(2);
            expect(result.current?.cartItems[0].quantity).toBe(2);
            expect(result.current?.cartItems[1].quantity).toBe(1);
        });

        it('should preserve all product properties when adding to cart', () => {
            const { result } = renderHook(() => useContext(CartContext), {
                wrapper: CartProvider,
            });

            act(() => {
                result.current?.addToCart(mockProduct);
            });

            const cartItem = result.current?.cartItems[0];
            expect(cartItem?.name).toBe(mockProduct.name);
            expect(cartItem?.price).toBe(mockProduct.price);
            expect(cartItem?.description).toBe(mockProduct.description);
            expect(cartItem?.image).toBe(mockProduct.image);
            expect(cartItem?.reviews).toEqual(mockProduct.reviews);
            expect(cartItem?.inStock).toBe(mockProduct.inStock);
        });

        it('should handle adding product without optional id', () => {
            const productWithoutId: Product = {
                name: 'No ID Product',
                price: 10,
                reviews: [],
                inStock: true,
            };

            const { result } = renderHook(() => useContext(CartContext), {
                wrapper: CartProvider,
            });

            act(() => {
                result.current?.addToCart(productWithoutId);
            });

            expect(result.current?.cartItems).toHaveLength(1);
            expect(result.current?.cartItems[0].name).toBe('No ID Product');
        });

        it('should handle multiple additions of the same item', () => {
            const { result } = renderHook(() => useContext(CartContext), {
                wrapper: CartProvider,
            });

            act(() => {
                result.current?.addToCart(mockProduct);
                result.current?.addToCart(mockProduct);
                result.current?.addToCart(mockProduct);
                result.current?.addToCart(mockProduct);
            });

            expect(result.current?.cartItems).toHaveLength(1);
            expect(result.current?.cartItems[0].quantity).toBe(4);
        });
    });

    describe('clearCart', () => {
        it('should clear all items from cart', () => {
            const { result } = renderHook(() => useContext(CartContext), {
                wrapper: CartProvider,
            });

            act(() => {
                result.current?.addToCart(mockProduct);
                result.current?.addToCart(anotherProduct);
            });

            expect(result.current?.cartItems).toHaveLength(2);

            act(() => {
                result.current?.clearCart();
            });

            expect(result.current?.cartItems).toHaveLength(0);
        });

        it('should handle clearing empty cart', () => {
            const { result } = renderHook(() => useContext(CartContext), {
                wrapper: CartProvider,
            });

            act(() => {
                result.current?.clearCart();
            });

            expect(result.current?.cartItems).toHaveLength(0);
        });

        it('should allow adding items after clearing', () => {
            const { result } = renderHook(() => useContext(CartContext), {
                wrapper: CartProvider,
            });

            act(() => {
                result.current?.addToCart(mockProduct);
                result.current?.clearCart();
                result.current?.addToCart(anotherProduct);
            });

            expect(result.current?.cartItems).toHaveLength(1);
            expect(result.current?.cartItems[0].id).toBe('2');
        });
    });

    describe('Integration', () => {
        it('should handle complex cart operations', () => {
            const { result } = renderHook(() => useContext(CartContext), {
                wrapper: CartProvider,
            });

            // Add items
            act(() => {
                result.current?.addToCart(mockProduct);
                result.current?.addToCart(mockProduct);
                result.current?.addToCart(anotherProduct);
            });

            expect(result.current?.cartItems).toHaveLength(2);
            expect(result.current?.cartItems[0].quantity).toBe(2);
            expect(result.current?.cartItems[1].quantity).toBe(1);

            // Clear
            act(() => {
                result.current?.clearCart();
            });

            expect(result.current?.cartItems).toHaveLength(0);

            // Add again
            act(() => {
                result.current?.addToCart(anotherProduct);
            });

            expect(result.current?.cartItems).toHaveLength(1);
            expect(result.current?.cartItems[0].quantity).toBe(1);
        });
    });
});
