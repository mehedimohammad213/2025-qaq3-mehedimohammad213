/**
 * Security Tests for Cempal Portal
 * Tests for authentication, authorization, and security vulnerabilities
 */

const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const DashboardPage = require('../pages/DashboardPage');
const testData = require('../config/testData');

test.describe('Cempal Portal Security Tests', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
  });

  test('Authentication Security Tests', async ({ page }) => {
    console.log('Testing authentication security...');

    // Test invalid credentials
    await loginPage.navigateToLogin();
    await loginPage.login('invalid@email.com', 'wrongpassword');
    await expect(loginPage.isLoginFailed()).toBeTruthy();

    // Test SQL injection in email field
    await loginPage.navigateToLogin();
    await loginPage.enterEmail("'; DROP TABLE users; --");
    await loginPage.enterPassword('password');
    await loginPage.clickSignIn();
    await expect(loginPage.isLoginFailed()).toBeTruthy();

    // Test XSS in email field
    await loginPage.navigateToLogin();
    await loginPage.enterEmail('<script>alert("XSS")</script>');
    await loginPage.enterPassword('password');
    await loginPage.clickSignIn();
    await expect(loginPage.isLoginFailed()).toBeTruthy();
  });

  test('Session Management Tests', async ({ page }) => {
    console.log('Testing session management...');

    // Test session persistence
    await loginPage.login();
    await expect(dashboardPage.isLoggedIn()).toBeTruthy();

    // Test session after page reload
    await page.reload();
    await expect(dashboardPage.isLoggedIn()).toBeTruthy();

    // Test logout functionality
    await dashboardPage.logout();
    await expect(loginPage.isLoginFormVisible()).toBeTruthy();
  });

  test('Authorization Tests', async ({ page }) => {
    console.log('Testing authorization...');

    await loginPage.login();

    // Test role-based access
    await expect(dashboardPage.hasRole('super_admin')).toBeTruthy();

    // Test direct URL access
    await page.goto('/super-admins');
    await expect(dashboardPage.isLoggedIn()).toBeTruthy();
  });

  test('Input Validation Tests', async ({ page }) => {
    console.log('Testing input validation...');

    await loginPage.navigateToLogin();

    // Test email validation
    const invalidEmails = [
      'invalid-email',
      '@domain.com',
      'user@',
      'user@domain',
      'user..name@domain.com'
    ];

    for (const email of invalidEmails) {
      await loginPage.clearEmail();
      await loginPage.enterEmail(email);
      await loginPage.click(loginPage.selectors.passwordInput);

      // Check for validation error
      const hasError = await loginPage.isVisible('text=Invalid email format') ||
                      await loginPage.isVisible('text=Please enter a valid email');
      expect(hasError).toBeTruthy();
    }
  });

  test('Password Security Tests', async ({ page }) => {
    console.log('Testing password security...');

    await loginPage.navigateToLogin();

    // Test password visibility toggle
    await loginPage.enterPassword('testpassword');
    await expect(loginPage.isPasswordHidden()).toBeTruthy();

    // Test weak password
    await loginPage.enterPassword('123');
    await loginPage.clickSignIn();
    await expect(loginPage.isLoginFailed()).toBeTruthy();
  });

  test('CSRF Protection Tests', async ({ page }) => {
    console.log('Testing CSRF protection...');

    await loginPage.login();

    // Test if forms have CSRF tokens
    const forms = await page.locator('form').all();
    for (const form of forms) {
      const csrfToken = await form.locator('input[name*="csrf"], input[name*="token"]').count();
      expect(csrfToken).toBeGreaterThan(0);
    }
  });

  test('HTTPS Enforcement Tests', async ({ page }) => {
    console.log('Testing HTTPS enforcement...');

    // Test redirect to HTTPS
    await page.goto('http://dev.cempal.craftsmenltd.com/login');
    await expect(page).toHaveURL(/^https:/);
  });

  test('Content Security Policy Tests', async ({ page }) => {
    console.log('Testing Content Security Policy...');

    await loginPage.navigateToLogin();

    // Check for CSP headers
    const response = await page.goto('/login');
    const cspHeader = response.headers()['content-security-policy'];
    expect(cspHeader).toBeDefined();
  });
});
