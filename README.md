# Westwing E-Commerce Test Automation

## Overview
Automated test suite for Westwing.de using Cypress and Cucumber (BDD).

## Features
- ✅ Cypress 13.x with Cucumber preprocessor
- ✅ Page Object Model design pattern
- ✅ BDD scenarios with Gherkin syntax
- ✅ Mochawesome HTML reports
- ✅ Multiple product category testing (Möbel, Wohnaccessoires, Leuchten)
- ✅ Cart functionality validation

## Tech Stack
- **Cypress**: E2E testing framework
- **Cucumber**: BDD test scenarios
- **Mochawesome**: HTML test reports
- **Page Objects**: Maintainable test structure

## Installation
```bash
npm install
```

## Running Tests

### Open Cypress Test Runner (Recommended)
```bash
npx cypress open
```
Then select Chrome browser and run your feature files.

### Run Tests in Headless Mode
```bash
npm test
```

### Run Specific Feature
```bash
npx cypress run --spec "cypress/e2e/features/shopping-cart.feature"
```

## Test Scenarios

### Shopping Cart Functionality
Tests the complete cart workflow across three product categories:
1. Navigate to category page (Möbel/Wohnaccessoires/Leuchten)
2. Select a product
3. Add product to cart
4. Verify product appears in cart
5. Verify cart icon updates with item count

## Project Structure
```
westwing-automation/
├── cypress/
│   ├── e2e/
│   │   ├── features/           # Cucumber feature files
│   │   └── step_definitions/   # Step implementation
│   ├── support/
│   │   ├── page-objects/       # Page Object Model
│   │   ├── commands.js         # Custom Cypress commands
│   │   └── e2e.js             # Global configuration
│   ├── screenshots/            # Test failure screenshots
│   └── videos/                # Test execution videos
├── cypress.config.js          # Cypress configuration
├── package.json
└── README.md
```

## Reports
HTML reports are generated in `cypress/reports/` after test execution.

## Known Limitations

### Bot Detection
Westwing.de employs enterprise-grade bot detection. The test suite implements several workarounds:
- Custom `visitWithoutWaiting` command to bypass load event timeouts
- Maximum stealth browser configuration
- Extended timeouts (5 minutes for page loads)
- Human-like delays between actions
- Direct URL navigation instead of clicking links

**For production use**: Recommend obtaining test environment credentials or API access from Westwing.

## Configuration

Key settings in `cypress.config.js`:
- `pageLoadTimeout`: 300000ms (5 minutes)
- `chromeWebSecurity`: false
- `experimentalModifyObstructiveThirdPartyCode`: true

## Best Practices Implemented
- ✅ Page Object Model for maintainability
- ✅ BDD with Gherkin for readable scenarios
- ✅ DRY principles (Don't Repeat Yourself)
- ✅ Comprehensive error handling
- ✅ Screenshot capture on failure
- ✅ Detailed logging for debugging

## Author
[Your Name]

## License
MIT