const BasePage = require('./BasePage');

class CategoryPage extends BasePage {
  constructor() {
    super();
    
    this.selectors = {
      productLink: 'a[href*="/products/"], a[href*="/p/"]',
      productCard: '[data-test*="product"], article',
      grid: '.grid, [class*="grid"]'
    };

    this.categories = {
      moebel: {
        path: '/moebel/',
        name: 'Möbel',
        description: 'Furniture category'
      },
      wohnaccessoires: {
        path: '/wohnaccessoires/',
        name: 'Wohnaccessoires',
        description: 'Home accessories category'
      },
      leuchten: {
        path: '/leuchten/',
        name: 'Leuchten',
        description: 'Lighting category'
      }
    };
  }

  visitCategory(categoryKey) {
    const category = this.categories[categoryKey];
    if (!category) {
      throw new Error(`Category '${categoryKey}' not found`);
    }
    
    this.log(`Navigating to: ${category.name}`);
    this.visit(category.path);
    
    // Wait for Vue.js to render
    cy.wait(8000);
    
    // Handle cookie consent
    this.handleCookieConsent();
    
    // Wait more and scroll to trigger lazy loading
    cy.wait(3000);
    cy.scrollTo(0, 800, { duration: 1000 });
    cy.wait(3000);
    
    this.log('Category page loaded');
  }

  waitForProductsToLoad() {
    this.log('Waiting for products...');
    cy.wait(5000);
    cy.get('body').should('be.visible');
  }

  // SIMPLIFIED - Just get all links, no filtering
  getAllLinks() {
    this.log('Getting all links on page...');
    return cy.get('a[href]');
  }

  // COMPLETELY REWRITTEN - No .then() callback with multiple cy commands
  selectRandomProduct(index = null) {
    this.log('Selecting random product...');
    
    cy.wait(2000); // Human-like pause
    
    // Get all links
    cy.get('a[href]').then($links => {
      const productLinks = [];
      
      // Filter for product links - STRICT FILTERING
      $links.each((i, link) => {
        const href = link.getAttribute('href');
        
        // Skip invalid URLs
        if (!href || href === '/' || href === '#' || href.includes('javascript:')) {
          return;
        }
        
        // CRITICAL: Skip external domains
        if (href.includes('support.westwing.com') || 
            href.includes('help.') || 
            href.includes('blog.') ||
            href.startsWith('http://') ||
            href.startsWith('https://')) {
          return; // Skip all external and absolute URLs
        }
        
        // STRICT: Must match actual product URL patterns
        // Looking for URLs like: /produkt-name-123456.html or /products/name or similar
        const isProductUrl = 
          // Pattern 1: Ends with numbers and .html (e.g., /lampe-123456.html)
          (href.match(/\/[\w-]+-\d+\.html$/) !== null) ||
          // Pattern 2: Contains /products/ or /produkte/
          href.includes('/products/') ||
          href.includes('/produkte/');
        
        // EXCLUDE common non-product pages
        const isExcluded = 
          href.includes('/login') ||
          href.includes('/account') ||
          href.includes('/help') ||
          href.includes('/cart') ||
          href.includes('/customer') ||
          href.includes('/warranty') ||
          href.includes('/stores') ||
          href.includes('/about') ||
          href.includes('/contact') ||
          href.includes('/agb') ||
          href.includes('/datenschutz') ||
          href.includes('/impressum') ||
          href.includes('/support') ||
          href.includes('/hc/') ||
          href.includes('/articles/') ||
          href === '/p/stores/';
        
        if (isProductUrl && !isExcluded && href.startsWith('/')) {
          productLinks.push(href);
        }
      });
      
      if (productLinks.length === 0) {
        this.log('No product links found with strict filtering, trying broader search...');
        
        // Fallback: Look for links with product-like patterns
        $links.each((i, link) => {
          const href = link.getAttribute('href');
          
          // Skip external URLs completely
          if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
            return;
          }
          
          // Must start with / and contain a dash and numbers
          if (href && 
              href.startsWith('/') && 
              href !== '/' &&
              href.includes('-') &&
              /\d/.test(href) && // Contains at least one digit
              !href.includes('/cart') &&
              !href.includes('/customer') &&
              !href.includes('/account') &&
              !href.includes('/login') &&
              !href.includes('/help') &&
              !href.includes('/support') &&
              !href.includes('/hc/') &&
              !href.includes('/articles/') &&
              !href.includes('/warranty') &&
              !href.includes('/stores') &&
              !href.includes('/about')) {
            productLinks.push(href);
          }
        });
      }
      
      if (productLinks.length === 0) {
        throw new Error('No product links found on page');
      }
      
      this.log(`Found ${productLinks.length} potential product links`);
      
      // Select random index from first 5 products
      const selectedIndex = index !== null ? index : Math.floor(Math.random() * Math.min(productLinks.length, 5));
      const selectedUrl = productLinks[selectedIndex];
      
      this.log(`Selected URL at index ${selectedIndex}: ${selectedUrl}`);
      
      // Store URL in Cypress alias
      cy.wrap(selectedUrl).as('selectedProductUrl');
      
      // Navigate to the URL with timeout handling
      cy.wait(2000);
      cy.visit(selectedUrl, { 
        failOnStatusCode: false,
        timeout: 120000 
      });
      cy.wait(3000);
    });
  }

  selectProductByIndex(index) {
    this.selectRandomProduct(index);
  }

  verifyCategoryLoaded(categoryKey) {
    const category = this.categories[categoryKey];
    this.getCurrentUrl().should('include', category.path);
    this.log(`Category '${category.name}' loaded`);
  }

  getCategoryName(categoryKey) {
    return this.categories[categoryKey]?.name || categoryKey;
  }

  scrollToLoadMore() {
    cy.scrollTo('bottom', { duration: 1000 });
    cy.wait(2000);
  }

  getProductCount() {
    return cy.get('a[href]').its('length');
  }

  // Keep this for backward compatibility
  getProducts() {
    this.log('Getting all links on page...');
    
    return cy.get('a[href]').then($links => {
      const productLinks = [];
      
      $links.each((i, link) => {
        const href = link.getAttribute('href');
        if (href && (
          href.includes('/products/') || 
          href.includes('/p/') ||
          href.match(/\/[a-z-]+\/[0-9]+/)
        )) {
          productLinks.push(link);
        }
      });
      
      this.log(`Found ${productLinks.length} potential product links`);
      
      if (productLinks.length === 0) {
        this.log('No product links found, using generic links');
        
        const filtered = [];
        $links.each((i, el) => {
          const href = el.getAttribute('href');
          if (href && 
             href !== '/' && 
             !href.includes('login') &&
             !href.includes('account') &&
             !href.includes('help') &&
             !href.includes('javascript:') &&
             href.startsWith('/')) {
            filtered.push(el);
          }
        });
        
        if (filtered.length === 0) {
          throw new Error('No usable links found on page');
        }
        
        this.log(`Using ${filtered.length} generic links`);
        return filtered;
      }
      
      return productLinks;
    });
  }
}

module.exports = CategoryPage;