const { defineConfig } = require('cypress');
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor');
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.westwing.de',
    specPattern: 'cypress/e2e/features/**/*.feature',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1920,
    viewportHeight: 1080,
    video: false,
    
    // CRITICAL - These MUST be here
    chromeWebSecurity: false,
    pageLoadTimeout: 300000, // 5 MINUTES - Make sure this is HERE
    defaultCommandTimeout: 60000,
    requestTimeout: 60000,
    responseTimeout: 60000,
    
    retries: {
      runMode: 0,
      openMode: 0,
    },
    
    async setupNodeEvents(on, config) {
      on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.family === 'chromium') {
          launchOptions.args = launchOptions.args.filter(arg => 
            !arg.includes('automation')
          );
          
          launchOptions.args.push('--disable-blink-features=AutomationControlled');
          launchOptions.args.push('--no-sandbox');
          launchOptions.args.push('--disable-web-security');
        }
        
        return launchOptions;
      });

      await addCucumberPreprocessorPlugin(on, config);
      on('file:preprocessor', createBundler({
        plugins: [createEsbuildPlugin(config)],
      }));

      on('task', {
        log(message) { console.log(message); return null; },
        table(message) { console.table(message); return null; },
      });

      return config;
    },
  },
});