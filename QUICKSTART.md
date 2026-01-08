# Quick Start Guide

Get up and running with the Westwing Now test automation framework in 5 minutes!

## ⚡ Prerequisites

Make sure you have:
- ✅ Node.js 18.x or higher installed
- ✅ npm 8.x or higher installed
- ✅ Stable internet connection

Check versions:
```bash
node --version  # Should be v18.x or higher
npm --version   # Should be 8.x or higher
```

## 🚀 Installation (3 steps)

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd westwing-automation
```

### Step 2: Install Dependencies
```bash
npm install
```

This takes 1-2 minutes and installs:
- Cypress
- Cucumber preprocessor
- Reporters
- All other dependencies

### Step 3: Verify Installation
```bash
npx cypress verify
```

Expected output: `✔ Verified Cypress!`

## 🎮 Run Your First Test

### Option 1: Run All Tests (Headless)

```bash
npm test
```

This will:
- Run all test scenarios
- Execute in headless Chrome
- Generate reports
- Save videos and screenshots

**Time**: ~2-3 minutes

### Option 2: Interactive Mode (Recommended for First Time)

```bash
npm run cy:open
```

This opens Cypress Test Runner where you can:
1. Click "E2E Testing"
2. Select Chrome browser
3. Click on "shopping-cart.feature"
4. Watch tests run in real-time

**Perfect for**: Understanding what tests do

### Option 3: Run with Report Generation

```bash
npm run test:report
```

This will:
- Run all tests
- Generate comprehensive HTML reports
- Create test summary JSON

Then open the report:
```bash
# Open in browser
open cypress/reports/html-cucumber/index.html  # Mac
start cypress/reports/html-cucumber/index.html # Windows
xdg-open cypress/reports/html-cucumber/index.html # Linux
```

## 📋 What Gets Tested?

The framework tests shopping cart functionality across 3 product categories:

### Test Scenario Flow

```
1. Navigate to Category Page
   ↓
2. Select Random Product
   ↓
3. View Product Details
   ↓
4. Add Product to Cart
   ↓
5. Verify in Cart
   ↓
6. Verify Badge Updates
```

### Categories Tested

1. **Möbel** (Furniture)
2. **Wohnaccessoires** (Home Accessories)  
3. **Leuchten** (Lighting)

## 🎯 Common Commands

### Testing Commands

```bash
# Run all tests
npm test

# Run all tests with reports
npm run test:report

# Open interactive mode
npm run cy:open

# Run specific browser
npm run test:chrome
npm run test:firefox

# Run with video visible
npm run test:headed

# Run specific category
npm run test:tags "@moebel"
```

### Report Commands

```bash
# Generate reports from last run
npm run report:generate

# View report locations
echo cypress/reports/html-cucumber/index.html    # Cucumber report
echo cypress/reports/html/index.html             # Mochawesome report
echo cypress/reports/test-summary.json           # JSON summary
```

## 📂 Important Directories

After first run, you'll see:

```
westwing-automation/
├── cypress/
│   ├── reports/              # 📊 Test reports (open HTML files)
│   ├── screenshots/          # 📸 Failure screenshots
│   ├── videos/              # 🎥 Test execution videos
│   └── e2e/features/        # 📝 Test scenarios (human-readable)
```

## 🔍 Understanding Test Results

### Successful Test Run

```
✓ I am on the Westwing Now website
✓ I navigate to the "moebel" product category
✓ I select a random product from the category
✓ I add the product to my cart
✓ the product should be visible in my cart
✓ the cart icon should display a count of "1"

1 scenario (1 passed)
6 steps (6 passed)
```

### If Tests Fail

1. **Check screenshots**: `cypress/screenshots/`
2. **Watch videos**: `cypress/videos/`
3. **Review reports**: `cypress/reports/html-cucumber/index.html`

Common reasons:
- Network issues
- Website changes
- Timeout (can be adjusted in config)

## ⚙️ Quick Configuration Changes

### Change Timeout

Edit `cypress.config.js`:
```javascript
defaultCommandTimeout: 15000,  // Increase to 15 seconds
```

### Change Viewport

Edit `cypress.config.js`:
```javascript
viewportWidth: 1920,
viewportHeight: 1080,
```

### Disable Video Recording

Edit `cypress.config.js`:
```javascript
video: false,
```

## 🎓 Next Steps

### Learn the Framework

1. **Read test scenarios**: `cypress/e2e/features/shopping-cart.feature`
   - Written in plain English (Gherkin)
   - Easy to understand what tests do

2. **Explore page objects**: `cypress/support/page-objects/`
   - See how tests interact with website
   - Learn reusable patterns

3. **Check documentation**: 
   - `README.md` - Complete documentation
   - `ARCHITECTURE.md` - Design patterns
   - `CONTRIBUTING.md` - How to add tests

### Run Different Scenarios

```bash
# Test only furniture category
npm run test:tags "@moebel"

# Test only lighting
npm run test:tags "@leuchten"

# Test accessories
npm run test:tags "@wohnaccessoires"

# Run comprehensive test
npm run test:tags "@comprehensive"
```

### View Reports

After running tests:

```bash
# Cucumber HTML Report (Best for overview)
open cypress/reports/html-cucumber/index.html

# Mochawesome Report (Technical details)
open cypress/reports/html/index.html

# JSON Summary (For scripts/CI)
cat cypress/reports/test-summary.json
```

## 🐛 Troubleshooting

### "Cypress not found"

```bash
npm install
npx cypress install
```

### Tests timeout

Increase timeout in `cypress.config.js`:
```javascript
defaultCommandTimeout: 15000,
pageLoadTimeout: 90000,
```

### Network issues

Check internet connection and try:
```bash
npm test -- --config retries=2
```

### Can't find reports

Ensure tests ran successfully:
```bash
# Run with report generation
npm run test:report

# Check if files exist
ls cypress/reports/html-cucumber/
```

## 💡 Pro Tips

### Tip 1: Watch Tests in Action
```bash
npm run test:headed
```
See tests execute in visible browser window.

### Tip 2: Debug Mode
```bash
npm run cy:open
```
Then click on test file and watch step-by-step.

### Tip 3: Quick Category Test
```bash
npm run test:tags "@moebel"
```
Test just one category for quick feedback.

### Tip 4: Check Test Status
```bash
cat cypress/reports/test-summary.json
```
Quick pass/fail summary in terminal.

### Tip 5: Clean Start
```bash
rm -rf cypress/reports cypress/videos cypress/screenshots
npm test
```
Fresh test run with clean output.

## 📞 Getting Help

### Resources

- **README.md**: Full documentation
- **ARCHITECTURE.md**: How it works
- **CONTRIBUTING.md**: How to modify
- **Cypress Docs**: https://docs.cypress.io

### Common Questions

**Q: How long do tests take?**  
A: 2-3 minutes for all scenarios

**Q: Can I run tests in parallel?**  
A: Yes, with Cypress Cloud (premium)

**Q: How do I add new tests?**  
A: See CONTRIBUTING.md guide

**Q: Tests are flaky, what to do?**  
A: Check ARCHITECTURE.md for wait strategies

**Q: How to test on different browsers?**  
A: Use `npm run test:firefox` or `npm run test:chrome`

## ✅ Success Checklist

You're ready to go when:

- ✅ `npm install` completed successfully
- ✅ `npm test` runs without errors
- ✅ Reports generated in `cypress/reports/`
- ✅ Can open HTML reports in browser
- ✅ Understand basic test flow

## 🎉 You're All Set!

Now you can:
- Run tests reliably
- View comprehensive reports
- Understand test results
- Modify tests (see CONTRIBUTING.md)

Happy testing! 🚀

---

**Next**: Read [README.md](README.md) for complete documentation  
**Questions**: Check [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guides
