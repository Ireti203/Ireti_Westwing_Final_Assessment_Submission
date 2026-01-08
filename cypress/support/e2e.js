// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import './commands';
import 'cypress-mochawesome-reporter/register';

// MAXIMUM STEALTH MODE
Cypress.on('window:before:load', (win) => {
  // Remove all automation indicators
  Object.defineProperty(win.navigator, 'webdriver', {
    get: () => undefined,
    configurable: true
  });
  
  Object.defineProperty(win.navigator, 'plugins', {
    get: () => [1, 2, 3, 4, 5],
  });
  
  Object.defineProperty(win.navigator, 'languages', {
    get: () => ['de-DE', 'de', 'en-US', 'en'],
  });
  
  // Override permissions
  win.navigator.permissions.query = () => Promise.resolve({ state: 'granted' });
  
  // Remove chrome automation
  delete win.navigator.__proto__.webdriver;
  
  win.console.log('Test window loaded');
});

// Global error handling
Cypress.on('uncaught:exception', (err, runnable) => {
  console.log('Uncaught exception:', err.message);
  return false;
});

// Global hooks
before(() => {
  cy.log('========================================');
  cy.log('Starting Westwing Automation Test Suite');
  cy.log('========================================');
});

after(() => {
  cy.log('========================================');
  cy.log('Test Suite Completed');
  cy.log('========================================');
});

beforeEach(() => {
  const testTitle = Cypress.currentTest.title;
  cy.log(`Test: ${testTitle}`);
});

afterEach(() => {
  const testState = Cypress.currentTest.state;
  cy.log(`Test Result: ${testState}`);
});
