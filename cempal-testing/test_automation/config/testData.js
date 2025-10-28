/**
 * Test data configuration for Cempal Portal testing
 */

const testData = {
  // Base URL
  baseUrl: 'https://dev.cempal.craftsmenltd.com',
  
  // Test credentials
  credentials: {
    email: 'mehedimohammad213@gmail.com',
    password: 'TempPass#60589',
    googleEmail: 'mehedimohammad7728@gmail.com'
  },
  
  // Test tenant data
  tenant: {
    name: 'ee',
    domain: 'dev.cem0pal.craftsmenltd.com',
    contactEmail: 's@g.com',
    address: 'eee12',
    updatedAddress: 'eee12'
  },
  
  // User assignment data
  userAssignment: {
    tenantName: '@#$%',
    userGroup: 'Tenant Admin',
    teamName: 'Cutting Shoaib Vai'
  },
  
  // Browser settings
  browser: {
    viewport: { width: 1920, height: 1080 },
    slowMo: 1000,
    headless: false
  },
  
  // Timeouts
  timeouts: {
    short: 5000,
    medium: 10000,
    long: 30000,
    veryLong: 60000
  },
  
  // Test environment info
  environment: {
    os: 'Linux 6.14.0',
    browser: 'Chrome 141',
    resolution: '1920x1080',
    testDate: '28 Oct 2025 / 22:35:25 GMT+6'
  },
  
  // Selectors for common elements
  selectors: {
    // Login page selectors
    emailInput: "input[id='amplify-id-:r2:']",
    passwordInput: "input[id='amplify-id-:r5:']",
    signInButton: "button[type='submit']",
    googleSignInButton: "//span[@class='amplify-text']",
    resetPasswordButton: "//span[normalize-space()='Reset Password']",
    
    // Dashboard selectors
    accountCircle: "//span[@class='material-symbols-outlined medium-icon-style']",
    logoutButton: "//span[normalize-space()='Logout from Cempal']",
    tenantLogo: "//img[@alt='tenantLogo']",
    dashboardButton: "//span[normalize-space()='Dashboard']",
    privacyPolicyLink: "//a[normalize-space()='Privacy Policy']",
    
    // Tenant management selectors
    tenantListLink: "//a[normalize-space()='Tenant List']",
    createTenantButton: "//span[normalize-space()='Create new Tenant']",
    tenantNameInput: "#tenantName",
    domainNameInput: "#domainName",
    contactEmailInput: "#contact",
    addressTextarea: "#address",
    createTenantSubmitButton: "//span[normalize-space()='Create Tenant']",
    updateTenantButton: "//span[normalize-space()='Update']",
    
    // User assignment selectors
    superAdminsLink: "//a[normalize-space()='Super Admins']",
    assignButton: "//button[@type='button']//span[contains(text(),'Assign')]",
    tenantSelect: "#tenantId",
    groupSelect: "#userGroup",
    teamSelect: "#teamId",
    assignSubmitButton: "//button[@type='submit']//span[contains(text(),'Assign')]"
  }
};

module.exports = testData;
