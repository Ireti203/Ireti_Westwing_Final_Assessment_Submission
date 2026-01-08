// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/**
 * Custom command to handle cookie consent
 */
Cypress.Commands.add('acceptCookies', () => {
  cy.wait(2000);
  
  const cookieSelectors = [
    '[data-testid="uc-accept-all-button"]',
    '#uc-btn-accept-banner',
    'button:contains("Accept")',
    'button:contains("Akzeptieren")',
    'button:contains("Alle akzeptieren")',
    '.cookie-accept',
    '.accept-all'
  ];

  cookieSelectors.forEach(selector => {
    cy.get('body').then($body => {
      if ($body.find(selector).length > 0) {
        cy.get(selector).first().click({ force: true });
        cy.wait(1000);
      }
    });
  });
});

/**
 * Custom command to safely click element
 */
Cypress.Commands.add('safeClick', { prevSubject: 'element' }, (subject, options = {}) => {
  cy.wrap(subject)
    .scrollIntoView()
    .should('be.visible')
    .and('not.be.disabled')
    .click({ force: true, ...options });
});

/**
 * Custom command to get element with retry
 */
Cypress.Commands.add('getWithRetry', (selector, timeout = 10000) => {
  return cy.get(selector, { timeout });
});

/**
 * Custom command to check if element exists
 */
Cypress.Commands.add('elementExists', (selector) => {
  return cy.get('body').then($body => {
    return $body.find(selector).length > 0;
  });
});

/**
 * Custom command to wait for API response
 */
Cypress.Commands.add('waitForApi', (url, timeout = 30000) => {
  cy.intercept(url).as('apiCall');
  cy.wait('@apiCall', { timeout });
});

Cypress.Commands.add('visitWithoutWaiting', (url, options = {}) => {
  const defaultOptions = {
    failOnStatusCode: false,
    timeout: 300000,
    onBeforeLoad: (win) => {
      // Prevent page from blocking
      delete win.navigator.__proto__.webdriver;
    }
  };
  
  cy.visit(url, { ...defaultOptions, ...options });
  
  // Don't wait for load event - just wait for body
  cy.get('body', { timeout: 60000 }).should('exist');
});

/**
 * Custom command to log message to both Cypress and Node
 */
Cypress.Commands.add('logMessage', (message) => {
  cy.log(message);
  cy.task('log', message);
});

/**
 * Custom command to take full page screenshot with timestamp
 */
Cypress.Commands.add('captureScreen', (name) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  cy.screenshot(`${name}-${timestamp}`, { capture: 'fullPage' });
});

/**
 * Custom command to get text content safely
 */
Cypress.Commands.add('getTextContent', { prevSubject: 'element' }, (subject) => {
  return cy.wrap(subject).invoke('text').then(text => text.trim());
});

/**
 * Custom command to verify URL contains path
 */
Cypress.Commands.add('urlIncludes', (path) => {
  cy.url().should('include', path);
});

/**
 * Custom command to handle dynamic content loading
 */
Cypress.Commands.add('waitForContent', (selector, timeout = 10000) => {
  cy.get(selector, { timeout }).should('be.visible').and('not.be.empty');
});

/**
 * Custom command to scroll to bottom of page
 */
Cypress.Commands.add('scrollToBottom', () => {
  cy.scrollTo('bottom', { duration: 1000, easing: 'linear' });
  cy.wait(1000);
});

/**
 * Custom command to reload page with cache clear
 */
Cypress.Commands.add('hardReload', () => {
  cy.reload(true);
  cy.wait(2000);
});

/**
 * Custom command to verify element count
 */
Cypress.Commands.add('verifyElementCount', (selector, expectedCount) => {
  cy.get(selector).should('have.length', expectedCount);
});

/**
 * Custom command to find element by text content
 */
Cypress.Commands.add('findByText', (text) => {
  return cy.contains(text);
});

/**
 * Custom command to wait for page load complete
 */
Cypress.Commands.add('waitForPageLoad', () => {
  cy.document().should('have.property', 'readyState', 'complete');
  cy.wait(1000);
});
