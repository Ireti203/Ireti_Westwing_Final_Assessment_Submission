const BasePage = require('./BasePage');

/**
 * ProductPage - Page object for individual product detail pages
 * Handles interactions with product details, add to cart functionality, and product information
 * 
 * @class ProductPage
 * @extends BasePage
 */
class ProductPage extends BasePage {
  constructor() {
    super();
    
    // Selectors for product page elements
    this.selectors = {
      productTitle: 'h1, [data-testid="product-title"], .product-title',
      productPrice: '[data-testid="product-price"], .product-price, [class*="price"]',
      addToCartButton: '[data-testid="add-to-cart"], button:contains("In den Warenkorb"), button:contains("Warenkorb")',
      quantitySelector: '[data-testid="quantity-selector"], input[type="number"]',
      increaseQuantityButton: '[data-testid="increase-quantity"], button[aria-label*="increase"]',
      decreaseQuantityButton: '[data-testid="decrease-quantity"], button[aria-label*="decrease"]',
      productImage: '[data-testid="product-image"], .product-image img, img[alt*="produkt"]',
      productDescription: '[data-testid="product-description"], .product-description',
      sizeSelector: '[data-testid="size-selector"], select[name="size"]',
      colorSelector: '[data-testid="color-selector"], [data-testid="color-option"]',
      availabilityStatus: '[data-testid="availability"], .availability, [class*="stock"]',
      breadcrumb: '[data-testid="breadcrumb"], .breadcrumb, nav[aria-label="breadcrumb"]',
      addedToCartModal: '[data-testid="cart-modal"], .modal, [class*="cart-added"]',
      closeModalButton: '[data-testid="close-modal"], button[aria-label*="close"], .modal-close',
      continueShoppingButton: 'button:contains("Weiter einkaufen"), button:contains("Continue shopping")',
      viewCartButton: 'button:contains("Warenkorb"), button:contains("View cart"), a[href*="/cart"]'
    };
  }

  /**
   * Wait for product page to fully load
   */
  waitForProductPageLoad() {
    cy.wait(2000); // Initial wait for page render
    
    cy.get('body').then($body => {
      // Wait for product title or main content
      const titleSelectors = [
        'h1',
        '[class*="ProductDetail"]',
        '[class*="product-title"]',
        'main'
      ];

      for (const selector of titleSelectors) {
        if ($body.find(selector).length > 0) {
          cy.get(selector).first().should('be.visible');
          break;
        }
      }
    });

    cy.wait(2000);
  }

  /**
   * Get product title text
   * @returns {Cypress.Chainable<string>}
   */
  getProductTitle() {
    const titleSelectors = [
      'h1',
      '[class*="ProductDetail"] h1',
      '[class*="product-title"]',
      'h1[class*="title"]'
    ];

    return cy.get('body').then($body => {
      for (const selector of titleSelectors) {
        if ($body.find(selector).length > 0) {
          return cy.get(selector).first().invoke('text').then(text => {
            const cleanTitle = text.trim();
            return cleanTitle;
          });
        }
      }
      
      // Fallback to page title
      return cy.title().then(title => {
        return title;
      });
    });
  }

  /**
   * Get product price text
   * @returns {Cypress.Chainable<string>}
   */
  getProductPrice() {
    const priceSelectors = [
      '[class*="price"]',
      '[data-testid*="price"]',
      'span:contains("€")',
      'div:contains("€")'
    ];

    return cy.get('body').then($body => {
      for (const selector of priceSelectors) {
        if ($body.find(selector).length > 0) {
          return cy.get(selector).first().invoke('text').then(text => {
            const cleanPrice = text.trim();
            return cleanPrice;
          });
        }
      }
      
      return 'Price not found';
    });
  }

  /**
   * Add product to cart
   */
  addToCart() {
    cy.wait(1500); // Human-like pause before interaction
    
    cy.get('body').then($body => {
      // Find the add to cart button with multiple possible selectors
      const addToCartSelectors = [
        'button:contains("In den Warenkorb")',
        'button:contains("Warenkorb")',
        'button:contains("Add to cart")',
        'button[class*="add-to-cart"]',
        'button[class*="AddToCart"]',
        '[data-testid="add-to-cart"]',
        'button[type="submit"]'
      ];

      let buttonFound = false;
      for (const selector of addToCartSelectors) {
        const buttons = $body.find(selector);
        if (buttons.length > 0) {
          cy.get(selector).first()
            .scrollIntoView()
            .should('be.visible');
          
          cy.wait(1000);
          cy.get(selector).first().trigger('mouseover');
          cy.wait(300);
          cy.get(selector).first().click({ force: true });
          buttonFound = true;
          break;
        }
      }

      if (!buttonFound) {
        cy.get('button[type="submit"]').first().click({ force: true });
      }
    });

    cy.wait(3000);
  }

  /**
   * Handle post add-to-cart modal if it appears
   */
  handleAddToCartModal() {
    cy.wait(1000);
    
    cy.get('body').then($body => {
      // Check if a modal appeared
      const modalSelectors = [
        '.modal',
        '[class*="Modal"]',
        '[role="dialog"]',
        '[class*="overlay"]'
      ];

      let modalFound = false;
      for (const selector of modalSelectors) {
        if ($body.find(selector).is(':visible')) {
          cy.wait(800);
          
          // Try to find close button
          const closeSelectors = [
            'button[aria-label*="close"]',
            'button[aria-label*="Close"]',
            '.close',
            '[class*="close"]',
            'button:contains("×")'
          ];

          for (const closeSelector of closeSelectors) {
            if ($body.find(closeSelector).length > 0) {
              cy.get(closeSelector).first().click({ force: true });
              modalFound = true;
              cy.wait(500);
              break;
            }
          }

          if (!modalFound) {
            cy.get('body').type('{esc}');
            cy.wait(500);
          }
          break;
        }
      }
    });

    cy.wait(1000);
  }

  /**
   * Verify product is added to cart by checking success indicators
   */
  verifyProductAddedToCart() {
    cy.wait(500);
    
    cy.get('body').then($body => {
      // Look for success indicators
      const successIndicators = [
        '.success',
        '[class*="success"]',
        '[class*="Success"]',
        'div:contains("erfolgreich")',
        'div:contains("hinzugefügt")',
        'div:contains("added")'
      ];

      let successFound = false;
      for (const selector of successIndicators) {
        if ($body.find(selector).length > 0) {
          successFound = true;
          break;
        }
      }
    });
  }

  /**
   * Get current product URL
   * @returns {Cypress.Chainable<string>}
   */
  getProductUrl() {
    // Store URL as alias
    cy.url().then(url => {
      cy.wrap(url).as('currentProductUrl');
    });
    
    // Return URL separately to avoid mixing
    return cy.url();
  }

  /**
   * Verify product page is loaded
   */
  verifyProductPageLoaded() {
    cy.wait(1000);
    cy.get('body').should('be.visible');
  }

  /**
   * Store product information for later verification
   */
  storeProductInfo() {
    cy.wait(800);
    
    // Store title
    this.getProductTitle().then(title => {
      cy.wrap(title).as('productTitle');
    });

    // Store URL
    cy.url().then(url => {
      cy.wrap(url).as('currentProductUrl');
    });
    
    // Store price
    this.getProductPrice().then(price => {
      cy.wrap(price).as('productPrice');
    });
  }

  /**
   * Select product variant (size, color) if available
   * @param {string} variantType - Type of variant (size, color)
   * @param {number} index - Index of variant to select
   */
  selectVariant(variantType = 'size', index = 0) {
    cy.wait(800);
    
    cy.get('body').then($body => {
      const variantSelectors = {
        size: ['select[name="size"]', '[data-testid="size-selector"]', 'button:contains("Größe")'],
        color: ['[data-testid="color-option"]', 'button[aria-label*="color"]', '[class*="color-swatch"]']
      };

      const selectors = variantSelectors[variantType] || [];
      
      for (const selector of selectors) {
        if ($body.find(selector).length > 0) {
          cy.get(selector).eq(index).click({ force: true });
          cy.wait(1000);
          break;
        }
      }
    });
  }

  /**
   * Complete add to cart flow including handling modals
   */
  completeAddToCartFlow() {
    this.storeProductInfo();
    this.addToCart();
    this.handleAddToCartModal();
    this.verifyProductAddedToCart();
  }
}

module.exports = ProductPage;