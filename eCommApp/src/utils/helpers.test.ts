import { describe, it, expect } from 'vitest';
import { formatPrice, calculateTotal, validateEmail } from './helpers';

describe('formatPrice', () => {
    it('should format a positive price correctly', () => {
        expect(formatPrice(29.99)).toBe('$29.99');
    });

    it('should format zero price correctly', () => {
        expect(formatPrice(0)).toBe('$0.00');
    });

    it('should format large prices correctly', () => {
        expect(formatPrice(1234567.89)).toBe('$1,234,567.89');
    });

    it('should format prices with one decimal place', () => {
        expect(formatPrice(10.5)).toBe('$10.50');
    });

    it('should format whole number prices with decimals', () => {
        expect(formatPrice(100)).toBe('$100.00');
    });

    it('should handle negative prices', () => {
        expect(formatPrice(-50)).toBe('-$50.00');
    });

    it('should handle very small prices', () => {
        expect(formatPrice(0.01)).toBe('$0.01');
    });
});

describe('calculateTotal', () => {
    it('should calculate total for single item', () => {
        const items = [{ price: 10, quantity: 2 }];
        expect(calculateTotal(items)).toBe(20);
    });

    it('should calculate total for multiple items', () => {
        const items = [
            { price: 10, quantity: 2 },
            { price: 15, quantity: 3 },
        ];
        expect(calculateTotal(items)).toBe(65);
    });

    it('should return 0 for empty array', () => {
        expect(calculateTotal([])).toBe(0);
    });

    it('should handle zero quantity', () => {
        const items = [{ price: 10, quantity: 0 }];
        expect(calculateTotal(items)).toBe(0);
    });

    it('should handle zero price', () => {
        const items = [{ price: 0, quantity: 5 }];
        expect(calculateTotal(items)).toBe(0);
    });

    it('should handle decimal prices and quantities', () => {
        const items = [
            { price: 10.99, quantity: 2 },
            { price: 5.50, quantity: 3 },
        ];
        expect(calculateTotal(items)).toBeCloseTo(38.48, 2);
    });

    it('should handle large quantities', () => {
        const items = [{ price: 1, quantity: 1000 }];
        expect(calculateTotal(items)).toBe(1000);
    });

    it('should handle many items', () => {
        const items = Array.from({ length: 100 }, () => ({ price: 1, quantity: 1 }));
        expect(calculateTotal(items)).toBe(100);
    });
});

describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
        expect(validateEmail('test@example.com')).toBe(true);
        expect(validateEmail('user.name@example.com')).toBe(true);
        expect(validateEmail('user+tag@example.co.uk')).toBe(true);
    });

    it('should reject email without @', () => {
        expect(validateEmail('testexample.com')).toBe(false);
    });

    it('should reject email without domain', () => {
        expect(validateEmail('test@')).toBe(false);
    });

    it('should reject email without local part', () => {
        expect(validateEmail('@example.com')).toBe(false);
    });

    it('should reject email without extension', () => {
        expect(validateEmail('test@example')).toBe(false);
    });

    it('should reject email with spaces', () => {
        expect(validateEmail('test @example.com')).toBe(false);
        expect(validateEmail('test@ example.com')).toBe(false);
    });

    it('should reject empty string', () => {
        expect(validateEmail('')).toBe(false);
    });

    it('should reject email with multiple @', () => {
        expect(validateEmail('test@@example.com')).toBe(false);
    });

    it('should validate email with numbers', () => {
        expect(validateEmail('user123@example.com')).toBe(true);
    });

    it('should validate email with hyphens', () => {
        expect(validateEmail('user-name@example-site.com')).toBe(true);
    });
});
