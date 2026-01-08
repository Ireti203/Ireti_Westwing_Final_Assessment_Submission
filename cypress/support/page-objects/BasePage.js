/**
 * BasePage - Foundation class for all page objects
 * Provides common functionality and utilities used across all pages
 * 
 * @class BasePage
 */
class BasePage {
  /**
   * Visit a specific URL path
   * @param {string} path - The path to visit (relative to baseUrl)
   */
  visit(path = '') {
    cy.visit(path, { 
      failOnStatusCode: false,
      timeout: 120000, // 2 minutes timeout
      headers: {
        'Accept-Language': 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7'
      },
      onBeforeLoad(win) {
        // Additional bot protection bypass
        delete win.navigator.__proto__.webdriver;
      }
    });
    cy.wait(2000); // Human-like pause after navigation
    this.waitForPageLoad();
  }

  /**
   * Wait for the page to be fully loaded
   */
  waitForPageLoad() {
    // Simplified - just check body exists (don't wait for full readyState)
    cy.get('body', { timeout: 60000 }).should('exist');
    cy.wait(1000); // Additional stability wait
  }

  /**
   * Get element by data-testid attribute
   * @param {string} testId - The test id value
   * @returns {Cypress.Chainable}
   */
  getByTestId(testId) {
    return cy.get(`[data-testid="${testId}"]`);
  }

  /**
   * Get element with retry logic for dynamic content
   * @param {string} selector - CSS selector
   * @param {number} timeout - Maximum wait time
   * @returns {Cypress.Chainable}
   */
  getElementWithRetry(selector, timeout = 10000) {
    return cy.get(selector, { timeout });
  }

  /**
   * Click element with proper wait and verification
   * @param {string} selector - CSS selector
   */
  clickElement(selector) {
    cy.get(selector)
      .should('be.visible')
      .and('not.be.disabled');
    
    cy.wait(500); // Human-like pause before click
    
    // Simulate hover before click
    cy.get(selector).trigger('mouseover');
    cy.wait(200); // Brief hover pause
    
    cy.get(selector).click();
    cy.wait(500); // Wait after click
  }

  /**
   * Type text into input field
   * @param {string} selector - CSS selector
   * @param {string} text - Text to type
   */
  typeText(selector, text) {
    cy.get(selector)
      .should('be.visible')
      .clear();
    
    cy.wait(300); // Pause after clear
    
    // Type with human-like delay
    cy.get(selector).type(text, { delay: 100 }); // 100ms between keystrokes
  }

  /**
   * Verify element is visible
   * @param {string} selector - CSS selector
   */
  verifyElementVisible(selector) {
    cy.get(selector).should('be.visible');
  }

  /**
   * Verify element contains text
   * @param {string} selector - CSS selector
   * @param {string} text - Expected text
   */
  verifyElementText(selector, text) {
    cy.get(selector).should('contain.text', text);
  }

  /**
   * Wait for element to be visible
   * @param {string} selector - CSS selector
   * @param {number} timeout - Maximum wait time
   */
  waitForElement(selector, timeout = 10000) {
    cy.get(selector, { timeout }).should('be.visible');
  }

  /**
   * Scroll to element
   * @param {string} selector - CSS selector
   */
  scrollToElement(selector) {
    cy.get(selector).scrollIntoView({ duration: 500 }); // Smooth scroll duration
    cy.wait(500); // Wait after scroll
  }

  /**
   * Get current URL
   * @returns {Cypress.Chainable}
   */
  getCurrentUrl() {
    return cy.url();
  }

  /**
   * Reload the page
   */
  reloadPage() {
    cy.reload();
    cy.wait(2000); // Wait after reload
  }

  /**
   * Take a screenshot
   * @param {string} name - Screenshot name
   */
  takeScreenshot(name) {
    cy.screenshot(name, { capture: 'fullPage' });
  }

  /**
   * Handle cookie consent banners
   */
  handleCookieConsent() {
    cy.wait(2000); // Wait for cookie banner to appear
    
    // Multiple possible selectors for cookie accept buttons
    const cookieSelectors = [
      '[data-testid="uc-accept-all-button"]',
      '#uc-btn-accept-banner',
      'button:contains("Accept")',
      'button:contains("Akzeptieren")',
      'button:contains("Alle akzeptieren")',
      '.cookie-accept',
      '.accept-all',
      '[id*="accept"]',
      '[class*="accept"]'
    ];

    // Try to click any cookie accept button that exists
    cookieSelectors.forEach(selector => {
      cy.get('body').then($body => {
        if ($body.find(selector).length > 0) {
          cy.wait(500); // Pause before accepting cookies
          cy.get(selector).first().click({ force: true });
          cy.wait(1500); // Wait after accepting
        }
      });
    });
  }

  /**
   * Log message to Cypress console
   * @param {string} message - Message to log
   */
  log(message) {
    cy.log(message);
    cy.task('log', message, { log: false });
  }
}

module.exports = BasePage;