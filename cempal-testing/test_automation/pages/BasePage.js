/**
 * Base Page Object Model for Cempal Portal testing
 * Contains common functionality and utilities
 */

const { expect } = require('@playwright/test');

class BasePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   * @param {string} url - URL to navigate to
   */
  async goto(url) {
    await this.page.goto(url);
  }

  /**
   * Wait for element to be visible
   * @param {string} selector - Element selector
   * @param {number} timeout - Timeout in milliseconds
   */
  async waitForElement(selector, timeout = 10000) {
    await this.page.waitForSelector(selector, { timeout });
  }

  /**
   * Wait for element to be visible and clickable
   * @param {string} selector - Element selector
   * @param {number} timeout - Timeout in milliseconds
   */
  async waitForClickable(selector, timeout = 10000) {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
    await this.page.waitForSelector(selector, { state: 'attached', timeout });
  }

  /**
   * Click on an element
   * @param {string} selector - Element selector
   * @param {Object} options - Click options
   */
  async click(selector, options = {}) {
    await this.waitForClickable(selector);
    await this.page.click(selector, options);
  }

  /**
   * Fill input field with text
   * @param {string} selector - Element selector
   * @param {string} text - Text to fill
   * @param {Object} options - Fill options
   */
  async fill(selector, text, options = {}) {
    await this.waitForElement(selector);
    await this.page.fill(selector, text, options);
  }

  /**
   * Type text into input field
   * @param {string} selector - Element selector
   * @param {string} text - Text to type
   * @param {Object} options - Type options
   */
  async type(selector, text, options = {}) {
    await this.waitForElement(selector);
    await this.page.type(selector, text, options);
  }

  /**
   * Get text content of an element
   * @param {string} selector - Element selector
   * @returns {Promise<string>} Text content
   */
  async getText(selector) {
    await this.waitForElement(selector);
    return await this.page.textContent(selector);
  }

  /**
   * Check if element is visible
   * @param {string} selector - Element selector
   * @returns {Promise<boolean>} True if visible
   */
  async isVisible(selector) {
    try {
      await this.page.waitForSelector(selector, { timeout: 5000 });
      return await this.page.isVisible(selector);
    } catch (error) {
      return false;
    }
  }

  /**
   * Wait for page to load completely
   * @param {string} url - Expected URL pattern
   */
  async waitForPageLoad(url = null) {
    await this.page.waitForLoadState('networkidle');
    if (url) {
      await this.page.waitForURL(url);
    }
  }

  /**
   * Take screenshot
   * @param {string} name - Screenshot name
   * @param {Object} options - Screenshot options
   */
  async takeScreenshot(name, options = {}) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `screenshots/${name}-${timestamp}.png`;
    await this.page.screenshot({ path: filename, ...options });
    return filename;
  }

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Scroll element into view
   * @param {string} selector - Element selector
   */
  async scrollIntoView(selector) {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Wait for element to disappear
   * @param {string} selector - Element selector
   * @param {number} timeout - Timeout in milliseconds
   */
  async waitForElementToDisappear(selector, timeout = 10000) {
    await this.page.waitForSelector(selector, { state: 'hidden', timeout });
  }

  /**
   * Select option from dropdown
   * @param {string} selector - Dropdown selector
   * @param {string} value - Option value to select
   */
  async selectOption(selector, value) {
    await this.waitForElement(selector);
    await this.page.selectOption(selector, value);
  }

  /**
   * Click on option by text in dropdown
   * @param {string} dropdownSelector - Dropdown selector
   * @param {string} optionText - Option text to click
   */
  async clickDropdownOption(dropdownSelector, optionText) {
    await this.click(dropdownSelector);
    await this.click(`//div[contains(text(),'${optionText}')]`);
  }

  /**
   * Wait for text to be present in page
   * @param {string} text - Text to wait for
   * @param {number} timeout - Timeout in milliseconds
   */
  async waitForText(text, timeout = 10000) {
    await this.page.waitForSelector(`text=${text}`, { timeout });
  }

  /**
   * Get element attribute value
   * @param {string} selector - Element selector
   * @param {string} attribute - Attribute name
   * @returns {Promise<string>} Attribute value
   */
  async getAttribute(selector, attribute) {
    await this.waitForElement(selector);
    return await this.page.getAttribute(selector, attribute);
  }

  /**
   * Reload the page
   */
  async reload() {
    await this.page.reload();
  }

  /**
   * Go back in browser history
   */
  async goBack() {
    await this.page.goBack();
  }

  /**
   * Go forward in browser history
   */
  async goForward() {
    await this.page.goForward();
  }

  /**
   * Get current URL
   * @returns {Promise<string>} Current URL
   */
  async getCurrentUrl() {
    return this.page.url();
  }

  /**
   * Get page title
   * @returns {Promise<string>} Page title
   */
  async getTitle() {
    return await this.page.title();
  }

  /**
   * Wait for specific time
   * @param {number} ms - Milliseconds to wait
   */
  async wait(ms) {
    await this.page.waitForTimeout(ms);
  }

  /**
   * Assert element is visible
   * @param {string} selector - Element selector
   * @param {string} message - Assertion message
   */
  async assertVisible(selector, message = 'Element should be visible') {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  /**
   * Assert element contains text
   * @param {string} selector - Element selector
   * @param {string} text - Expected text
   * @param {string} message - Assertion message
   */
  async assertText(selector, text, message = 'Element should contain text') {
    await expect(this.page.locator(selector)).toContainText(text);
  }

  /**
   * Assert URL contains text
   * @param {string} text - Expected URL text
   * @param {string} message - Assertion message
   */
  async assertUrl(text, message = 'URL should contain text') {
    await expect(this.page).toHaveURL(new RegExp(text));
  }
}

module.exports = BasePage;
