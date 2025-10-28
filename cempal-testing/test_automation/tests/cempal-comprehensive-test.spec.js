/**
 * Comprehensive Cempal Portal Test Suite
 * Implements all 71 test steps from the provided test case
 *
 * Test Environment:
 * - OS: Linux 6.14.0
 * - Browser: Chrome 141
 * - Resolution: 1920x1080
 * - Test Date: 28 Oct 2025 / 22:35:25 GMT+6
 */

const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const DashboardPage = require('../pages/DashboardPage');
const TenantManagementPage = require('../pages/TenantManagementPage');
const UserAssignmentPage = require('../pages/UserAssignmentPage');
const testData = require('../config/testData');

test.describe('Cempal Portal Comprehensive Test Suite', () => {
  let loginPage;
  let dashboardPage;
  let tenantManagementPage;
  let userAssignmentPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    tenantManagementPage = new TenantManagementPage(page);
    userAssignmentPage = new UserAssignmentPage(page);
  });

  test('Complete Cempal Portal Test Flow - All 71 Steps', async ({ page }) => {
    console.log('Starting comprehensive Cempal Portal test...');

    // Step 1: Open website
    console.log('Step 1: Opening website...');
    await loginPage.navigateToLogin();
    await expect(page).toHaveURL(/.*login/);
    await loginPage.takeScreenshot('step-1-website-opened');

    // Step 2: Enter email
    console.log('Step 2: Entering email...');
    await loginPage.enterEmail(testData.credentials.email);
    await loginPage.takeScreenshot('step-2-email-entered');

    // Step 3: Enter password
    console.log('Step 3: Entering password...');
    await loginPage.enterPassword(testData.credentials.password);
    await loginPage.takeScreenshot('step-3-password-entered');

    // Step 4: Click on login form area
    console.log('Step 4: Clicking on login form...');
    await loginPage.click('//div[@class="login gutter-sm"]');
    await loginPage.takeScreenshot('step-4-login-form-clicked');

    // Step 5: Click on "Sign In with Google"
    console.log('Step 5: Clicking Google sign in...');
    await loginPage.clickGoogleSignIn();
    await loginPage.takeScreenshot('step-5-google-signin-clicked');

    // Step 6: Click on Google account
    console.log('Step 6: Selecting Google account...');
    await loginPage.click(`//div[normalize-space()='${testData.credentials.googleEmail}']`);
    await loginPage.takeScreenshot('step-6-google-account-selected');

    // Step 7: Enter email again (fallback)
    console.log('Step 7: Entering email again...');
    await loginPage.enterEmail(testData.credentials.email);
    await loginPage.takeScreenshot('step-7-email-re-entered');

    // Step 8: Enter password again (fallback)
    console.log('Step 8: Entering password again...');
    await loginPage.enterPassword(testData.credentials.password);
    await loginPage.takeScreenshot('step-8-password-re-entered');

    // Step 9: Click on "Reset Password"
    console.log('Step 9: Clicking reset password...');
    await loginPage.clickResetPassword();
    await loginPage.takeScreenshot('step-9-reset-password-clicked');

    // Step 10: Click on "Signing in"
    console.log('Step 10: Clicking sign in button...');
    await loginPage.clickSignIn();
    await loginPage.takeScreenshot('step-10-signin-clicked');

    // Wait for login to complete and verify dashboard
    console.log('Waiting for login to complete...');
    await dashboardPage.waitForDashboardLoad();
    await expect(dashboardPage.isLoggedIn()).toBeTruthy();
    await loginPage.takeScreenshot('step-10-login-completed');

    // Step 11: Click on account circle
    console.log('Step 11: Clicking account circle...');
    await dashboardPage.clickAccountCircle();
    await loginPage.takeScreenshot('step-11-account-circle-clicked');

    // Step 12: Click on "Privacy Policy"
    console.log('Step 12: Clicking privacy policy...');
    await dashboardPage.clickPrivacyPolicy();
    await loginPage.takeScreenshot('step-12-privacy-policy-clicked');

    // Step 13: Click on "Dashboard"
    console.log('Step 13: Clicking dashboard...');
    await dashboardPage.clickDashboardButton();
    await loginPage.takeScreenshot('step-13-dashboard-clicked');

    // Step 14: Click on tenant logo
    console.log('Step 14: Clicking tenant logo...');
    await dashboardPage.clickTenantLogo();
    await loginPage.takeScreenshot('step-14-tenant-logo-clicked');

    // Step 15: Click on "Logout from Cempal"
    console.log('Step 15: Logging out...');
    await dashboardPage.logout();
    await loginPage.takeScreenshot('step-15-logout-completed');

    // Step 16-18: Login again
    console.log('Steps 16-18: Logging in again...');
    await loginPage.enterEmail(testData.credentials.email);
    await loginPage.enterPassword(testData.credentials.password);
    await loginPage.clickSignIn();
    await dashboardPage.waitForDashboardLoad();
    await loginPage.takeScreenshot('step-18-login-again-completed');

    // Step 19: Click on tenant logo
    console.log('Step 19: Clicking tenant logo...');
    await dashboardPage.clickTenantLogo();
    await loginPage.takeScreenshot('step-19-tenant-logo-clicked');

    // Step 20-21: Toggle theme
    console.log('Steps 20-21: Toggling theme...');
    await dashboardPage.toggleTheme();
    await loginPage.takeScreenshot('step-20-theme-toggled-1');
    await dashboardPage.toggleTheme();
    await loginPage.takeScreenshot('step-21-theme-toggled-2');

    // Step 22: Click on "Tenant List"
    console.log('Step 22: Navigating to tenant list...');
    await dashboardPage.navigateToTenantList();
    await tenantManagementPage.waitForTenantListLoad();
    await loginPage.takeScreenshot('step-22-tenant-list-opened');

    // Step 23: Click on "Create new Tenant"
    console.log('Step 23: Clicking create new tenant...');
    await tenantManagementPage.clickCreateNewTenant();
    await loginPage.takeScreenshot('step-23-create-tenant-modal-opened');

    // Step 24: Enter tenant name
    console.log('Step 24: Entering tenant name...');
    await tenantManagementPage.fillTenantName('ee');
    await loginPage.takeScreenshot('step-24-tenant-name-entered');

    // Step 25: Enter domain name
    console.log('Step 25: Entering domain name...');
    await tenantManagementPage.fillDomainName('ee');
    await loginPage.takeScreenshot('step-25-domain-name-entered');

    // Step 26: Enter contact email
    console.log('Step 26: Entering contact email...');
    await tenantManagementPage.fillContactEmail('ee');
    await loginPage.takeScreenshot('step-26-contact-email-entered');

    // Step 27-28: Enter address
    console.log('Steps 27-28: Entering address...');
    await tenantManagementPage.click('//textarea[@id="address"]');
    await tenantManagementPage.fillAddress('eee');
    await loginPage.takeScreenshot('step-28-address-entered');

    // Step 29: Click on modal content
    console.log('Step 29: Clicking modal content...');
    await tenantManagementPage.click('//div[@class="ant-modal-content"]');
    await loginPage.takeScreenshot('step-29-modal-content-clicked');

    // Step 30: Update contact email
    console.log('Step 30: Updating contact email...');
    await tenantManagementPage.fillContactEmail('s@g.com');
    await loginPage.takeScreenshot('step-30-contact-email-updated');

    // Step 31-32: Update domain name
    console.log('Steps 31-32: Updating domain name...');
    await tenantManagementPage.fillDomainName('');
    await tenantManagementPage.fillDomainName('dev.cempal.craftsmenltd.com');
    await loginPage.takeScreenshot('step-32-domain-name-updated');

    // Step 33: Click on "Create Tenant"
    console.log('Step 33: Creating tenant...');
    await tenantManagementPage.clickCreateTenantSubmit();
    await loginPage.takeScreenshot('step-33-tenant-creation-submitted');

    // Step 34: Update domain name again
    console.log('Step 34: Updating domain name again...');
    await tenantManagementPage.fillDomainName('dev.cem0pal.craftsmenltd.com');
    await loginPage.takeScreenshot('step-34-domain-name-updated-again');

    // Step 35: Click on send button
    console.log('Step 35: Clicking send button...');
    await tenantManagementPage.click("//svg[@aria-label='send']");
    await loginPage.takeScreenshot('step-35-send-clicked');

    // Step 36: Click on read_more
    console.log('Step 36: Clicking read more...');
    await tenantManagementPage.clickTenantAction('ee', 'read_more');
    await loginPage.takeScreenshot('step-36-read-more-clicked');

    // Step 37: Click on Close
    console.log('Step 37: Clicking close...');
    await tenantManagementPage.clickCloseModal();
    await loginPage.takeScreenshot('step-37-close-clicked');

    // Step 38: Click on edit_note
    console.log('Step 38: Clicking edit note...');
    await tenantManagementPage.clickTenantAction('ee', 'edit_note');
    await loginPage.takeScreenshot('step-38-edit-note-clicked');

    // Step 39-40: Update address
    console.log('Steps 39-40: Updating address...');
    await tenantManagementPage.click('//textarea[@id="address"]');
    await tenantManagementPage.fillAddress('eee12');
    await loginPage.takeScreenshot('step-40-address-updated');

    // Step 41: Click on Update
    console.log('Step 41: Clicking update...');
    await tenantManagementPage.clickUpdateTenant();
    await loginPage.takeScreenshot('step-41-update-clicked');

    // Step 42: Click on edit_note again
    console.log('Step 42: Clicking edit note again...');
    await tenantManagementPage.clickTenantAction('ee', 'edit_note');
    await loginPage.takeScreenshot('step-42-edit-note-clicked-again');

    // Step 43: Click on modal wrap
    console.log('Step 43: Clicking modal wrap...');
    await tenantManagementPage.click('//div[@class="ant-modal-wrap"]');
    await loginPage.takeScreenshot('step-43-modal-wrap-clicked');

    // Step 44: Click on Update
    console.log('Step 44: Clicking update...');
    await tenantManagementPage.click('//button[@type="submit"]');
    await loginPage.takeScreenshot('step-44-update-submitted');

    // Step 45: Click on groups
    console.log('Step 45: Clicking groups...');
    await tenantManagementPage.clickTenantAction('ee', 'groups');
    await loginPage.takeScreenshot('step-45-groups-clicked');

    // Step 46: Click on close
    console.log('Step 46: Clicking close...');
    await tenantManagementPage.clickCloseModal();
    await loginPage.takeScreenshot('step-46-groups-close-clicked');

    // Step 47: Click on "Super Admins"
    console.log('Step 47: Navigating to super admins...');
    await dashboardPage.navigateToSuperAdmins();
    await userAssignmentPage.waitForSuperAdminsLoad();
    await loginPage.takeScreenshot('step-47-super-admins-opened');

    // Step 48: Click on "Assign"
    console.log('Step 48: Clicking assign...');
    await userAssignmentPage.clickAssignButton('mehedimohammad213@gmail.com');
    await loginPage.takeScreenshot('step-48-assign-clicked');

    // Step 49: Click on "Tenant"
    console.log('Step 49: Clicking tenant dropdown...');
    await userAssignmentPage.clickTenantDropdown();
    await loginPage.takeScreenshot('step-49-tenant-dropdown-clicked');

    // Step 50: Click on tenant option
    console.log('Step 50: Selecting tenant...');
    await userAssignmentPage.selectTenant('@#$%');
    await loginPage.takeScreenshot('step-50-tenant-selected');

    // Step 51: Click on "Group"
    console.log('Step 51: Clicking group dropdown...');
    await userAssignmentPage.clickGroupDropdown();
    await loginPage.takeScreenshot('step-51-group-dropdown-clicked');

    // Step 52: Click on "Tenant Admin"
    console.log('Step 52: Selecting tenant admin...');
    await userAssignmentPage.selectUserGroup('Tenant Admin');
    await loginPage.takeScreenshot('step-52-tenant-admin-selected');

    // Step 53: Click on "Team"
    console.log('Step 53: Clicking team dropdown...');
    await userAssignmentPage.clickTeamDropdown();
    await loginPage.takeScreenshot('step-53-team-dropdown-clicked');

    // Step 54: Click on "Cutting Shoaib Vai"
    console.log('Step 54: Selecting team...');
    await userAssignmentPage.selectTeam('Cutting Shoaib Vai');
    await loginPage.takeScreenshot('step-54-team-selected');

    // Step 55: Click on "Assign"
    console.log('Step 55: Submitting assignment...');
    await userAssignmentPage.clickAssignSubmit();
    await loginPage.takeScreenshot('step-55-assignment-submitted');

    // Step 56: Click on close
    console.log('Step 56: Clicking close...');
    await userAssignmentPage.closeAssignmentModal();
    await loginPage.takeScreenshot('step-56-assignment-close-clicked');

    // Step 57: Click on tenant logo
    console.log('Step 57: Clicking tenant logo...');
    await dashboardPage.clickTenantLogo();
    await loginPage.takeScreenshot('step-57-tenant-logo-clicked');

    // Step 58: Click on "Privacy Policy"
    console.log('Step 58: Clicking privacy policy...');
    await dashboardPage.clickPrivacyPolicy();
    await loginPage.takeScreenshot('step-58-privacy-policy-clicked');

    // Step 59: Click on "Dashboard"
    console.log('Step 59: Clicking dashboard...');
    await dashboardPage.clickDashboardButton();
    await loginPage.takeScreenshot('step-59-dashboard-clicked');

    // Step 60: Click on account circle
    console.log('Step 60: Clicking account circle...');
    await dashboardPage.clickAccountCircle();
    await loginPage.takeScreenshot('step-60-account-circle-clicked');

    // Step 61: Click on "Logout from Cempal"
    console.log('Step 61: Logging out...');
    await dashboardPage.logout();
    await loginPage.takeScreenshot('step-61-logout-completed');

    // Step 62-64: Login again and navigate to dashboard
    console.log('Steps 62-64: Logging in again...');
    await loginPage.enterEmail(testData.credentials.email);
    await loginPage.enterPassword(testData.credentials.password);
    await loginPage.clickSignIn();
    await dashboardPage.waitForDashboardLoad();
    await loginPage.takeScreenshot('step-64-login-again-completed');

    // Step 65: Reload
    console.log('Step 65: Reloading page...');
    await page.reload();
    await loginPage.takeScreenshot('step-65-page-reloaded');

    // Step 66-68: Login again and click logo
    console.log('Steps 66-68: Final login sequence...');
    await loginPage.enterEmail(testData.credentials.email);
    await loginPage.enterPassword(testData.credentials.password);
    await loginPage.clickCempalLogo();
    await loginPage.takeScreenshot('step-68-cempal-logo-clicked');

    // Step 69: Click on "Get Started"
    console.log('Step 69: Clicking get started...');
    await loginPage.clickGetStarted();
    await loginPage.takeScreenshot('step-69-get-started-clicked');

    // Step 70-71: Final login
    console.log('Steps 70-71: Final login...');
    await loginPage.enterEmail(testData.credentials.email);
    await loginPage.enterPassword(testData.credentials.password);
    await loginPage.takeScreenshot('step-71-final-login-completed');

    console.log('Comprehensive test completed successfully!');
  });

  // Additional test cases for specific functionality
  test('Login Functionality Tests', async ({ page }) => {
    console.log('Testing login functionality...');

    await loginPage.navigateToLogin();
    await expect(loginPage.isLoginFormVisible()).toBeTruthy();

    // Test valid login
    await loginPage.login();
    await expect(dashboardPage.isLoggedIn()).toBeTruthy();

    // Test logout
    await dashboardPage.logout();
    await expect(loginPage.isLoginFormVisible()).toBeTruthy();
  });

  test('Tenant Management Tests', async ({ page }) => {
    console.log('Testing tenant management...');

    await loginPage.login();
    await dashboardPage.navigateToTenantList();

    // Test create tenant
    await tenantManagementPage.createTenant();
    await expect(tenantManagementPage.tenantExists('ee')).toBeTruthy();

    // Test edit tenant
    await tenantManagementPage.editTenant('ee', { address: 'Updated Address' });
  });

  test('User Assignment Tests', async ({ page }) => {
    console.log('Testing user assignment...');

    await loginPage.login();
    await dashboardPage.navigateToSuperAdmins();

    // Test user assignment
    await userAssignmentPage.assignUser('mehedimohammad213@gmail.com');
  });

  test('Theme Toggle Tests', async ({ page }) => {
    console.log('Testing theme toggle...');

    await loginPage.login();

    // Test theme toggle
    const initialTheme = await dashboardPage.getCurrentTheme();
    await dashboardPage.toggleTheme();
    const newTheme = await dashboardPage.getCurrentTheme();

    expect(newTheme).not.toBe(initialTheme);
  });

  test('Navigation Tests', async ({ page }) => {
    console.log('Testing navigation...');

    await loginPage.login();

    // Test all navigation links
    await expect(dashboardPage.isTenantListVisible()).toBeTruthy();
    await expect(dashboardPage.isSuperAdminsVisible()).toBeTruthy();
    await expect(dashboardPage.isPrivacyPolicyVisible()).toBeTruthy();
  });
});
