# Test Suite Documentation

## Overview

This directory contains comprehensive test suites for all admin and buyer functionality in the application.

### Test Files

- **admin.test.ts** - Complete admin functionality test suite
- **buyer.test.ts** - Complete buyer/customer functionality test suite

## Admin Functionality Tests

The admin test suite covers all administrative features:

### 1. Dashboard & Analytics
- Fetch dashboard metrics (revenue, orders, customers, products)
- Fetch revenue trends
- Fetch order status distribution

### 2. User Management
- List all users
- Get user details
- Update user status (active, suspended, blocked)
- Suspend users with reasons
- Reactivate users

### 3. Product Management
- Create products with details (name, description, price, stock, colors, sizes)
- List all products
- Get product details
- Update product information
- Update product stock
- Delete products

### 4. Order Management
- List all orders
- Get order details
- Update order status (pending → processing → shipped → delivered)
- Track payment status

### 5. Customer Management
- List all customers
- Get customer details
- View customer order history
- Manage customer status

### 6. Delivery Zones
- Create delivery zones
- List zones
- Get zone details
- Update zone pricing
- Delete zones

### 7. Brand Ambassadors
- Create ambassador profiles
- List ambassadors
- Update ambassador information
- Delete ambassadors

### 8. Hero Images
- Create hero banners
- List hero images
- Update banner details
- Delete banners

### 9. Marketing Campaigns
- Create campaigns (newsletter, promotion, etc.)
- List campaigns
- Get campaign details
- Update campaign status
- Delete campaigns

### 10. Notifications
- List notifications
- Get unread count
- Mark as read
- Delete notifications

### 11. Settings
- Get theme settings
- Update theme colors
- Get logo settings
- Update logo

### 12. Authorization & Security
- Deny access without token
- Deny access with invalid token
- Deny non-admin access to admin routes

## Buyer Functionality Tests

The buyer test suite covers all customer features:

### 1. Authentication
- Signup new buyer account
- Login with credentials
- Fail login with wrong password
- Fail login with non-existent email
- Get current user info
- Fail without authentication token

### 2. Product Browsing & Search
- List all products
- Get product details
- Search products by keyword
- Filter by category
- Sort products
- Paginate results
- Get product statistics

### 3. Shopping Cart
- Add products to cart
- Get cart items
- Update item quantity
- Remove items from cart
- Fail without authentication

### 4. Checkout & Orders
- Create orders
- Get order details
- Fail without delivery information
- Fail without authentication

### 5. Order Management
- List buyer orders
- Track order status
- Prevent access to other buyer orders

### 6. User Profile
- Get profile information
- Update profile information
- Get profile statistics (orders, spending, favorites)

### 7. Wishlist/Favorites
- Add products to wishlist
- Get wishlist items
- Remove from wishlist
- Fail without authentication

### 8. Product Reviews
- Submit product reviews
- Get product reviews
- Update reviews
- Delete reviews
- Fail with invalid rating

### 9. Notifications
- Get notifications
- Get unread count
- Mark notification as read
- Mark all as read

### 10. Guest Checkout
- Create guest orders
- Guest email and name handling

### 11. Search & Discovery
- Search with filters
- Sort search results
- Paginate search results

### 12. Authorization & Security
- Deny access without token
- Deny access with invalid token
- Prevent buyer access to admin routes
- Validate email format
- Validate password strength
- Prevent duplicate email signup

### 13. Data Validation
- Validate product quantity
- Validate phone number format
- Validate delivery address

## Running the Tests

### Prerequisites

1. Node.js and npm installed
2. Development server running: `npm run dev`
3. Database configured and running
4. Environment variables set in `.env.local`

### Run All Tests

```bash
# Using npm
npm run test -- __tests__/admin.test.ts __tests__/buyer.test.ts --run

# Using the provided scripts
# On Linux/Mac
bash scripts/run-tests.sh

# On Windows (PowerShell)
powershell -ExecutionPolicy Bypass -File scripts/run-tests.ps1
```

### Run Specific Test Suite

```bash
# Admin tests only
npm run test -- __tests__/admin.test.ts --run

# Buyer tests only
npm run test -- __tests__/buyer.test.ts --run
```

### Run Specific Test Group

```bash
# Run only authentication tests
npm run test -- __tests__/buyer.test.ts -t "Authentication" --run

# Run only product management tests
npm run test -- __tests__/admin.test.ts -t "Product Management" --run
```

### Watch Mode (Development)

```bash
# Run tests in watch mode
npm run test -- __tests__/admin.test.ts

# Run specific test file in watch mode
npm run test -- __tests__/buyer.test.ts
```

## Test Results

Test results are saved to `__tests__/results/`:

- `admin-test.log` - Admin test execution log
- `buyer-test.log` - Buyer test execution log
- `results.json` - JSON format results
- `results.html` - HTML format results

## Environment Variables

Ensure these are set in `.env.local`:

```env
# API Configuration
API_BASE=http://localhost:3000

# Database
DATABASE_URL=your_database_url

# JWT Secret
JWT_SECRET=your_jwt_secret

# Email (for notifications)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
```

## Test Data

Tests create temporary test data with unique identifiers (using timestamps) to avoid conflicts:

- Test admin: `admin-test-{timestamp}@test.com`
- Test buyer: `buyer-test-{timestamp}@test.com`
- Test products: `Test Product {timestamp}`
- Test orders: Created with unique delivery info

All test data is isolated and doesn't affect production data.

## Troubleshooting

### Tests Timeout

If tests timeout:
1. Ensure API is running: `npm run dev`
2. Check database connection
3. Increase timeout in `vitest.config.ts`

### Authentication Failures

If auth tests fail:
1. Check JWT_SECRET is set correctly
2. Verify database has users table
3. Check password hashing is working

### API Connection Errors

If API connection fails:
1. Ensure dev server is running on port 3000
2. Check API_BASE environment variable
3. Verify CORS is configured correctly

### Database Errors

If database operations fail:
1. Check DATABASE_URL is correct
2. Verify database is running
3. Check migrations have been run
4. Verify user has proper permissions

## Test Coverage

The test suites provide comprehensive coverage of:

- ✓ All admin CRUD operations
- ✓ All buyer shopping features
- ✓ Authentication and authorization
- ✓ Data validation
- ✓ Error handling
- ✓ Security checks
- ✓ Edge cases

## Performance Benchmarks

Expected test execution times:

- Admin tests: ~30-60 seconds
- Buyer tests: ~30-60 seconds
- Total: ~60-120 seconds

Times may vary based on:
- Network latency
- Database performance
- System resources
- API response times

## Continuous Integration

To integrate with CI/CD:

```yaml
# Example GitHub Actions
- name: Run Tests
  run: |
    npm install
    npm run build
    npm run test -- __tests__/*.test.ts --run
```

## Contributing

When adding new features:

1. Add corresponding tests to the appropriate test file
2. Follow existing test patterns
3. Use descriptive test names
4. Include both success and failure cases
5. Run full test suite before committing

## Support

For issues or questions about tests:

1. Check test logs in `__tests__/results/`
2. Review test file comments
3. Check API endpoint documentation
4. Verify environment configuration
