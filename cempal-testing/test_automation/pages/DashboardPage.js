/**
 * Dashboard Page Object Model for Cempal Portal
 * Handles dashboard navigation and common functionality
 */

const BasePage = require('./BasePage');
const testData = require('../config/testData');

class DashboardPage extends BasePage {
  constructor(page) {
    super(page);
    this.selectors = testData.selectors;
  }

  /**
   * Wait for dashboard to load
   */
  async waitForDashboardLoad() {
    await this.waitForElement('//img[@alt="tenantLogo"]');
    await this.waitForPageLoad();
  }

  /**
   * Click on account circle icon
   */
  async clickAccountCircle() {
    await this.click(this.selectors.accountCircle);
  }

  /**
   * Click on logout button
   */
  async clickLogout() {
    await this.click(this.selectors.logoutButton);
  }

  /**
   * Perform complete logout
   */
  async logout() {
    await this.clickAccountCircle();
    await this.wait(1000); // Wait for dropdown to appear
    await this.clickLogout();
    await this.waitForNavigation();
  }

  /**
   * Click on tenant logo
   */
  async clickTenantLogo() {
    await this.click(this.selectors.tenantLogo);
  }

  /**
   * Click on dashboard button
   */
  async clickDashboardButton() {
    await this.click(this.selectors.dashboardButton);
  }

  /**
   * Click on privacy policy link
   */
  async clickPrivacyPolicy() {
    await this.click(this.selectors.privacyPolicyLink);
  }

  /**
   * Navigate to tenant list
   */
  async navigateToTenantList() {
    await this.click(this.selectors.tenantListLink);
    await this.waitForNavigation();
  }

  /**
   * Navigate to super admins
   */
  async navigateToSuperAdmins() {
    await this.click(this.selectors.superAdminsLink);
    await this.waitForNavigation();
  }

  /**
   * Toggle theme (light/dark)
   */
  async toggleTheme() {
    await this.click("//span[@class='ant-switch-inner']");
    await this.wait(1000);
  }

  /**
   * Check if user is logged in
   * @returns {Promise<boolean>} True if logged in
   */
  async isLoggedIn() {
    try {
      await this.waitForElement('//img[@alt="tenantLogo"]', 5000);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if account dropdown is visible
   * @returns {Promise<boolean>} True if dropdown is visible
   */
  async isAccountDropdownVisible() {
    return await this.isVisible("//span[normalize-space()='Logout from Cempal']");
  }

  /**
   * Check if tenant logo is visible
   * @returns {Promise<boolean>} True if tenant logo is visible
   */
  async isTenantLogoVisible() {
    return await this.isVisible(this.selectors.tenantLogo);
  }

  /**
   * Check if dashboard button is visible
   * @returns {Promise<boolean>} True if dashboard button is visible
   */
  async isDashboardButtonVisible() {
    return await this.isVisible(this.selectors.dashboardButton);
  }

  /**
   * Check if privacy policy link is visible
   * @returns {Promise<boolean>} True if privacy policy link is visible
   */
  async isPrivacyPolicyVisible() {
    return await this.isVisible(this.selectors.privacyPolicyLink);
  }

  /**
   * Check if tenant list link is visible
   * @returns {Promise<boolean>} True if tenant list link is visible
   */
  async isTenantListVisible() {
    return await this.isVisible(this.selectors.tenantListLink);
  }

  /**
   * Check if super admins link is visible
   * @returns {Promise<boolean>} True if super admins link is visible
   */
  async isSuperAdminsVisible() {
    return await this.isVisible(this.selectors.superAdminsLink);
  }

  /**
   * Get current theme (light/dark)
   * @returns {Promise<string>} Current theme
   */
  async getCurrentTheme() {
    const body = this.page.locator('body');
    const className = await body.getAttribute('class');
    return className && className.includes('dark') ? 'dark' : 'light';
  }

  /**
   * Check if theme toggle is available
   * @returns {Promise<boolean>} True if theme toggle is available
   */
  async isThemeToggleAvailable() {
    return await this.isVisible("//span[@class='ant-switch-inner']");
  }

  /**
   * Navigate to dashboard
   */
  async navigateToDashboard() {
    await this.goto('/');
    await this.waitForDashboardLoad();
  }

  /**
   * Check if page is loaded
   * @returns {Promise<boolean>} True if page is loaded
   */
  async isPageLoaded() {
    try {
      await this.waitForElement('//img[@alt="tenantLogo"]', 10000);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get dashboard title
   * @returns {Promise<string>} Dashboard title
   */
  async getDashboardTitle() {
    return await this.getTitle();
  }

  /**
   * Check if navigation menu is visible
   * @returns {Promise<boolean>} True if navigation menu is visible
   */
  async isNavigationMenuVisible() {
    const menuItems = [
      this.selectors.dashboardButton,
      this.selectors.tenantListLink,
      this.selectors.superAdminsLink
    ];

    for (const item of menuItems) {
      if (await this.isVisible(item)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Wait for specific navigation item
   * @param {string} itemText - Navigation item text
   */
  async waitForNavigationItem(itemText) {
    await this.waitForText(itemText);
  }

  /**
   * Check if user has specific role
   * @param {string} role - Role to check
   * @returns {Promise<boolean>} True if user has role
   */
  async hasRole(role) {
    const roleSelectors = {
      'super_admin': this.selectors.superAdminsLink,
      'tenant_admin': this.selectors.tenantListLink,
      'team_lead': '//a[contains(text(),"Team")]',
      'employee': '//a[contains(text(),"Profile")]'
    };

    const selector = roleSelectors[role.toLowerCase()];
    if (selector) {
      return await this.isVisible(selector);
    }
    return false;
  }
}

module.exports = DashboardPage;
