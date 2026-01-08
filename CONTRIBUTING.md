# Contributing Guide

Thank you for your interest in contributing to the Westwing Now Test Automation Framework! This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Commit Message Guidelines](#commit-message-guidelines)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors.

### Expected Behavior

- Be respectful and considerate
- Welcome newcomers
- Focus on what is best for the project
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information

## Getting Started

### Prerequisites

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/westwing-automation.git
   cd westwing-automation
   ```

3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/original-repo/westwing-automation.git
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Verify setup:
   ```bash
   npm test
   ```

### Development Environment

- **Node.js**: 18.x or higher
- **IDE**: VS Code recommended (with Cypress extension)
- **Browser**: Chrome, Firefox for testing

## Development Workflow

### 1. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or updates

### 2. Make Changes

- Write clean, maintainable code
- Follow existing patterns
- Add tests for new features
- Update documentation

### 3. Test Your Changes

```bash
# Run all tests
npm test

# Run specific tests
npm run cy:open

# Generate reports
npm run test:report
```

### 4. Commit Changes

```bash
git add .
git commit -m "type: description"
```

See [Commit Message Guidelines](#commit-message-guidelines) below.

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create Pull Request

- Go to GitHub
- Click "New Pull Request"
- Select your branch
- Fill in the PR template
- Submit for review

## Coding Standards

### JavaScript Style

#### Naming Conventions

```javascript
// Classes: PascalCase
class ProductPage extends BasePage { }

// Functions/Methods: camelCase
function getProductTitle() { }

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;

// Variables: camelCase
const productList = [];
```

#### Code Structure

```javascript
/**
 * Function description
 * @param {string} param - Parameter description
 * @returns {type} - Return value description
 */
function exampleFunction(param) {
  // Implementation
  return result;
}
```

### File Organization

```
NewFeature/
├── feature-file.feature       # Gherkin scenarios
├── feature-steps.js           # Step definitions
└── FeaturePage.js            # Page object
```

### Page Object Pattern

```javascript
const BasePage = require('./BasePage');

class NewPage extends BasePage {
  constructor() {
    super();
    
    // Define selectors
    this.selectors = {
      element: '[data-testid="element"]'
    };
  }

  // Public methods
  performAction() {
    this.log('Performing action...');
    this.clickElement(this.selectors.element);
  }

  // Verification methods
  verifyPageLoaded() {
    this.verifyElementVisible(this.selectors.element);
  }
}

module.exports = NewPage;
```

### Step Definition Pattern

```javascript
const { Given, When, Then } = require('@badeball/cypress-cucumber-preprocessor');
const PageObject = require('../support/page-objects/PageObject');

const pageObject = new PageObject();

Given('precondition', () => {
  cy.log('Step: Precondition');
  pageObject.setup();
});

When('action', () => {
  cy.log('Step: Action');
  pageObject.performAction();
});

Then('expected outcome', () => {
  cy.log('Step: Verify outcome');
  pageObject.verifyResult();
});
```

## Testing Guidelines

### Writing Test Scenarios

#### Good Scenario

```gherkin
@tag
Scenario: Clear description of what is being tested
  Given I am in a known state
  When I perform a specific action
  Then I should see the expected result
```

#### Scenario Best Practices

1. **Clear and Concise**: One scenario, one behavior
2. **Independent**: Can run in any order
3. **Repeatable**: Same result every time
4. **Fast**: Complete quickly
5. **Focused**: Test one thing well

#### Example

```gherkin
# ✅ Good
Scenario: User can add product to cart
  Given I am on a product page
  When I click the "Add to Cart" button
  Then the product appears in my cart

# ❌ Bad (too vague)
Scenario: Shopping
  Given I am on the website
  When I do shopping
  Then it works
```

### Writing Step Definitions

#### Best Practices

1. **Keep Steps Simple**: One action per step
2. **Use Page Objects**: Don't interact with Cypress directly
3. **Add Logging**: Help with debugging
4. **Handle Errors**: Graceful failure

#### Example

```javascript
// ✅ Good
When('I add the product to cart', () => {
  cy.log('Step: Adding product to cart');
  productPage.addToCart();
  productPage.verifyAddedToCart();
});

// ❌ Bad (too much logic in step)
When('I add product', () => {
  cy.get('.button').click();
  cy.wait(1000);
  cy.get('.modal').should('exist');
});
```

### Writing Page Objects

#### Best Practices

1. **Extend BasePage**: Reuse common functionality
2. **Define Selectors**: Keep them organized
3. **Public Methods Only**: Hide implementation details
4. **Meaningful Names**: Clear method purposes
5. **Add JSDoc Comments**: Document methods

#### Example

```javascript
class ProductPage extends BasePage {
  constructor() {
    super();
    this.selectors = {
      addToCartBtn: '[data-testid="add-to-cart"]',
      productTitle: 'h1'
    };
  }

  /**
   * Add product to shopping cart
   */
  addToCart() {
    this.log('Adding product to cart');
    this.clickElement(this.selectors.addToCartBtn);
  }

  /**
   * Get product title
   * @returns {Cypress.Chainable<string>}
   */
  getTitle() {
    return cy.get(this.selectors.productTitle)
      .invoke('text')
      .then(text => text.trim());
  }
}
```

## Pull Request Process

### PR Checklist

Before submitting:

- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] Commit messages follow guidelines
- [ ] No merge conflicts
- [ ] Screenshots/videos for UI changes

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Tests pass locally
- [ ] Added new tests
- [ ] Updated existing tests

## Screenshots/Videos
(if applicable)

## Checklist
- [ ] Code follows style guide
- [ ] Documentation updated
- [ ] Tests added/updated
```

### Review Process

1. **Automated Checks**: CI must pass
2. **Code Review**: At least one approval required
3. **Testing**: Reviewer tests changes
4. **Approval**: Merge when approved

## Commit Message Guidelines

### Format

```
type(scope): subject

body

footer
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `test`: Test additions/updates
- `chore`: Maintenance tasks

### Examples

```bash
# Feature
feat(cart): add cart badge update functionality

# Bug fix
fix(product): resolve product selection issue

# Documentation
docs(readme): update installation instructions

# Refactoring
refactor(pages): simplify selector strategy

# Test
test(cart): add cart verification tests
```

### Good Commit Messages

```bash
# ✅ Good
feat(category): add support for carpet category
fix(selectors): update product card selector
docs(architecture): add selector strategy section

# ❌ Bad
update stuff
fix bug
changes
```

## Adding New Features

### 1. New Test Scenario

```gherkin
# File: cypress/e2e/features/new-feature.feature
Feature: New Feature
  Scenario: Test new functionality
    Given precondition
    When action
    Then result
```

### 2. Step Definitions

```javascript
// File: cypress/e2e/step_definitions/new-feature.steps.js
Given('precondition', () => {
  // Implementation
});
```

### 3. Page Object

```javascript
// File: cypress/support/page-objects/NewPage.js
class NewPage extends BasePage {
  // Implementation
}
```

### 4. Documentation

Update:
- README.md (if needed)
- ARCHITECTURE.md (if significant)
- This file (if process changes)

## Common Pitfalls

### 1. Hard-coded Waits

```javascript
// ❌ Bad
cy.wait(5000);

// ✅ Good
cy.get(selector, { timeout: 5000 })
  .should('be.visible');
```

### 2. Brittle Selectors

```javascript
// ❌ Bad
cy.get('div > div > span.text');

// ✅ Good
cy.get('[data-testid="product-title"]');
```

### 3. No Error Handling

```javascript
// ❌ Bad
cy.get(selector).click();

// ✅ Good
cy.get(selector)
  .should('be.visible')
  .and('not.be.disabled')
  .click();
```

## Getting Help

### Resources

- **Documentation**: Read README.md and ARCHITECTURE.md
- **Examples**: Check existing tests
- **Cypress Docs**: https://docs.cypress.io
- **Cucumber Docs**: https://cucumber.io/docs

### Communication

- **Issues**: For bug reports and feature requests
- **Discussions**: For questions and ideas
- **Pull Requests**: For code contributions

## Recognition

Contributors will be recognized in:
- Project README.md
- Release notes
- Project documentation

Thank you for contributing! 🎉
