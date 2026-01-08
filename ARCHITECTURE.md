# Architecture Documentation

## Overview

This document describes the architecture and design patterns used in the Westwing Now test automation framework.

## Design Principles

### 1. **Maintainability**
- Page Object Model for separation of concerns
- Clear naming conventions
- Comprehensive documentation
- Modular code structure

### 2. **Reusability**
- Base classes for common functionality
- Shared utilities and helpers
- Configurable test data
- Flexible selectors

### 3. **Scalability**
- Easy to add new test scenarios
- Support for multiple categories
- Extensible page object architecture
- Parallel execution ready

### 4. **Reliability**
- Multiple selector strategies
- Automatic retry mechanisms
- Comprehensive error handling
- Robust wait strategies

## Architecture Layers

```
┌─────────────────────────────────────┐
│     Test Scenarios (BDD/Gherkin)    │  ← Human-readable test cases
├─────────────────────────────────────┤
│       Step Definitions (Glue)       │  ← Maps Gherkin to actions
├─────────────────────────────────────┤
│     Page Objects (Abstraction)      │  ← Business logic & interactions
├─────────────────────────────────────┤
│    Cypress Commands (Core Actions)  │  ← Low-level browser interactions
├─────────────────────────────────────┤
│           Cypress Core              │  ← Test runner & framework
└─────────────────────────────────────┘
```

## Component Details

### 1. Feature Files (BDD Layer)

**Location**: `cypress/e2e/features/`

**Purpose**: Define test scenarios in human-readable Gherkin syntax

**Structure**:
```gherkin
Feature: High-level feature description
  Background: Common setup steps
  
  @tags
  Scenario: Specific test case
    Given [precondition]
    When [action]
    Then [expected outcome]
```

**Benefits**:
- Non-technical stakeholders can understand tests
- Living documentation
- Behavior-driven development
- Clear test intent

### 2. Step Definitions (Glue Layer)

**Location**: `cypress/e2e/step_definitions/`

**Purpose**: Map Gherkin steps to actual test code

**Structure**:
```javascript
const { Given, When, Then } = require('@badeball/cypress-cucumber-preprocessor');

Given('I am on the homepage', () => {
  // Implementation
});

When('I click the button', () => {
  // Implementation
});

Then('I should see the result', () => {
  // Verification
});
```

**Responsibilities**:
- Parse Gherkin parameters
- Call page object methods
- Handle test state
- Coordinate test flow

### 3. Page Objects (Abstraction Layer)

**Location**: `cypress/support/page-objects/`

**Purpose**: Encapsulate page-specific logic and selectors

**Hierarchy**:
```
BasePage (Abstract)
├── CategoryPage
├── ProductPage
├── CartPage
└── [Future pages...]
```

**BasePage Responsibilities**:
- Common navigation methods
- Generic element interactions
- Wait utilities
- Logging and debugging
- Cookie handling

**Specialized Page Responsibilities**:
- Page-specific selectors
- Business logic methods
- Data extraction
- Page-specific validations

### 4. Support Files

#### Commands (`cypress/support/commands.js`)

Custom Cypress commands for reusable actions:
```javascript
Cypress.Commands.add('safeClick', (selector) => {
  cy.get(selector)
    .should('be.visible')
    .and('not.be.disabled')
    .click();
});
```

#### E2E Configuration (`cypress/support/e2e.js`)

Global test configuration:
- Error handling
- Test lifecycle hooks
- Global before/after
- Imports and setup

## Data Flow

```
User Request (Gherkin)
        ↓
Step Definition
        ↓
Page Object Method
        ↓
Cypress Command
        ↓
Browser Action
        ↓
Result Verification
        ↓
Report Generation
```

## Selector Strategy

### Priority Order

1. **Test-specific attributes** (Highest priority)
   ```javascript
   '[data-testid="add-to-cart"]'
   ```

2. **Semantic HTML** (Preferred)
   ```javascript
   'button[type="submit"]'
   'a[href="/cart"]'
   ```

3. **Class names** (Acceptable)
   ```javascript
   '.btn-primary'
   '.product-card'
   ```

4. **Text content** (Last resort)
   ```javascript
   'button:contains("Add to Cart")'
   ```

### Fallback Strategy

```javascript
const selectors = [
  '[data-testid="primary"]',  // Try first
  '.class-name',              // Fallback
  'button[type="submit"]'     // Last resort
];

for (const selector of selectors) {
  if (elementExists(selector)) {
    return cy.get(selector);
  }
}
```

## Error Handling

### Levels

1. **Page Object Level**: Graceful degradation
   ```javascript
   try {
     this.clickElement(selector);
   } catch (error) {
     this.log('Element not found, trying alternative');
     this.clickElement(alternativeSelector);
   }
   ```

2. **Step Definition Level**: Test state management
   ```javascript
   When('action', () => {
     try {
       pageObject.performAction();
     } catch (error) {
       cy.screenshot('error-state');
       throw error;
     }
   });
   ```

3. **Global Level**: Uncaught exceptions
   ```javascript
   Cypress.on('uncaught:exception', (err) => {
     console.log('Uncaught exception:', err.message);
     return false; // Don't fail test
   });
   ```

## Wait Strategies

### Explicit Waits (Preferred)
```javascript
cy.get(selector, { timeout: 10000 })
  .should('be.visible');
```

### Implicit Waits (When necessary)
```javascript
cy.wait(2000); // For animations or API calls
```

### Smart Waits
```javascript
cy.get(selector)
  .should('exist')
  .and('be.visible')
  .and('not.be.disabled');
```

## State Management

### Test State Object
```javascript
let testState = {
  productsAdded: 0,
  currentCategory: null,
  selectedProducts: []
};
```

### Cypress Aliases
```javascript
cy.wrap(productTitle).as('productTitle');
// Later...
cy.get('@productTitle').then(title => {
  // Use stored value
});
```

## Reporting Architecture

### Report Types

1. **Cucumber HTML Report**
   - Generated from cucumber-json
   - Interactive and visual
   - Best for stakeholders

2. **Mochawesome Report**
   - Built-in Cypress reporter
   - Technical details
   - Good for developers

3. **JSON Summary**
   - Machine-readable
   - CI/CD integration
   - Programmatic access

### Report Generation Flow

```
Test Execution
      ↓
Cucumber JSON (raw data)
      ↓
Report Generator Script
      ↓
Multiple Report Formats
      ↓
Artifact Storage
```

## Configuration Management

### Cypress Config (`cypress.config.js`)

- Base URL
- Timeouts
- Viewport settings
- Video/screenshot options
- Browser settings
- Preprocessor configuration

### Cucumber Config (`.cypress-cucumber-preprocessorrc.json`)

- JSON output location
- Step definition paths
- Report settings

### Package Config (`package.json`)

- Dependencies
- Scripts
- Project metadata

## Extensibility

### Adding New Categories

1. Update CategoryPage:
   ```javascript
   this.categories = {
     newCategory: {
       path: '/path/',
       name: 'Display Name'
     }
   };
   ```

2. Add test scenario:
   ```gherkin
   Scenario: Test new category
     Given I navigate to "newCategory"
   ```

### Adding New Pages

1. Create new page object:
   ```javascript
   class NewPage extends BasePage {
     constructor() {
       super();
       this.selectors = { /* ... */ };
     }
   }
   ```

2. Use in step definitions:
   ```javascript
   const newPage = new NewPage();
   newPage.performAction();
   ```

### Adding New Commands

1. Add to commands.js:
   ```javascript
   Cypress.Commands.add('customCommand', () => {
     // Implementation
   });
   ```

2. Use in tests:
   ```javascript
   cy.customCommand();
   ```

## Best Practices Implementation

### DRY (Don't Repeat Yourself)
- Shared methods in BasePage
- Reusable step definitions
- Common selectors in config

### SOLID Principles
- **Single Responsibility**: Each page object handles one page
- **Open/Closed**: Extensible via inheritance
- **Liskov Substitution**: All pages can replace BasePage
- **Interface Segregation**: Focused page methods
- **Dependency Inversion**: Depend on abstractions (BasePage)

### Test Pyramid
```
      /\      E2E (This Framework)
     /  \     Integration
    /____\    Unit
```

Our focus: Critical user journeys at E2E level

## Performance Considerations

### Optimization Strategies

1. **Parallel Execution**: Multiple test files run concurrently
2. **Selective Testing**: Tag-based execution
3. **Efficient Waits**: Smart timeouts
4. **Resource Management**: Clear cache between tests
5. **Video Optimization**: Compression enabled

### Trade-offs

- **Stability vs Speed**: Prefer stable tests
- **Retry vs Fast-fail**: 1 retry for flaky tests
- **Video Recording**: Enabled for debugging

## Security Considerations

- No credentials in code
- Environment variables for secrets
- HTTPS only
- No sensitive data in reports

## Future Enhancements

### Planned Features

1. **Visual Regression Testing**: Screenshot comparison
2. **API Testing Integration**: Backend validation
3. **Performance Metrics**: Load time tracking
4. **Mobile Testing**: Responsive design validation
5. **Accessibility Testing**: A11y compliance

### Scalability Path

1. Add more categories
2. Expand to checkout flow
3. Add user account management
4. Multi-language support
5. Cross-browser matrix

## Conclusion

This architecture provides a solid foundation for maintaining and scaling the test automation framework. It balances flexibility with structure, making it easy to add new tests while maintaining existing ones.
