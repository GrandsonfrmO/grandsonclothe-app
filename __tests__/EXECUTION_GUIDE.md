# Test Execution Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will install vitest and all required testing dependencies.

### 2. Start Development Server

In a terminal window, start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### 3. Run Tests

In another terminal window, run the tests:

#### Option A: Run All Tests
```bash
npm run test:all
```

#### Option B: Run Admin Tests Only
```bash
npm run test:admin
```

#### Option C: Run Buyer Tests Only
```bash
npm run test:buyer
```

#### Option D: Use Automated Script
```bash
# On Linux/Mac
bash scripts/run-tests.sh

# On Windows (PowerShell)
powershell -ExecutionPolicy Bypass -File scripts/run-tests.ps1
```

#### Option E: Interactive UI
```bash
npm run test:ui
```

This opens a browser-based UI to run and monitor tests.

## Detailed Execution Steps

### Step 1: Prepare Environment

1. Ensure `.env.local` is configured with:
   ```env
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   API_BASE=http://localhost:3000
   ```

2. Ensure database is running and migrations are applied:
   ```bash
   npm run db:push
   ```

### Step 2: Start API Server

```bash
npm run dev
```

Wait for the message: "ready - started server on 0.0.0.0:3000"

### Step 3: Run Test Suite

In a new terminal:

```bash
# Run all tests
npm run test:all

# Or run specific suite
npm run test:admin
npm run test:buyer
```

### Step 4: Review Results

Test results will be displayed in the terminal with:
- ✓ Passed tests (green)
- ✗ Failed tests (red)
- ⊙ Skipped tests (yellow)

Results are also saved to:
- `__tests__/results/admin-test.log`
- `__tests__/results/buyer-test.log`

## Test Execution Workflow

### Admin Tests Workflow

```
1. Create test admin account
   ↓
2. Login as admin
   ↓
3. Test Dashboard & Analytics
   ↓
4. Test User Management
   ↓
5. Test Product Management
   ↓
6. Test Order Management
   ↓
7. Test Customer Management
   ↓
8. Test Delivery Zones
   ↓
9. Test Brand Ambassadors
   ↓
10. Test Hero Images
    ↓
11. Test Marketing Campaigns
    ↓
12. Test Notifications
    ↓
13. Test Settings
    ↓
14. Test Authorization & Security
```

### Buyer Tests Workflow

```
1. Create test admin (for product creation)
   ↓
2. Create test product
   ↓
3. Create test buyer account
   ↓
4. Login as buyer
   ↓
5. Test Authentication
   ↓
6. Test Product Browsing & Search
   ↓
7. Test Shopping Cart
   ↓
8. Test Checkout & Orders
   ↓
9. Test Order Management
   ↓
10. Test User Profile
    ↓
11. Test Wishlist
    ↓
12. Test Product Reviews
    ↓
13. Test Notifications
    ↓
14. Test Guest Checkout
    ↓
15. Test Search & Discovery
    ↓
16. Test Authorization & Security
    ↓
17. Test Data Validation
```

## Expected Results

### Successful Admin Test Run

```
✓ ADMIN FUNCTIONALITY SUITE (14 test groups)
  ✓ Dashboard & Analytics (2 tests)
  ✓ User Management (5 tests)
  ✓ Product Management (6 tests)
  ✓ Order Management (3 tests)
  ✓ Customer Management (3 tests)
  ✓ Delivery Zones Management (5 tests)
  ✓ Brand Ambassadors Management (4 tests)
  ✓ Hero Images Management (4 tests)
  ✓ Marketing Campaigns (5 tests)
  ✓ Notifications Management (2 tests)
  ✓ Settings Management (3 tests)
  ✓ Authorization & Security (3 tests)

Test Files  1 passed (1)
     Tests  52 passed (52)
  Duration  45.23s
```

### Successful Buyer Test Run

```
✓ BUYER FUNCTIONALITY SUITE (13 test groups)
  ✓ Authentication (6 tests)
  ✓ Product Browsing & Search (6 tests)
  ✓ Shopping Cart (5 tests)
  ✓ Checkout & Orders (3 tests)
  ✓ Order Management (3 tests)
  ✓ User Profile (3 tests)
  ✓ Wishlist/Favorites (4 tests)
  ✓ Product Reviews (5 tests)
  ✓ Notifications (4 tests)
  ✓ Guest Checkout (1 test)
  ✓ Search & Discovery (3 tests)
  ✓ Authorization & Security (5 tests)
  ✓ Data Validation (3 tests)

Test Files  1 passed (1)
     Tests  58 passed (58)
  Duration  52.18s
```

## Troubleshooting

### Issue: Tests Timeout

**Symptoms:**
```
Error: Test timeout - test did not complete within 30000ms
```

**Solutions:**
1. Ensure API is running: `npm run dev`
2. Check database connection
3. Increase timeout in `vitest.config.ts`:
   ```ts
   testTimeout: 60000, // 60 seconds
   ```

### Issue: Connection Refused

**Symptoms:**
```
Error: connect ECONNREFUSED 127.0.0.1:3000
```

**Solutions:**
1. Start dev server: `npm run dev`
2. Verify API_BASE in `.env.local`
3. Check port 3000 is not in use

### Issue: Authentication Failures

**Symptoms:**
```
Error: Failed to login: 401 Unauthorized
```

**Solutions:**
1. Verify JWT_SECRET is set
2. Check database has users table
3. Verify password hashing works
4. Check auth middleware is configured

### Issue: Database Errors

**Symptoms:**
```
Error: Database connection failed
```

**Solutions:**
1. Verify DATABASE_URL is correct
2. Ensure database is running
3. Run migrations: `npm run db:push`
4. Check database user permissions

### Issue: Tests Fail Intermittently

**Symptoms:**
```
Some tests pass, some fail randomly
```

**Solutions:**
1. Check system resources (CPU, memory)
2. Reduce parallel test execution
3. Increase timeouts
4. Check for race conditions in API

## Advanced Usage

### Run Specific Test Group

```bash
# Run only authentication tests
npm run test -- __tests__/buyer.test.ts -t "Authentication" --run

# Run only product management tests
npm run test -- __tests__/admin.test.ts -t "Product Management" --run
```

### Run with Coverage

```bash
npm run test -- --coverage
```

### Run in Watch Mode

```bash
npm run test:watch
```

Tests will re-run when files change.

### Run with Verbose Output

```bash
npm run test -- --reporter=verbose
```

### Generate HTML Report

```bash
npm run test -- --reporter=html
```

Report will be saved to `__tests__/results.html`

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Run Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run migrations
        run: npm run db:push
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
      
      - name: Run tests
        run: npm run test:all
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          JWT_SECRET: test_secret
          API_BASE: http://localhost:3000
```

## Performance Optimization

### Run Tests in Parallel

```bash
npm run test -- --threads
```

### Run Tests Sequentially

```bash
npm run test -- --no-threads
```

### Limit Parallel Workers

```bash
npm run test -- --threads --maxThreads=2
```

## Debugging Tests

### Enable Debug Logging

```bash
DEBUG=* npm run test:admin
```

### Run Single Test

```bash
npm run test -- __tests__/admin.test.ts -t "should create product" --run
```

### Use Node Debugger

```bash
node --inspect-brk ./node_modules/vitest/vitest.mjs __tests__/admin.test.ts
```

Then open `chrome://inspect` in Chrome.

## Test Data Cleanup

Tests create temporary data with unique timestamps. To clean up:

```bash
# Manual cleanup via admin panel
# Or run cleanup script (if available)
node scripts/clean-test-data.js
```

## Next Steps

After successful test execution:

1. Review test logs for any warnings
2. Check coverage reports
3. Fix any failing tests
4. Commit test files to repository
5. Set up CI/CD pipeline
6. Monitor test performance over time

## Support

For issues:

1. Check `__tests__/README.md` for detailed documentation
2. Review test logs in `__tests__/results/`
3. Check API endpoint documentation
4. Verify environment configuration
5. Check database schema and migrations
