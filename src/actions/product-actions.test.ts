import { describe, it, expect, vi } from 'vitest';
import { getProducts } from './product-actions';
import { products as mockProducts } from '@/lib/mock-data';

// Mock the dependencies used in the server action
vi.mock('@/lib/mock-data', () => ({
  products: [
    { id: 'prod_1', name: 'Test Product 1', price: 10 },
    { id: 'prod_2', name: 'Test Product 2', price: 20 },
  ],
}));

describe('Product Actions', () => {
  describe('getProducts', () => {
    it('should return a list of products', async () => {
      // Act
      const products = await getProducts();

      // Assert
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBe(2);
      expect(products[0].name).toBe('Test Product 1');
    });

    it('should match the mock data structure', async () => {
        // Act
        const products = await getProducts();

        // Assert
        expect(products).toEqual(mockProducts);
    });
  });
});
