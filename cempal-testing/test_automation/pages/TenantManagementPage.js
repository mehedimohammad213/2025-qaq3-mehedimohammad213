/**
 * Tenant Management Page Object Model for Cempal Portal
 * Handles tenant creation, editing, and management functionality
 */

const BasePage = require('./BasePage');
const testData = require('../config/testData');

class TenantManagementPage extends BasePage {
  constructor(page) {
    super(page);
    this.selectors = testData.selectors;
    this.tenantData = testData.tenant;
  }

  /**
   * Navigate to tenant list page
   */
  async navigateToTenantList() {
    await this.goto('/tenant-list');
    await this.waitForPageLoad();
  }

  /**
   * Click create new tenant button
   */
  async clickCreateNewTenant() {
    await this.click(this.selectors.createTenantButton);
  }

  /**
   * Fill tenant name
   * @param {string} name - Tenant name
   */
  async fillTenantName(name = this.tenantData.name) {
    await this.fill(this.selectors.tenantNameInput, name);
  }

  /**
   * Fill domain name
   * @param {string} domain - Domain name
   */
  async fillDomainName(domain = this.tenantData.domain) {
    await this.fill(this.selectors.domainNameInput, domain);
  }

  /**
   * Fill contact email
   * @param {string} email - Contact email
   */
  async fillContactEmail(email = this.tenantData.contactEmail) {
    await this.fill(this.selectors.contactEmailInput, email);
  }

  /**
   * Fill address
   * @param {string} address - Address
   */
  async fillAddress(address = this.tenantData.address) {
    await this.fill(this.selectors.addressTextarea, address);
  }

  /**
   * Click create tenant submit button
   */
  async clickCreateTenantSubmit() {
    await this.click(this.selectors.createTenantSubmitButton);
  }

  /**
   * Click update tenant button
   */
  async clickUpdateTenant() {
    await this.click(this.selectors.updateTenantButton);
  }

  /**
   * Create a new tenant with all required fields
   * @param {Object} tenantData - Tenant data object
   */
  async createTenant(tenantData = this.tenantData) {
    await this.clickCreateNewTenant();
    await this.waitForElement('//div[@class="ant-modal-content"]');
    
    await this.fillTenantName(tenantData.name);
    await this.fillDomainName(tenantData.domain);
    await this.fillContactEmail(tenantData.contactEmail);
    await this.fillAddress(tenantData.address);
    
    await this.clickCreateTenantSubmit();
    await this.waitForNavigation();
  }

  /**
   * Find tenant in the list by name
   * @param {string} tenantName - Name of the tenant to find
   * @returns {Promise<boolean>} True if tenant found
   */
  async findTenantInList(tenantName) {
    try {
      await this.waitForElement(`//td[contains(text(),'${tenantName}')]`, 5000);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Click on tenant action button (read more, edit, groups)
   * @param {string} tenantName - Name of the tenant
   * @param {string} action - Action to perform (read_more, edit_note, groups)
   */
  async clickTenantAction(tenantName, action) {
    const actionSelectors = {
      'read_more': '//span[@aria-label="read_more"]',
      'edit_note': '//span[@aria-label="edit_note"]',
      'groups': '//span[@aria-label="groups"]'
    };
    
    // Find the row containing the tenant name
    const tenantRow = this.page.locator(`//tr[td[contains(text(),'${tenantName}')]]`);
    
    // Click the specific action button in that row
    const actionButton = tenantRow.locator(actionSelectors[action]);
    await actionButton.click();
  }

  /**
   * Click close button on modal
   */
  async clickCloseModal() {
    await this.click("//*[@fill-rule='evenodd']");
  }

  /**
   * Edit tenant information
   * @param {string} tenantName - Name of the tenant to edit
   * @param {Object} updatedData - Updated tenant data
   */
  async editTenant(tenantName, updatedData) {
    await this.clickTenantAction(tenantName, 'edit_note');
    await this.waitForElement('//div[@class="ant-modal-wrap"]');
    
    // Update fields if provided
    if (updatedData.name) {
      await this.fillTenantName(updatedData.name);
    }
    if (updatedData.domain) {
      await this.fillDomainName(updatedData.domain);
    }
    if (updatedData.contactEmail) {
      await this.fillContactEmail(updatedData.contactEmail);
    }
    if (updatedData.address) {
      await this.fillAddress(updatedData.address);
    }
    
    await this.clickUpdateTenant();
    await this.waitForNavigation();
  }

  /**
   * Check if tenant creation modal is visible
   * @returns {Promise<boolean>} True if modal is visible
   */
  async isCreateTenantModalVisible() {
    return await this.isVisible('//div[@class="ant-modal-content"]');
  }

  /**
   * Check if edit tenant modal is visible
   * @returns {Promise<boolean>} True if modal is visible
   */
  async isEditTenantModalVisible() {
    return await this.isVisible('//div[@class="ant-modal-wrap"]');
  }

  /**
   * Validate tenant form fields
   * @param {Object} tenantData - Tenant data to validate
   * @returns {Promise<Object>} Validation results
   */
  async validateTenantForm(tenantData) {
    const validation = {
      tenantName: true,
      domainName: true,
      contactEmail: true,
      address: true
    };

    // Validate tenant name
    if (!tenantData.name || tenantData.name.trim() === '') {
      validation.tenantName = false;
    }

    // Validate domain name
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    if (!tenantData.domain || !domainRegex.test(tenantData.domain)) {
      validation.domainName = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!tenantData.contactEmail || !emailRegex.test(tenantData.contactEmail)) {
      validation.contactEmail = false;
    }

    // Validate address
    if (!tenantData.address || tenantData.address.trim() === '') {
      validation.address = false;
    }

    return validation;
  }

  /**
   * Get tenant list count
   * @returns {Promise<number>} Number of tenants in the list
   */
  async getTenantListCount() {
    try {
      const rows = await this.page.locator('//table//tbody//tr').count();
      return rows;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Search for tenant in the list
   * @param {string} searchTerm - Search term
   * @returns {Promise<boolean>} True if tenant found
   */
  async searchTenant(searchTerm) {
    // Look for search input field
    const searchInput = this.page.locator('input[placeholder*="search"], input[placeholder*="Search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill(searchTerm);
      await this.wait(1000); // Wait for search results
    }
    
    return await this.findTenantInList(searchTerm);
  }

  /**
   * Check if tenant table is visible
   * @returns {Promise<boolean>} True if table is visible
   */
  async isTenantTableVisible() {
    return await this.isVisible('//table');
  }

  /**
   * Get tenant details from table
   * @param {string} tenantName - Name of the tenant
   * @returns {Promise<Object>} Tenant details
   */
  async getTenantDetails(tenantName) {
    try {
      const tenantRow = this.page.locator(`//tr[td[contains(text(),'${tenantName}')]]`);
      const cells = await tenantRow.locator('td').all();
      
      return {
        name: await cells[0]?.textContent() || '',
        domain: await cells[1]?.textContent() || '',
        contactEmail: await cells[2]?.textContent() || '',
        address: await cells[3]?.textContent() || ''
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if tenant exists in the list
   * @param {string} tenantName - Name of the tenant
   * @returns {Promise<boolean>} True if tenant exists
   */
  async tenantExists(tenantName) {
    return await this.findTenantInList(tenantName);
  }

  /**
   * Wait for tenant list to load
   */
  async waitForTenantListLoad() {
    await this.waitForElement('//table');
    await this.waitForPageLoad();
  }

  /**
   * Check if create tenant button is visible
   * @returns {Promise<boolean>} True if button is visible
   */
  async isCreateTenantButtonVisible() {
    return await this.isVisible(this.selectors.createTenantButton);
  }

  /**
   * Clear tenant form fields
   */
  async clearTenantForm() {
    await this.page.fill(this.selectors.tenantNameInput, '');
    await this.page.fill(this.selectors.domainNameInput, '');
    await this.page.fill(this.selectors.contactEmailInput, '');
    await this.page.fill(this.selectors.addressTextarea, '');
  }
}

module.exports = TenantManagementPage;
