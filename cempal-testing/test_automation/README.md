# Cempal Portal Test Automation

This repository contains comprehensive automated tests for the Cempal Portal using Playwright and JavaScript.

## Test Overview

- **Portal URL**: https://dev.cempal.craftsmenltd.com/
- **Test Framework**: Playwright
- **Language**: JavaScript
- **Test Types**: Functional, Security, Performance, Accessibility

## Test Credentials

- **Email**: mehedimohammad213@gmail.com
- **Password**: TempPass#60589
- **Google Email**: mehedimohammad7728@gmail.com

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- Chrome, Firefox, or Safari browser

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cempal-testing/test_automation
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:
```env
TEST_PASSWORD=TempPass#60589
BASE_URL=https://dev.cempal.craftsmenltd.com
```

### Test Configuration

The test configuration is located in `config/testData.js`. You can modify:
- Test credentials
- Test data
- Selectors
- Timeouts
- Browser settings

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test Suites
```bash
# Run comprehensive test (71 steps)
npm run test:comprehensive

# Run security tests
npm run test:security

# Run performance tests
npm run test:performance

# Run accessibility tests
npm run test:accessibility

# Run login tests
npm run test:login

# Run tenant management tests
npm run test:tenant
```

### Run Tests with Different Options
```bash
# Run tests in headed mode (visible browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run tests with UI mode
npm run test:ui

# Run tests in parallel
npx playwright test --workers=4
```

### Run Tests on Different Browsers
```bash
# Run on Chrome
npx playwright test --project=chromium

# Run on Firefox
npx playwright test --project=firefox

# Run on Safari
npx playwright test --project=webkit

# Run on mobile
npx playwright test --project="Mobile Chrome"
```

## Test Structure

```
test_automation/
├── config/
│   └── testData.js              # Test configuration and data
├── pages/
│   ├── BasePage.js              # Base page object class
│   ├── LoginPage.js             # Login page object
│   ├── DashboardPage.js         # Dashboard page object
│   ├── TenantManagementPage.js  # Tenant management page object
│   └── UserAssignmentPage.js    # User assignment page object
├── tests/
│   ├── cempal-comprehensive-test.spec.js  # Main 71-step test
│   ├── security-tests.spec.js             # Security tests
│   ├── performance-tests.spec.js          # Performance tests
│   └── accessibility-tests.spec.js        # Accessibility tests
├── reports/                      # Test reports
├── screenshots/                  # Test screenshots
├── allure-results/              # Allure test results
├── package.json                 # Dependencies and scripts
├── playwright.config.js         # Playwright configuration
└── README.md                    # This file
```

## Test Categories

### 1. Comprehensive Test (71 Steps)
- Complete user journey from login to logout
- Tenant creation and management
- User assignment functionality
- Theme toggling
- Navigation testing

### 2. Security Tests
- Authentication security
- Session management
- Authorization testing
- Input validation
- Password security
- CSRF protection
- HTTPS enforcement

### 3. Performance Tests
- Page load times
- API response times
- Memory usage
- Concurrent user simulation
- Large dataset performance
- Caching performance

### 4. Accessibility Tests
- Keyboard navigation
- ARIA labels and roles
- Color contrast
- Focus management
- Screen reader compatibility
- Error message accessibility
- Responsive design
- Form validation

## Test Reports

### HTML Report
After running tests, view the HTML report:
```bash
npm run report
```

### Allure Report
Generate and view Allure report:
```bash
# Generate Allure report
npx allure generate allure-results --clean

# Open Allure report
npx allure open
```

## Screenshots

Screenshots are automatically captured:
- On test failures
- At key test steps
- Stored in `screenshots/` directory

## Debugging

### Debug Mode
Run tests in debug mode to step through them:
```bash
npm run test:debug
```

### Trace Viewer
View detailed test execution traces:
```bash
npx playwright show-trace trace.zip
```

### Console Logs
Enable console logging:
```bash
npx playwright test --headed --debug
```

## Continuous Integration

### GitHub Actions
The tests can be integrated with GitHub Actions:

```yaml
name: Cempal Portal Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npx playwright install --with-deps
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Troubleshooting

### Common Issues

1. **Browser not found**: Run `npx playwright install`
2. **Timeout errors**: Increase timeout in `playwright.config.js`
3. **Element not found**: Check selectors in `config/testData.js`
4. **Login failures**: Verify credentials in `.env` file

### Debug Commands

```bash
# Run specific test file
npx playwright test tests/cempal-comprehensive-test.spec.js

# Run with specific browser
npx playwright test --project=chromium

# Run with specific test name
npx playwright test --grep "login"

# Run with retries
npx playwright test --retries=3
```

## Contributing

1. Follow the existing code structure
2. Add proper comments and documentation
3. Use meaningful test names
4. Add appropriate assertions
5. Update this README if needed

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review test logs and screenshots
3. Create an issue in the repository
4. Contact the testing team

## License

This project is licensed under the MIT License.
