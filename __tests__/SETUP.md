# Test Suite Setup Instructions

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- PostgreSQL database running
- Git (optional, for version control)

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `vitest` - Testing framework
- `@vitest/ui` - UI for test visualization
- All other project dependencies

### 2. Configure Environment

Create or update `.env.local` with:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/your_database

# JWT
JWT_SECRET=your_secret_key_here

# API
API_BASE=http://localhost:3000

# Email (optional, for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Site
SITE_NAME=Your Store Name
SITE_EMAIL=support@yourstore.com
```

### 3. Setup Database

Run migrations to create tables:

```bash
npm run db:push
```

Or if using Drizzle:

```bash
npm run db:generate
npm run db:migrate
```

### 4. Verify Setup

Check that everything is configured:

```bash
# Check database connection
npm run db:studio

# Check API health
curl http://localhost:3000/api/health
```

## Running Tests

### Quick Start

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Run tests
npm run test:all
```

### Detailed Steps

#### Step 1: Start Development Server

```bash
npm run dev
```

Wait for output:
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

#### Step 2: Run Tests (in new terminal)

```bash
# Run all tests
npm run test:all

# Or run specific suite
npm run test:admin
npm run test:buyer

# Or use automated script
bash scripts/run-tests.sh  # Linux/Mac
powershell -ExecutionPolicy Bypass -File scripts/run-tests.ps1  # Windows
```

#### Step 3: Review Results

Tests will output results to terminal and save logs to:
- `__tests__/results/admin-test.log`
- `__tests__/results/buyer-test.log`

## Troubleshooting Setup

### Issue: npm install fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Database connection fails

**Solution:**
1. Verify PostgreSQL is running
2. Check DATABASE_URL is correct
3. Verify database exists
4. Check user permissions

```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

### Issue: Migrations fail

**Solution:**
```bash
# Check migration status
npm run db:studio

# Reset database (WARNING: deletes data)
npm run db:push -- --force

# Or manually run migrations
npm run db:migrate
```

### Issue: API won't start

**Solution:**
1. Check port 3000 is not in use
2. Verify environment variables
3. Check database connection
4. Review error logs

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9  # Linux/Mac
netstat -ano | findstr :3000   # Windows
```

### Issue: Tests timeout

**Solution:**
1. Ensure API is running
2. Check database performance
3. Increase timeout in `vitest.config.ts`
4. Check system resources

## Verification Checklist

Before running tests, verify:

- [ ] Node.js 18+ installed: `node --version`
- [ ] npm installed: `npm --version`
- [ ] PostgreSQL running: `psql --version`
- [ ] `.env.local` configured
- [ ] Database created
- [ ] Migrations applied: `npm run db:push`
- [ ] Dev server starts: `npm run dev`
- [ ] API responds: `curl http://localhost:3000/api/health`
- [ ] vitest installed: `npm list vitest`

## First Test Run

### Expected Output

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

✓ All tests passed!
```

## Common Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run all tests
npm run test:all

# Run admin tests
npm run test:admin

# Run buyer tests
npm run test:buyer

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test -- --coverage

# Run specific test
npm run test -- -t "should create product" --run

# Database commands
npm run db:push          # Apply migrations
npm run db:generate      # Generate migrations
npm run db:migrate       # Run migrations
npm run db:studio        # Open database studio
```

## Next Steps

After successful setup:

1. **Run Tests:** Execute test suites to verify everything works
2. **Review Results:** Check test logs and results
3. **Integrate with CI/CD:** Set up automated testing
4. **Monitor Performance:** Track test execution times
5. **Maintain Tests:** Update tests as features change

## Support Resources

- **Test Documentation:** `__tests__/README.md`
- **Execution Guide:** `__tests__/EXECUTION_GUIDE.md`
- **Test Summary:** `__tests__/TEST_SUMMARY.md`
- **Vitest Docs:** https://vitest.dev
- **Next.js Docs:** https://nextjs.org/docs
- **Drizzle Docs:** https://orm.drizzle.team

## Quick Reference

### File Structure

```
project/
├── __tests__/
│   ├── admin.test.ts          # Admin tests
│   ├── buyer.test.ts          # Buyer tests
│   ├── README.md              # Test documentation
│   ├── SETUP.md               # This file
│   ├── EXECUTION_GUIDE.md     # How to run tests
│   ├── TEST_SUMMARY.md        # Test overview
│   └── results/               # Test results (generated)
├── scripts/
│   ├── run-tests.sh           # Test runner (Linux/Mac)
│   └── run-tests.ps1          # Test runner (Windows)
├── vitest.config.ts           # Vitest configuration
├── package.json               # Dependencies and scripts
└── .env.local                 # Environment variables
```

### Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| DATABASE_URL | Database connection | postgresql://user:pass@localhost/db |
| JWT_SECRET | JWT signing key | your_secret_key_here |
| API_BASE | API base URL | http://localhost:3000 |
| SMTP_HOST | Email server | smtp.gmail.com |
| SMTP_PORT | Email port | 587 |
| SMTP_USER | Email user | your_email@gmail.com |
| SMTP_PASS | Email password | your_app_password |

## Troubleshooting Checklist

If tests fail, check:

- [ ] API is running on port 3000
- [ ] Database is connected
- [ ] Environment variables are set
- [ ] Migrations have been applied
- [ ] No other process using port 3000
- [ ] System has enough resources
- [ ] Network connectivity is good
- [ ] Firewall allows localhost connections

## Getting Help

1. Check test logs: `__tests__/results/*.log`
2. Review error messages in terminal
3. Check environment configuration
4. Verify database setup
5. Review test documentation
6. Check API logs

## Success Indicators

✓ All dependencies installed
✓ Database connected
✓ Dev server running
✓ Tests execute without errors
✓ All tests pass
✓ Results saved to files

You're ready to run the test suite!
