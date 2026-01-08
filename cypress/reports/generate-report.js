/**
 * Report Generator for Westwing Automation Tests
 * Generates multiple format reports from test execution
 */

const report = require('multiple-cucumber-html-reporter');
const fs = require('fs');
const path = require('path');

// Configuration
const reportDir = path.join(__dirname, '../reports');
const cucumberJsonDir = path.join(reportDir, 'cucumber-json');
const htmlReportDir = path.join(reportDir, 'html-cucumber');

/**
 * Ensure directory exists
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Get metadata for the report
 */
function getReportMetadata() {
  const now = new Date();
  return {
    timestamp: now.toISOString(),
    date: now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    time: now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })
  };
}

/**
 * Generate Cucumber HTML Report
 */
function generateCucumberReport() {
  console.log('\n===========================================');
  console.log('Generating Cucumber HTML Report...');
  console.log('===========================================\n');

  ensureDirectoryExists(htmlReportDir);

  const metadata = getReportMetadata();

  const reportOptions = {
    jsonDir: cucumberJsonDir,
    reportPath: htmlReportDir,
    reportName: 'Westwing Automation Test Report',
    pageTitle: 'Westwing Now - E2E Test Results',
    displayDuration: true,
    displayReportTime: true,
    durationInMS: true,
    
    metadata: {
      browser: {
        name: 'chrome',
        version: 'latest'
      },
      device: 'Desktop',
      platform: {
        name: 'Linux/Windows/Mac',
        version: 'Latest'
      }
    },

    customData: {
      title: 'Test Execution Information',
      data: [
        { label: 'Project', value: 'Westwing Now E-Commerce' },
        { label: 'Test Type', value: 'End-to-End Automation' },
        { label: 'Framework', value: 'Cypress + Cucumber BDD' },
        { label: 'Execution Date', value: metadata.date },
        { label: 'Execution Time', value: metadata.time },
        { label: 'Test Environment', value: 'Production (https://www.westwingnow.de)' },
        { label: 'Categories Tested', value: 'Möbel, Wohnaccessoires, Leuchten' }
      ]
    },

    pageFooter: `
      <div style="text-align: center; margin-top: 20px; padding: 20px; background-color: #f5f5f5;">
        <p><strong>Westwing Automation Test Suite</strong></p>
        <p>Automated E2E Testing Framework | Cypress + Cucumber</p>
        <p>Generated: ${metadata.timestamp}</p>
      </div>
    `,

    openReportInBrowser: false,
    disableLog: false,
    saveCollectedJSON: true
  };

  try {
    // Check if JSON report exists
    if (!fs.existsSync(cucumberJsonDir) || fs.readdirSync(cucumberJsonDir).length === 0) {
      console.error('❌ Error: No Cucumber JSON reports found in:', cucumberJsonDir);
      console.log('Make sure tests have been executed first.');
      return;
    }

    // Generate the report
    report.generate(reportOptions);

    console.log('\n✅ Cucumber HTML Report generated successfully!');
    console.log(`📊 Report location: ${htmlReportDir}`);
    console.log(`🌐 Open index.html in your browser to view the report\n`);

  } catch (error) {
    console.error('❌ Error generating report:', error.message);
    console.error(error.stack);
  }
}

/**
 * Generate summary JSON for CI/CD integration
 */
function generateSummaryJson() {
  console.log('Generating test summary JSON...');

  const summaryPath = path.join(reportDir, 'test-summary.json');
  const metadata = getReportMetadata();

  // Read cucumber JSON to extract summary
  const jsonFiles = fs.readdirSync(cucumberJsonDir)
    .filter(file => file.endsWith('.json'));

  if (jsonFiles.length === 0) {
    console.log('No JSON files found for summary');
    return;
  }

  let totalScenarios = 0;
  let passedScenarios = 0;
  let failedScenarios = 0;
  let totalSteps = 0;
  let passedSteps = 0;
  let failedSteps = 0;

  jsonFiles.forEach(file => {
    const filePath = path.join(cucumberJsonDir, file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    content.forEach(feature => {
      feature.elements.forEach(scenario => {
        totalScenarios++;
        
        let scenarioPassed = true;
        scenario.steps.forEach(step => {
          totalSteps++;
          if (step.result.status === 'passed') {
            passedSteps++;
          } else if (step.result.status === 'failed') {
            failedSteps++;
            scenarioPassed = false;
          }
        });

        if (scenarioPassed) {
          passedScenarios++;
        } else {
          failedScenarios++;
        }
      });
    });
  });

  const summary = {
    project: 'Westwing Now E2E Tests',
    timestamp: metadata.timestamp,
    date: metadata.date,
    time: metadata.time,
    testType: 'End-to-End',
    framework: 'Cypress + Cucumber',
    scenarios: {
      total: totalScenarios,
      passed: passedScenarios,
      failed: failedScenarios,
      passRate: totalScenarios > 0 ? ((passedScenarios / totalScenarios) * 100).toFixed(2) + '%' : '0%'
    },
    steps: {
      total: totalSteps,
      passed: passedSteps,
      failed: failedSteps,
      passRate: totalSteps > 0 ? ((passedSteps / totalSteps) * 100).toFixed(2) + '%' : '0%'
    },
    status: failedScenarios === 0 ? 'PASSED' : 'FAILED'
  };

  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  
  console.log('\n📋 Test Summary:');
  console.log('================');
  console.log(`Total Scenarios: ${summary.scenarios.total}`);
  console.log(`Passed: ${summary.scenarios.passed}`);
  console.log(`Failed: ${summary.scenarios.failed}`);
  console.log(`Pass Rate: ${summary.scenarios.passRate}`);
  console.log(`\nStatus: ${summary.status}\n`);
}

/**
 * Main execution
 */
function main() {
  try {
    ensureDirectoryExists(reportDir);
    ensureDirectoryExists(cucumberJsonDir);
    ensureDirectoryExists(htmlReportDir);

    generateCucumberReport();
    generateSummaryJson();

    console.log('===========================================');
    console.log('✅ All reports generated successfully!');
    console.log('===========================================\n');

  } catch (error) {
    console.error('❌ Fatal error in report generation:', error);
    process.exit(1);
  }
}

// Execute
main();
