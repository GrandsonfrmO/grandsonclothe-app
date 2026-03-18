#!/bin/bash

# Test Suite Runner Script
# Runs admin and buyer test suites with detailed reporting

set -e

echo "=========================================="
echo "STARTING TEST SUITE EXECUTION"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if API is running
echo "Checking if API is running on http://localhost:3000..."
if ! curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
  echo -e "${YELLOW}Warning: API might not be running. Make sure to start the dev server.${NC}"
  echo "Run: npm run dev"
  echo ""
fi

# Create results directory
mkdir -p __tests__/results

# Run Admin Tests
echo -e "${YELLOW}=========================================="
echo "RUNNING ADMIN FUNCTIONALITY TESTS"
echo "==========================================${NC}"
echo ""

if npm run test -- __tests__/admin.test.ts --run 2>&1 | tee __tests__/results/admin-test.log; then
  echo -e "${GREEN}✓ Admin tests completed${NC}"
  ADMIN_PASSED=true
else
  echo -e "${RED}✗ Admin tests failed${NC}"
  ADMIN_PASSED=false
fi

echo ""
echo ""

# Run Buyer Tests
echo -e "${YELLOW}=========================================="
echo "RUNNING BUYER FUNCTIONALITY TESTS"
echo "==========================================${NC}"
echo ""

if npm run test -- __tests__/buyer.test.ts --run 2>&1 | tee __tests__/results/buyer-test.log; then
  echo -e "${GREEN}✓ Buyer tests completed${NC}"
  BUYER_PASSED=true
else
  echo -e "${RED}✗ Buyer tests failed${NC}"
  BUYER_PASSED=false
fi

echo ""
echo ""

# Summary
echo -e "${YELLOW}=========================================="
echo "TEST EXECUTION SUMMARY"
echo "==========================================${NC}"
echo ""

if [ "$ADMIN_PASSED" = true ]; then
  echo -e "${GREEN}✓ Admin Functionality Tests: PASSED${NC}"
else
  echo -e "${RED}✗ Admin Functionality Tests: FAILED${NC}"
fi

if [ "$BUYER_PASSED" = true ]; then
  echo -e "${GREEN}✓ Buyer Functionality Tests: PASSED${NC}"
else
  echo -e "${RED}✗ Buyer Functionality Tests: FAILED${NC}"
fi

echo ""
echo "Test logs saved to:"
echo "  - __tests__/results/admin-test.log"
echo "  - __tests__/results/buyer-test.log"
echo ""

# Exit with appropriate code
if [ "$ADMIN_PASSED" = true ] && [ "$BUYER_PASSED" = true ]; then
  echo -e "${GREEN}=========================================="
  echo "ALL TESTS PASSED ✓"
  echo "==========================================${NC}"
  exit 0
else
  echo -e "${RED}=========================================="
  echo "SOME TESTS FAILED ✗"
  echo "==========================================${NC}"
  exit 1
fi
