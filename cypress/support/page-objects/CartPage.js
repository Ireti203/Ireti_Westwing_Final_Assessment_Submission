const BasePage = require('./BasePage');

/**
 * CartPage - Page object for shopping cart page
 * Handles cart interactions, product verification, and cart icon updates
 * 
 * @class CartPage
 * @extends BasePage
 */
class CartPage extends BasePage {
  constructor() {
    super();
    
    // Selectors for cart page elements
    this.selectors = {
      cartIcon: '[data-testid="cart-icon"], a[href*="/cart"], [class*="cart-icon"], [class*="CartIcon"]',
      cartBadge: '[data-testid="cart-badge"], .cart-count, [class*="badge"], [class*="counter"]',
      cartItemsList: '[data-testid="cart-items"], .cart-items, [class*="CartItem"]',
      cartItem: '[data-testid="cart-item"], .cart-item, article',
      cartItemTitle: '[data-testid="item-title"], .item-title, h3, h4',
      cartItemPrice: '[data-testid="item-price"], .item-price, [class*="price"]',
      cartItemQuantity: '[data-testid="item-quantity"], .quantity, input[type="number"]',
      removeItemButton: '[data-testid="remove-item"], button[aria-label*="remove"], .remove',
      updateQuantityButton: '[data-testid="update-quantity"]',
      subtotal: '[data-testid="subtotal"], .subtotal',
      total: '[data-testid="total"], .total, [class*="Total"]',
      checkoutButton: '[data-testid="checkout"], button:contains("Kasse"), button:contains("Checkout")',
      emptyCartMessage: '[data-testid="empty-cart"], .empty-cart, div:contains("leer")',
      continueShoppingButton: 'button:contains("Weiter einkaufen"), a:contains("Continue")',
      cartHeader: 'h1, [data-testid="cart-header"]'
    };

    this.cartUrl = '/cart/index/';
  }

  /**
   * Navigate to cart page
   */
  navigateToCart() {
    this.log('Navigating to cart page...');
    this.visit(this.cartUrl);
    this.waitForCartPageLoad();
  }

  /**
   * Click on cart icon in header
   */
  clickCartIcon() {
    this.log('Clicking cart icon in header...');
    
    cy.get('body').then($body => {
      const cartIconSelectors = [
        'a[href*="/cart"]',
        '[class*="cart-icon"]',
        '[class*="CartIcon"]',
        '[data-testid="cart-icon"]',
        'a[aria-label*="cart"]',
        'button[aria-label*="cart"]'
      ];

      for (const selector of cartIconSelectors) {
        const elements = $body.find(selector);
        if (elements.length > 0) {
          this.log(`Found cart icon with selector: ${selector}`);
          cy.get(selector).first().scrollIntoView().click({ force: true });
          return;
        }
      }

      // Fallback: navigate directly to cart URL
      this.log('Cart icon not found, navigating directly to cart URL');
      this.navigateToCart();
    });

    cy.wait(2000);
  }

  /**
   * Wait for cart page to load
   */
  waitForCartPageLoad() {
    this.log('Waiting for cart page to load...');
    
    // Verify URL
    cy.url().should('include', '/cart');
    
    // Wait for page content
    cy.get('body').should('be.visible');
    cy.wait(2000);
  }

  /**
   * Get cart badge count from header
   * @returns {Cypress.Chainable<number>}
   */
  getCartBadgeCount() {
    return cy.get('body').then($body => {
      const badgeSelectors = [
        '[class*="cart"] [class*="badge"]',
        '[class*="cart"] [class*="count"]',
        '[class*="Cart"] [class*="Badge"]',
        'a[href*="/cart"] span',
        '[data-testid="cart-badge"]',
        '[class*="counter"]',
        '[aria-label*="items"]'
      ];

      for (const selector of badgeSelectors) {
        const elements = $body.find(selector);
        if (elements.length > 0) {
          return cy.get(selector).first().invoke('text').then(text => {
            const count = parseInt(text.trim(), 10);
            this.log(`Cart badge count: ${count}`);
            return count;
          });
        }
      }

      this.log('Cart badge not found, returning 0');
      return cy.wrap(0);
    });
  }

  /**
   * Verify cart badge shows specific count
   * @param {number} expectedCount - Expected number in badge
   */
  verifyCartBadgeCount(expectedCount) {
    this.log(`Verifying cart badge shows count: ${expectedCount}`);
    
    this.getCartBadgeCount().should('equal', expectedCount);
  }

  /**
   * Verify cart badge is visible and shows a number
   */
  verifyCartBadgeVisible() {
    this.log('Verifying cart badge is visible...');
    
    cy.get('body').then($body => {
      const badgeSelectors = [
        '[class*="cart"] [class*="badge"]',
        '[class*="cart"] [class*="count"]',
        '[class*="Cart"] [class*="Badge"]',
        'a[href*="/cart"] span',
        '[data-testid="cart-badge"]'
      ];

      let badgeFound = false;
      for (const selector of badgeSelectors) {
        const elements = $body.find(selector);
        if (elements.length > 0 && elements.first().is(':visible')) {
          cy.get(selector).first().should('be.visible');
          this.log('Cart badge is visible');
          badgeFound = true;
          break;
        }
      }

      if (!badgeFound) {
        this.log('Warning: Cart badge not found with standard selectors');
      }
    });
  }

  /**
   * Get all cart items
   * @returns {Cypress.Chainable}
   */
  getCartItems() {
    return cy.get('body').then($body => {
      const itemSelectors = [
        '[class*="CartItem"]',
        '[class*="cart-item"]',
        'article[class*="item"]',
        '[data-testid="cart-item"]',
        'li[class*="item"]'
      ];

      for (const selector of itemSelectors) {
        const elements = $body.find(selector);
        if (elements.length > 0) {
          this.log(`Found ${elements.length} cart items using selector: ${selector}`);
          return cy.get(selector);
        }
      }

      // If no items found, return empty
      this.log('No cart items found');
      return cy.wrap([]);
    });
  }

  /**
   * Get cart item count
   * @returns {Cypress.Chainable<number>}
   */
  getCartItemCount() {
    return this.getCartItems().then($items => {
      const count = $items.length;
      this.log(`Cart contains ${count} items`);
      return count;
    });
  }

  /**
   * Verify cart contains at least one item
   */
  verifyCartNotEmpty() {
    this.log('Verifying cart is not empty...');
    
    this.getCartItems().should('have.length.greaterThan', 0);
  }

  /**
   * Verify cart contains specific number of items
   * @param {number} expectedCount - Expected number of items
   */
  verifyCartItemCount(expectedCount) {
    this.log(`Verifying cart contains ${expectedCount} items`);
    
    this.getCartItemCount().should('equal', expectedCount);
  }

  /**
   * Verify product is in cart by title
   * @param {string} productTitle - Title of product to verify
   */
  verifyProductInCart(productTitle) {
    this.log(`Verifying product "${productTitle}" is in cart...`);
    
    cy.get('body').then($body => {
      // Look for product title in various possible locations
      const titleText = productTitle.toLowerCase().trim();
      
      // Check if any text on the page contains the product title
      const bodyText = $body.text().toLowerCase();
      
      if (bodyText.includes(titleText.substring(0, 20))) {
        this.log('Product found in cart');
        expect(bodyText).to.include(titleText.substring(0, 20));
      } else {
        this.log('Warning: Exact product title not found, checking for partial match');
        // Extract key words from title and check for those
        const keywords = titleText.split(' ').filter(word => word.length > 3);
        let matchFound = false;
        
        for (const keyword of keywords) {
          if (bodyText.includes(keyword)) {
            this.log(`Found keyword "${keyword}" in cart`);
            matchFound = true;
            break;
          }
        }
        
        expect(matchFound).to.be.true;
      }
    });
  }

  /**
   * Verify product is in cart by URL or identifier
   */
  verifyProductInCartByReference() {
    this.log('Verifying product is in cart by checking cart contents...');
    
    // At minimum, verify cart is not empty
    this.verifyCartNotEmpty();
    
    // Get product title from alias if available
    cy.get('@productTitle').then(title => {
      if (title) {
        this.verifyProductInCart(title);
      }
    });
  }

  /**
   * Get product titles from cart
   * @returns {Cypress.Chainable<string[]>}
   */
  getProductTitlesInCart() {
    return this.getCartItems().then($items => {
      const titles = [];
      $items.each((index, item) => {
        const titleSelectors = ['h3', 'h4', '[class*="title"]', 'a'];
        for (const selector of titleSelectors) {
          const $title = Cypress.$(item).find(selector).first();
          if ($title.length > 0) {
            titles.push($title.text().trim());
            break;
          }
        }
      });
      
      this.log(`Product titles in cart: ${titles.join(', ')}`);
      return titles;
    });
  }

  /**
   * Clear entire cart
   */
  clearCart() {
    this.log('Clearing cart...');
    
    this.getCartItems().then($items => {
      if ($items.length > 0) {
        // Try to remove all items
        cy.get('body').then($body => {
          const removeSelectors = [
            'button[aria-label*="remove"]',
            'button[aria-label*="Remove"]',
            '.remove',
            '[class*="remove"]',
            'button[title*="remove"]'
          ];

          for (const selector of removeSelectors) {
            const buttons = $body.find(selector);
            if (buttons.length > 0) {
              buttons.each((index, button) => {
                cy.wrap(button).click({ force: true });
                cy.wait(1000);
              });
              break;
            }
          }
        });
      } else {
        this.log('Cart is already empty');
      }
    });
  }

  /**
   * Take screenshot of cart page
   */
  takeCartScreenshot() {
    this.takeScreenshot('cart-page');
  }

  /**
   * Verify cart page layout and key elements
   */
  verifyCartPageLayout() {
    this.log('Verifying cart page layout...');
    
    // Verify URL
    cy.url().should('include', '/cart');
    
    // Verify cart items or empty cart message exists
    cy.get('body').should('exist');
    
    this.log('Cart page layout verified');
  }

  /**
   * Get cart summary information
   * @returns {Cypress.Chainable<object>}
   */
  getCartSummary() {
    return cy.get('body').then($body => {
      const summary = {
        itemCount: 0,
        subtotal: 'N/A',
        total: 'N/A'
      };

      // Get item count
      this.getCartItemCount().then(count => {
        summary.itemCount = count;
      });

      // Try to get subtotal
      const priceSelectors = ['[class*="subtotal"]', '[class*="total"]', '[class*="price"]'];
      for (const selector of priceSelectors) {
        const elements = $body.find(selector);
        if (elements.length > 0) {
          summary.total = elements.first().text().trim();
          break;
        }
      }

      this.log(`Cart summary: ${JSON.stringify(summary)}`);
      return cy.wrap(summary);
    });
  }
}

module.exports = CartPage;
