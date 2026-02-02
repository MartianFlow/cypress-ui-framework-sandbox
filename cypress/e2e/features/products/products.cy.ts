/**
 * Products Feature Tests
 * @description Comprehensive test suite for products functionality
 * @tags @products @ecommerce @regression
 */

import { productsPage, productDetailPage, header } from '../../../pages';
import { APP } from '../../../utils/constants/routes';

describe('Products Feature', { tags: ['@products', '@ecommerce'] }, () => {
  beforeEach(() => {
    productsPage().visit();
  });

  // =================================
  // Products Listing Tests
  // =================================

  describe('Products Listing', { tags: '@smoke' }, () => {
    it('should display products grid', () => {
      productsPage().verifyPageLoaded();
      productsPage().productCards.should('have.length.at.least', 1);
    });

    it('should display product card with all elements', () => {
      productsPage().productCards.first().within(() => {
        cy.get('[data-testid="product-image"]').should('be.visible');
        cy.get('[data-testid="product-name"]').should('be.visible');
        cy.get('[data-testid="product-price"]').should('be.visible');
        cy.get('[data-testid="add-to-cart"]').should('be.visible');
      });
    });

    it('should navigate to product detail on card click', () => {
      productsPage().clickProductByIndex(0);
      cy.url().should('include', '/products/');
    });
  });

  // =================================
  // Product Search Tests
  // =================================

  describe('Product Search', { tags: '@regression' }, () => {
    it('should search for products', () => {
      productsPage().search('headphones');
      cy.url().should('include', 'search');
    });

    it('should display search results', () => {
      productsPage()
        .interceptProductsRequest()
        .search('laptop');

      productsPage().waitForProductsRequest();
      // Results should be displayed
    });

    it('should show no results message for invalid search', () => {
      productsPage().mockProducts([]);
      productsPage().search('xyznonexistent123');
      productsPage().verifyNoProductsFound();
    });
  });

  // =================================
  // Product Filtering Tests
  // =================================

  describe('Product Filtering', { tags: '@regression' }, () => {
    it('should filter by category', () => {
      productsPage().filterByCategory('Electronics');
      cy.url().should('include', 'category');
    });

    it('should filter by price range', () => {
      productsPage().filterByPriceRange(100, 500);
      // Verify filtered results
    });

    it('should clear all filters', () => {
      productsPage()
        .filterByCategory('Electronics')
        .clearFilters();

      cy.url().should('not.include', 'category');
    });
  });

  // =================================
  // Product Sorting Tests
  // =================================

  describe('Product Sorting', { tags: '@regression' }, () => {
    it('should sort by price ascending', () => {
      productsPage().sortBy('price-asc');
      productsPage().verifyPriceSortedAscending();
    });

    it('should sort by price descending', () => {
      productsPage().sortBy('price-desc');
      productsPage().verifyPriceSortedDescending();
    });

    it('should sort by newest', () => {
      productsPage().sortBy('newest');
      cy.url().should('include', 'sort=newest');
    });
  });

  // =================================
  // Pagination Tests
  // =================================

  describe('Pagination', { tags: '@regression' }, () => {
    it('should navigate to next page', () => {
      productsPage().nextPage();
      cy.url().should('include', 'page=2');
    });

    it('should navigate to specific page', () => {
      productsPage().goToPage(3);
      cy.url().should('include', 'page=3');
    });

    it('should navigate to previous page', () => {
      productsPage().goToPage(2);
      productsPage().previousPage();
      cy.url().should('include', 'page=1');
    });
  });

  // =================================
  // Add to Cart from Listing Tests
  // =================================

  describe('Add to Cart from Listing', { tags: '@regression' }, () => {
    beforeEach(() => {
      cy.intercept('POST', '**/cart').as('addToCart');
    });

    it('should add product to cart', () => {
      productsPage().addToCartByIndex(0);

      cy.wait('@addToCart').its('response.statusCode').should('be.oneOf', [200, 201]);
    });

    it('should show success notification after adding to cart', () => {
      productsPage().addToCartByIndex(0);

      cy.get('[data-testid="toast-success"]').should('be.visible');
    });

    it('should update cart count after adding product', () => {
      const initialCount = 0;
      productsPage().addToCartByIndex(0);

      cy.get('[data-testid="cart-badge"]').should('contain', '1');
    });
  });
});

// =================================
// Product Detail Tests
// =================================

describe('Product Detail', { tags: ['@products', '@ecommerce'] }, () => {
  beforeEach(() => {
    cy.intercept('GET', '**/products/*').as('getProduct');
    cy.visit('/products');
    productsPage().clickProductByIndex(0);
    cy.wait('@getProduct');
  });

  describe('Product Information', { tags: '@smoke' }, () => {
    it('should display product details', () => {
      productDetailPage().verifyPageLoaded();
      productDetailPage().productName.should('be.visible');
      productDetailPage().productPrice.should('be.visible');
      productDetailPage().productDescription.should('be.visible');
    });

    it('should display product image gallery', () => {
      productDetailPage().galleryMainImage.should('be.visible');
    });

    it('should display product rating', () => {
      productDetailPage().productRating.should('be.visible');
    });
  });

  describe('Quantity Selection', { tags: '@regression' }, () => {
    it('should increase quantity', () => {
      productDetailPage()
        .increaseQuantity()
        .verifyQuantity(2);
    });

    it('should decrease quantity', () => {
      productDetailPage()
        .increaseQuantity(2)
        .decreaseQuantity()
        .verifyQuantity(2);
    });

    it('should set specific quantity', () => {
      productDetailPage()
        .setQuantity(5)
        .verifyQuantity(5);
    });

    it('should not allow quantity below 1', () => {
      productDetailPage()
        .setQuantity(1)
        .decreaseQuantity()
        .verifyQuantity(1);
    });
  });

  describe('Add to Cart', { tags: '@regression' }, () => {
    beforeEach(() => {
      cy.intercept('POST', '**/cart').as('addToCart');
    });

    it('should add product to cart', () => {
      productDetailPage().addToCart();

      cy.wait('@addToCart').its('response.statusCode').should('be.oneOf', [200, 201]);
    });

    it('should add product with specific quantity', () => {
      productDetailPage()
        .setQuantity(3)
        .addToCart();

      cy.wait('@addToCart').then((interception) => {
        expect(interception.request.body.quantity).to.eq(3);
      });
    });

    it('should show success message after adding', () => {
      productDetailPage().addToCart();

      productDetailPage().verifyAddToCartSuccess();
    });
  });
});
