/**
 * Login Page Object Model for Cempal Portal
 * Handles all login-related functionality
 */

const BasePage = require('./BasePage');
const testData = require('../config/testData');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.selectors = testData.selectors;
  }

  /**
   * Navigate to login page
   */
  async navigateToLogin() {
    await this.goto('/login');
    await this.waitForPageLoad();
  }

  /**
   * Enter email address
   * @param {string} email - Email address
   */
  async enterEmail(email = testData.credentials.email) {
    await this.fill(this.selectors.emailInput, email);
  }

  /**
   * Enter password
   * @param {string} password - Password
   */
  async enterPassword(password = testData.credentials.password) {
    await this.fill(this.selectors.passwordInput, password);
  }

  /**
   * Click sign in button
   */
  async clickSignIn() {
    await this.click(this.selectors.signInButton);
  }

  /**
   * Click Google sign in button
   */
  async clickGoogleSignIn() {
    await this.click(this.selectors.googleSignInButton);
  }

  /**
   * Click reset password button
   */
  async clickResetPassword() {
    await this.click(this.selectors.resetPasswordButton);
  }

  /**
   * Perform complete login with email and password
   * @param {string} email - Email address
   * @param {string} password - Password
   */
  async login(email = testData.credentials.email, password = testData.credentials.password) {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickSignIn();
    await this.waitForNavigation();
  }

  /**
   * Perform Google login
   * @param {string} googleEmail - Google email address
   */
  async loginWithGoogle(googleEmail = testData.credentials.googleEmail) {
    await this.clickGoogleSignIn();
    await this.waitForNavigation();
    
    // Handle Google account selection
    if (await this.isVisible(`//div[normalize-space()='${googleEmail}']`)) {
      await this.click(`//div[normalize-space()='${googleEmail}']`);
      await this.waitForNavigation();
    }
  }

  /**
   * Check if login was successful by looking for dashboard elements
   * @returns {Promise<boolean>} True if login successful
   */
  async isLoginSuccessful() {
    try {
      // Wait for either dashboard elements or error messages
      await this.page.waitForSelector('//img[@alt="tenantLogo"]', { timeout: 10000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if login failed by looking for error messages
   * @returns {Promise<boolean>} True if login failed
   */
  async isLoginFailed() {
    try {
      // Check for common error indicators
      const errorSelectors = [
        'text=Invalid credentials',
        'text=User not found',
        'text=Incorrect password',
        'text=Authentication failed',
        '[data-testid="error-message"]',
        '.error-message',
        '.alert-danger'
      ];
      
      for (const selector of errorSelectors) {
        if (await this.isVisible(selector)) {
          return true;
        }
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get error message text
   * @returns {Promise<string>} Error message
   */
  async getErrorMessage() {
    const errorSelectors = [
      'text=Invalid credentials',
      'text=User not found',
      'text=Incorrect password',
      'text=Authentication failed',
      '[data-testid="error-message"]',
      '.error-message',
      '.alert-danger'
    ];
    
    for (const selector of errorSelectors) {
      if (await this.isVisible(selector)) {
        return await this.getText(selector);
      }
    }
    return 'No error message found';
  }

  /**
   * Check if password field is hidden/shown
   * @returns {Promise<boolean>} True if password is hidden
   */
  async isPasswordHidden() {
    const passwordField = this.page.locator(this.selectors.passwordInput);
    const inputType = await passwordField.getAttribute('type');
    return inputType === 'password';
  }

  /**
   * Check if Google sign in is available
   * @returns {Promise<boolean>} True if Google sign in is available
   */
  async isGoogleSignInAvailable() {
    return await this.isVisible(this.selectors.googleSignInButton);
  }

  /**
   * Check if reset password is available
   * @returns {Promise<boolean>} True if reset password is available
   */
  async isResetPasswordAvailable() {
    return await this.isVisible(this.selectors.resetPasswordButton);
  }

  /**
   * Validate email field
   * @param {string} email - Email to validate
   * @returns {Promise<boolean>} True if email format is valid
   */
  async validateEmailField(email) {
    await this.enterEmail(email);
    await this.click(this.selectors.passwordInput); // Click outside to trigger validation
    
    // Check for validation error
    const errorSelectors = [
      'text=Invalid email format',
      'text=Please enter a valid email',
      '[data-testid="email-error"]',
      '.field-error'
    ];
    
    for (const selector of errorSelectors) {
      if (await this.isVisible(selector)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Clear email field
   */
  async clearEmail() {
    await this.page.fill(this.selectors.emailInput, '');
  }

  /**
   * Clear password field
   */
  async clearPassword() {
    await this.page.fill(this.selectors.passwordInput, '');
  }

  /**
   * Check if login form is visible
   * @returns {Promise<boolean>} True if login form is visible
   */
  async isLoginFormVisible() {
    return await this.isVisible(this.selectors.emailInput) && 
           await this.isVisible(this.selectors.passwordInput) && 
           await this.isVisible(this.selectors.signInButton);
  }

  /**
   * Get page title
   * @returns {Promise<string>} Page title
   */
  async getPageTitle() {
    return await this.getTitle();
  }

  /**
   * Check if Cempal logo is visible
   * @returns {Promise<boolean>} True if logo is visible
   */
  async isCempalLogoVisible() {
    return await this.isVisible("//img[@alt='Cempal Logo']");
  }

  /**
   * Click on Cempal logo
   */
  async clickCempalLogo() {
    await this.click("//img[@alt='Cempal Logo']");
  }

  /**
   * Click on Get Started button
   */
  async clickGetStarted() {
    await this.click("//span[normalize-space()='Get Started']");
  }
}

module.exports = LoginPage;
