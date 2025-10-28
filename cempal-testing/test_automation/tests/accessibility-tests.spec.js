/**
 * Accessibility Tests for Cempal Portal
 * Tests for WCAG compliance and accessibility features
 */

const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const DashboardPage = require('../pages/DashboardPage');
const testData = require('../config/testData');

test.describe('Cempal Portal Accessibility Tests', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
  });

  test('Keyboard Navigation Tests', async ({ page }) => {
    console.log('Testing keyboard navigation...');

    await loginPage.navigateToLogin();

    // Test tab navigation
    await page.keyboard.press('Tab');
    await expect(page.locator(loginPage.selectors.emailInput)).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator(loginPage.selectors.passwordInput)).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator(loginPage.selectors.signInButton)).toBeFocused();

    // Test Enter key on focused elements
    await page.keyboard.press('Enter');
    await expect(loginPage.isLoginFailed()).toBeTruthy(); // Should show error for empty fields
  });

  test('ARIA Labels and Roles Tests', async ({ page }) => {
    console.log('Testing ARIA labels and roles...');

    await loginPage.navigateToLogin();

    // Check for proper ARIA labels
    const emailInput = page.locator(loginPage.selectors.emailInput);
    const passwordInput = page.locator(loginPage.selectors.passwordInput);
    const signInButton = page.locator(loginPage.selectors.signInButton);

    // Check aria-label or aria-labelledby
    await expect(emailInput).toHaveAttribute('aria-label').or.toHaveAttribute('aria-labelledby');
    await expect(passwordInput).toHaveAttribute('aria-label').or.toHaveAttribute('aria-labelledby');
    await expect(signInButton).toHaveAttribute('aria-label').or.toHaveAttribute('aria-labelledby');

    // Check for proper roles
    await expect(signInButton).toHaveAttribute('type', 'submit');
  });

  test('Color Contrast Tests', async ({ page }) => {
    console.log('Testing color contrast...');

    await loginPage.navigateToLogin();

    // Test text contrast
    const textElements = await page.locator('text, p, span, div, h1, h2, h3, h4, h5, h6').all();

    for (const element of textElements.slice(0, 10)) { // Test first 10 text elements
      const color = await element.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          color: styles.color,
          backgroundColor: styles.backgroundColor
        };
      });

      // Basic contrast check (simplified)
      expect(color.color).not.toBe('transparent');
      expect(color.backgroundColor).not.toBe('transparent');
    }
  });

  test('Focus Management Tests', async ({ page }) => {
    console.log('Testing focus management...');

    await loginPage.navigateToLogin();

    // Test focus indicators
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // Test focus after form submission
    await loginPage.enterEmail(testData.credentials.email);
    await loginPage.enterPassword(testData.credentials.password);
    await loginPage.clickSignIn();

    // Focus should be managed properly after login
    await dashboardPage.waitForDashboardLoad();
    const hasFocus = await page.locator(':focus').count() > 0;
    expect(hasFocus).toBeTruthy();
  });

  test('Screen Reader Compatibility Tests', async ({ page }) => {
    console.log('Testing screen reader compatibility...');

    await loginPage.navigateToLogin();

    // Check for proper heading structure
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(0);

    // Check for proper form labels
    const formLabels = await page.locator('label').all();
    expect(formLabels.length).toBeGreaterThan(0);

    // Check for alt text on images
    const images = await page.locator('img').all();
    for (const img of images) {
      const altText = await img.getAttribute('alt');
      expect(altText).toBeDefined();
    }
  });

  test('Error Message Accessibility Tests', async ({ page }) => {
    console.log('Testing error message accessibility...');

    await loginPage.navigateToLogin();

    // Trigger validation errors
    await loginPage.clickSignIn();

    // Check for proper error announcements
    const errorMessages = await page.locator('[role="alert"], .error, .alert-danger').all();
    expect(errorMessages.length).toBeGreaterThan(0);

    // Check that errors are associated with form fields
    for (const error of errorMessages) {
      const ariaDescribedBy = await error.getAttribute('aria-describedby');
      const id = await error.getAttribute('id');
      expect(ariaDescribedBy || id).toBeDefined();
    }
  });

  test('Responsive Design Accessibility Tests', async ({ page }) => {
    console.log('Testing responsive design accessibility...');

    // Test different viewport sizes
    const viewports = [
      { width: 320, height: 568 },   // iPhone SE
      { width: 375, height: 667 },   // iPhone 8
      { width: 768, height: 1024 },  // iPad
      { width: 1024, height: 768 },  // iPad landscape
      { width: 1920, height: 1080 }  // Desktop
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await loginPage.navigateToLogin();

      // Check that all interactive elements are accessible
      const interactiveElements = await page.locator('button, input, select, textarea, a').all();
      for (const element of interactiveElements) {
        const isVisible = await element.isVisible();
        const isEnabled = await element.isEnabled();

        if (isVisible) {
          expect(isEnabled).toBeTruthy();
        }
      }
    }
  });

  test('Language and Direction Tests', async ({ page }) => {
    console.log('Testing language and direction...');

    await loginPage.navigateToLogin();

    // Check for proper lang attribute
    const htmlElement = page.locator('html');
    const lang = await htmlElement.getAttribute('lang');
    expect(lang).toBeDefined();

    // Check for proper dir attribute if needed
    const dir = await htmlElement.getAttribute('dir');
    if (dir) {
      expect(['ltr', 'rtl']).toContain(dir);
    }
  });

  test('Skip Links Tests', async ({ page }) => {
    console.log('Testing skip links...');

    await loginPage.navigateToLogin();

    // Check for skip links
    const skipLinks = await page.locator('a[href^="#"], a[href*="skip"]').all();

    if (skipLinks.length > 0) {
      for (const link of skipLinks) {
        const href = await link.getAttribute('href');
        expect(href).toBeDefined();

        // Test skip link functionality
        await link.click();
        const targetId = href.replace('#', '');
        if (targetId) {
          const target = page.locator(`#${targetId}`);
          await expect(target).toBeVisible();
        }
      }
    }
  });

  test('Form Validation Accessibility Tests', async ({ page }) => {
    console.log('Testing form validation accessibility...');

    await loginPage.navigateToLogin();

    // Test required field validation
    await loginPage.enterEmail('');
    await loginPage.enterPassword('');
    await loginPage.clickSignIn();

    // Check for proper validation messages
    const validationMessages = await page.locator('[aria-invalid="true"], .invalid, .error').all();
    expect(validationMessages.length).toBeGreaterThan(0);

    // Check that validation messages are properly associated
    for (const message of validationMessages) {
      const ariaDescribedBy = await message.getAttribute('aria-describedby');
      const ariaInvalid = await message.getAttribute('aria-invalid');
      expect(ariaDescribedBy || ariaInvalid).toBeDefined();
    }
  });

  test('Modal and Dialog Accessibility Tests', async ({ page }) => {
    console.log('Testing modal and dialog accessibility...');

    await loginPage.login();
    await dashboardPage.navigateToTenantList();

    // Open a modal
    await page.click('//span[normalize-space()="Create new Tenant"]');

    // Check for proper modal attributes
    const modal = page.locator('.ant-modal-content');
    await expect(modal).toBeVisible();

    // Check for proper focus management in modal
    const modalInputs = modal.locator('input, select, textarea, button');
    const firstInput = modalInputs.first();
    await expect(firstInput).toBeFocused();

    // Check for proper modal role
    const modalRole = await modal.getAttribute('role');
    expect(modalRole).toBe('dialog');
  });
});
