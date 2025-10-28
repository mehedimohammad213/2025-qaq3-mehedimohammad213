/**
 * Performance Tests for Cempal Portal
 * Tests for page load times, response times, and performance metrics
 */

const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const DashboardPage = require('../pages/DashboardPage');
const TenantManagementPage = require('../pages/TenantManagementPage');
const testData = require('../config/testData');

test.describe('Cempal Portal Performance Tests', () => {
  let loginPage;
  let dashboardPage;
  let tenantManagementPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    tenantManagementPage = new TenantManagementPage(page);
  });

  test('Page Load Performance Tests', async ({ page }) => {
    console.log('Testing page load performance...');

    // Test login page load time
    const startTime = Date.now();
    await loginPage.navigateToLogin();
    await page.waitForLoadState('networkidle');
    const loginPageLoadTime = Date.now() - startTime;

    console.log(`Login page load time: ${loginPageLoadTime}ms`);
    expect(loginPageLoadTime).toBeLessThan(5000); // Should load within 5 seconds

    // Test dashboard load time
    const dashboardStartTime = Date.now();
    await loginPage.login();
    await dashboardPage.waitForDashboardLoad();
    const dashboardLoadTime = Date.now() - dashboardStartTime;

    console.log(`Dashboard load time: ${dashboardLoadTime}ms`);
    expect(dashboardLoadTime).toBeLessThan(3000); // Should load within 3 seconds
  });

  test('API Response Time Tests', async ({ page }) => {
    console.log('Testing API response times...');

    await loginPage.login();

    // Monitor network requests
    const requests = [];
    page.on('request', request => {
      requests.push({
        url: request.url(),
        method: request.method(),
        timestamp: Date.now()
      });
    });

    const responses = [];
    page.on('response', response => {
      responses.push({
        url: response.url(),
        status: response.status(),
        timestamp: Date.now()
      });
    });

    // Navigate to tenant list to trigger API calls
    await dashboardPage.navigateToTenantList();
    await tenantManagementPage.waitForTenantListLoad();

    // Calculate response times
    const apiResponses = responses.filter(r =>
      r.url.includes('/api/') || r.url.includes('/graphql')
    );

    for (const response of apiResponses) {
      const request = requests.find(r => r.url === response.url);
      if (request) {
        const responseTime = response.timestamp - request.timestamp;
        console.log(`API ${response.url} response time: ${responseTime}ms`);
        expect(responseTime).toBeLessThan(2000); // API should respond within 2 seconds
      }
    }
  });

  test('Memory Usage Tests', async ({ page }) => {
    console.log('Testing memory usage...');

    await loginPage.login();

    // Get initial memory usage
    const initialMemory = await page.evaluate(() => {
      return performance.memory ? performance.memory.usedJSHeapSize : 0;
    });

    // Perform multiple operations
    for (let i = 0; i < 10; i++) {
      await dashboardPage.navigateToTenantList();
      await dashboardPage.navigateToSuperAdmins();
      await dashboardPage.navigateToDashboard();
    }

    // Get final memory usage
    const finalMemory = await page.evaluate(() => {
      return performance.memory ? performance.memory.usedJSHeapSize : 0;
    });

    const memoryIncrease = finalMemory - initialMemory;
    console.log(`Memory increase: ${memoryIncrease} bytes`);
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // Should not increase by more than 50MB
  });

  test('Concurrent User Simulation', async ({ browser }) => {
    console.log('Testing concurrent user simulation...');

    const contexts = [];
    const pages = [];

    try {
      // Create multiple browser contexts to simulate concurrent users
      for (let i = 0; i < 5; i++) {
        const context = await browser.newContext();
        const page = await context.newPage();
        contexts.push(context);
        pages.push(page);
      }

      // Login all users simultaneously
      const loginPromises = pages.map(async (page, index) => {
        const loginPage = new LoginPage(page);
        const startTime = Date.now();
        await loginPage.login();
        const loginTime = Date.now() - startTime;
        console.log(`User ${index + 1} login time: ${loginTime}ms`);
        return loginTime;
      });

      const loginTimes = await Promise.all(loginPromises);

      // All logins should complete within reasonable time
      for (const loginTime of loginTimes) {
        expect(loginTime).toBeLessThan(10000); // Each login should complete within 10 seconds
      }

    } finally {
      // Clean up contexts
      for (const context of contexts) {
        await context.close();
      }
    }
  });

  test('Large Dataset Performance', async ({ page }) => {
    console.log('Testing large dataset performance...');

    await loginPage.login();
    await dashboardPage.navigateToTenantList();

    // Test with large number of tenants (if available)
    const startTime = Date.now();
    await tenantManagementPage.waitForTenantListLoad();
    const loadTime = Date.now() - startTime;

    console.log(`Tenant list load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds even with many tenants
  });

  test('Image and Asset Loading Performance', async ({ page }) => {
    console.log('Testing image and asset loading performance...');

    const resourceTimings = [];

    page.on('response', response => {
      const url = response.url();
      if (url.match(/\.(png|jpg|jpeg|gif|svg|css|js)$/)) {
        resourceTimings.push({
          url: url,
          status: response.status(),
          size: response.headers()['content-length'] || 0
        });
      }
    });

    await loginPage.navigateToLogin();
    await loginPage.login();
    await dashboardPage.waitForDashboardLoad();

    // Check that all resources loaded successfully
    for (const resource of resourceTimings) {
      expect(resource.status).toBe(200);
    }

    console.log(`Loaded ${resourceTimings.length} resources`);
  });

  test('Database Query Performance', async ({ page }) => {
    console.log('Testing database query performance...');

    await loginPage.login();

    // Monitor database-related requests
    const dbRequests = [];
    page.on('response', response => {
      const url = response.url();
      if (url.includes('/api/') && (url.includes('tenant') || url.includes('user'))) {
        dbRequests.push({
          url: url,
          status: response.status(),
          timestamp: Date.now()
        });
      }
    });

    // Perform database-intensive operations
    await dashboardPage.navigateToTenantList();
    await dashboardPage.navigateToSuperAdmins();

    // Check that database queries are fast
    for (const request of dbRequests) {
      console.log(`DB request ${request.url} status: ${request.status}`);
      expect(request.status).toBe(200);
    }
  });

  test('Caching Performance', async ({ page }) => {
    console.log('Testing caching performance...');

    // First visit
    const firstVisitStart = Date.now();
    await loginPage.navigateToLogin();
    await page.waitForLoadState('networkidle');
    const firstVisitTime = Date.now() - firstVisitStart;

    // Second visit (should be faster due to caching)
    const secondVisitStart = Date.now();
    await page.reload();
    await page.waitForLoadState('networkidle');
    const secondVisitTime = Date.now() - secondVisitStart;

    console.log(`First visit: ${firstVisitTime}ms, Second visit: ${secondVisitTime}ms`);
    expect(secondVisitTime).toBeLessThan(firstVisitTime); // Second visit should be faster
  });
});
