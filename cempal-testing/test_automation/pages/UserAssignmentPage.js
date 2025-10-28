/**
 * User Assignment Page Object Model for Cempal Portal
 * Handles user assignment functionality for super admins
 */

const BasePage = require('./BasePage');
const testData = require('../config/testData');

class UserAssignmentPage extends BasePage {
  constructor(page) {
    super(page);
    this.selectors = testData.selectors;
    this.userAssignmentData = testData.userAssignment;
  }

  /**
   * Navigate to super admins page
   */
  async navigateToSuperAdmins() {
    await this.goto('/super-admins');
    await this.waitForPageLoad();
  }

  /**
   * Click assign button for a specific user
   * @param {string} userEmail - Email of the user to assign
   */
  async clickAssignButton(userEmail) {
    // Find the row containing the user email and click assign button
    const userRow = this.page.locator(`//tr[td[contains(text(),'${userEmail}')]]`);
    const assignButton = userRow.locator("//button[@type='button']//span[contains(text(),'Assign')]");
    await assignButton.click();
  }

  /**
   * Click on tenant dropdown
   */
  async clickTenantDropdown() {
    await this.click(this.selectors.tenantSelect);
  }

  /**
   * Select tenant from dropdown
   * @param {string} tenantName - Name of the tenant to select
   */
  async selectTenant(tenantName = this.userAssignmentData.tenantName) {
    await this.clickTenantDropdown();
    await this.wait(1000); // Wait for dropdown to open
    await this.click(`//div[@class='ant-select-item-option-content'][normalize-space()='${tenantName}']`);
  }

  /**
   * Click on group dropdown
   */
  async clickGroupDropdown() {
    await this.click(this.selectors.groupSelect);
  }

  /**
   * Select user group from dropdown
   * @param {string} groupName - Name of the group to select
   */
  async selectUserGroup(groupName = this.userAssignmentData.userGroup) {
    await this.clickGroupDropdown();
    await this.wait(1000); // Wait for dropdown to open
    await this.click(`//div[contains(text(),'${groupName}')]`);
  }

  /**
   * Click on team dropdown
   */
  async clickTeamDropdown() {
    await this.click(this.selectors.teamSelect);
  }

  /**
   * Select team from dropdown
   * @param {string} teamName - Name of the team to select
   */
  async selectTeam(teamName = this.userAssignmentData.teamName) {
    await this.clickTeamDropdown();
    await this.wait(1000); // Wait for dropdown to open
    await this.click(`//div[@title='${teamName}']`);
  }

  /**
   * Click assign submit button
   */
  async clickAssignSubmit() {
    await this.click(this.selectors.assignSubmitButton);
  }

  /**
   * Perform complete user assignment
   * @param {string} userEmail - Email of the user to assign
   * @param {Object} assignmentData - Assignment data
   */
  async assignUser(userEmail, assignmentData = this.userAssignmentData) {
    await this.clickAssignButton(userEmail);
    await this.waitForElement('//div[@class="ant-modal-content"]');
    
    await this.selectTenant(assignmentData.tenantName);
    await this.selectUserGroup(assignmentData.userGroup);
    await this.selectTeam(assignmentData.teamName);
    
    await this.clickAssignSubmit();
    await this.waitForNavigation();
  }

  /**
   * Check if assignment modal is visible
   * @returns {Promise<boolean>} True if modal is visible
   */
  async isAssignmentModalVisible() {
    return await this.isVisible('//div[@class="ant-modal-content"]');
  }

  /**
   * Check if tenant dropdown is visible
   * @returns {Promise<boolean>} True if dropdown is visible
   */
  async isTenantDropdownVisible() {
    return await this.isVisible(this.selectors.tenantSelect);
  }

  /**
   * Check if group dropdown is visible
   * @returns {Promise<boolean>} True if dropdown is visible
   */
  async isGroupDropdownVisible() {
    return await this.isVisible(this.selectors.groupSelect);
  }

  /**
   * Check if team dropdown is visible
   * @returns {Promise<boolean>} True if dropdown is visible
   */
  async isTeamDropdownVisible() {
    return await this.isVisible(this.selectors.teamSelect);
  }

  /**
   * Get available tenants list
   * @returns {Promise<Array>} List of available tenants
   */
  async getAvailableTenants() {
    await this.clickTenantDropdown();
    await this.wait(1000);
    
    const tenantOptions = await this.page.locator('//div[@class="ant-select-item-option-content"]').all();
    const tenants = [];
    
    for (const option of tenantOptions) {
      const text = await option.textContent();
      if (text && text.trim()) {
        tenants.push(text.trim());
      }
    }
    
    return tenants;
  }

  /**
   * Get available user groups
   * @returns {Promise<Array>} List of available user groups
   */
  async getAvailableUserGroups() {
    await this.clickGroupDropdown();
    await this.wait(1000);
    
    const groupOptions = await this.page.locator('//div[contains(@class,"ant-select-item-option-content")]').all();
    const groups = [];
    
    for (const option of groupOptions) {
      const text = await option.textContent();
      if (text && text.trim()) {
        groups.push(text.trim());
      }
    }
    
    return groups;
  }

  /**
   * Get available teams
   * @returns {Promise<Array>} List of available teams
   */
  async getAvailableTeams() {
    await this.clickTeamDropdown();
    await this.wait(1000);
    
    const teamOptions = await this.page.locator('//div[@title]').all();
    const teams = [];
    
    for (const option of teamOptions) {
      const title = await option.getAttribute('title');
      if (title && title.trim()) {
        teams.push(title.trim());
      }
    }
    
    return teams;
  }

  /**
   * Check if user is already assigned
   * @param {string} userEmail - Email of the user to check
   * @returns {Promise<boolean>} True if user is already assigned
   */
  async isUserAssigned(userEmail) {
    try {
      const userRow = this.page.locator(`//tr[td[contains(text(),'${userEmail}')]]`);
      const statusCell = userRow.locator('td').nth(2); // Assuming status is in 3rd column
      const statusText = await statusCell.textContent();
      return statusText && statusText.toLowerCase().includes('assigned');
    } catch (error) {
      return false;
    }
  }

  /**
   * Get user assignment status
   * @param {string} userEmail - Email of the user
   * @returns {Promise<string>} Assignment status
   */
  async getUserAssignmentStatus(userEmail) {
    try {
      const userRow = this.page.locator(`//tr[td[contains(text(),'${userEmail}')]]`);
      const statusCell = userRow.locator('td').nth(2);
      return await statusCell.textContent();
    } catch (error) {
      return 'Unknown';
    }
  }

  /**
   * Check if super admins table is visible
   * @returns {Promise<boolean>} True if table is visible
   */
  async isSuperAdminsTableVisible() {
    return await this.isVisible('//table');
  }

  /**
   * Get super admins list count
   * @returns {Promise<number>} Number of super admins in the list
   */
  async getSuperAdminsCount() {
    try {
      const rows = await this.page.locator('//table//tbody//tr').count();
      return rows;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Search for user in super admins list
   * @param {string} searchTerm - Search term
   * @returns {Promise<boolean>} True if user found
   */
  async searchUser(searchTerm) {
    // Look for search input field
    const searchInput = this.page.locator('input[placeholder*="search"], input[placeholder*="Search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill(searchTerm);
      await this.wait(1000); // Wait for search results
    }
    
    return await this.isVisible(`//td[contains(text(),'${searchTerm}')]`);
  }

  /**
   * Validate assignment form
   * @param {Object} assignmentData - Assignment data to validate
   * @returns {Promise<Object>} Validation results
   */
  async validateAssignmentForm(assignmentData) {
    const validation = {
      tenant: true,
      group: true,
      team: true
    };

    // Check if tenant is selected
    if (!assignmentData.tenantName) {
      validation.tenant = false;
    }

    // Check if group is selected
    if (!assignmentData.userGroup) {
      validation.group = false;
    }

    // Check if team is selected
    if (!assignmentData.teamName) {
      validation.team = false;
    }

    return validation;
  }

  /**
   * Close assignment modal
   */
  async closeAssignmentModal() {
    await this.click("//*[@fill-rule='evenodd']");
  }

  /**
   * Wait for super admins page to load
   */
  async waitForSuperAdminsLoad() {
    await this.waitForElement('//table');
    await this.waitForPageLoad();
  }

  /**
   * Check if assign button is visible for user
   * @param {string} userEmail - Email of the user
   * @returns {Promise<boolean>} True if assign button is visible
   */
  async isAssignButtonVisible(userEmail) {
    try {
      const userRow = this.page.locator(`//tr[td[contains(text(),'${userEmail}')]]`);
      const assignButton = userRow.locator("//button[@type='button']//span[contains(text(),'Assign')]");
      return await assignButton.isVisible();
    } catch (error) {
      return false;
    }
  }

  /**
   * Get user details from table
   * @param {string} userEmail - Email of the user
   * @returns {Promise<Object>} User details
   */
  async getUserDetails(userEmail) {
    try {
      const userRow = this.page.locator(`//tr[td[contains(text(),'${userEmail}')]]`);
      const cells = await userRow.locator('td').all();
      
      return {
        email: await cells[0]?.textContent() || '',
        name: await cells[1]?.textContent() || '',
        status: await cells[2]?.textContent() || '',
        actions: await cells[3]?.textContent() || ''
      };
    } catch (error) {
      return null;
    }
  }
}

module.exports = UserAssignmentPage;
