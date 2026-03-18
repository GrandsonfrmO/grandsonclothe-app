# Test Suite Runner Script (PowerShell)
# Runs admin and buyer test suites with detailed reporting

$ErrorActionPreference = "Continue"

Write-Host "==========================================" -ForegroundColor Yellow
Write-Host "STARTING TEST SUITE EXECUTION" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Yellow
Write-Host ""

# Check if API is running
Write-Host "Checking if API is running on http://localhost:3000..." -ForegroundColor Cyan
try {
  $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -ErrorAction SilentlyContinue
  Write-Host "✓ API is running" -ForegroundColor Green
} catch {
  Write-Host "⚠ Warning: API might not be running. Make sure to start the dev server." -ForegroundColor Yellow
  Write-Host "Run: npm run dev" -ForegroundColor Yellow
  Write-Host ""
}

# Create results directory
New-Item -ItemType Directory -Path "__tests__/results" -Force | Out-Null

# Run Admin Tests
Write-Host "==========================================" -ForegroundColor Yellow
Write-Host "RUNNING ADMIN FUNCTIONALITY TESTS" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Yellow
Write-Host ""

$adminTestOutput = npm run test -- __tests__/admin.test.ts --run 2>&1
$adminTestOutput | Tee-Object -FilePath "__tests__/results/admin-test.log"

if ($LASTEXITCODE -eq 0) {
  Write-Host "✓ Admin tests completed" -ForegroundColor Green
  $adminPassed = $true
} else {
  Write-Host "✗ Admin tests failed" -ForegroundColor Red
  $adminPassed = $false
}

Write-Host ""
Write-Host ""

# Run Buyer Tests
Write-Host "==========================================" -ForegroundColor Yellow
Write-Host "RUNNING BUYER FUNCTIONALITY TESTS" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Yellow
Write-Host ""

$buyerTestOutput = npm run test -- __tests__/buyer.test.ts --run 2>&1
$buyerTestOutput | Tee-Object -FilePath "__tests__/results/buyer-test.log"

if ($LASTEXITCODE -eq 0) {
  Write-Host "✓ Buyer tests completed" -ForegroundColor Green
  $buyerPassed = $true
} else {
  Write-Host "✗ Buyer tests failed" -ForegroundColor Red
  $buyerPassed = $false
}

Write-Host ""
Write-Host ""

# Summary
Write-Host "==========================================" -ForegroundColor Yellow
Write-Host "TEST EXECUTION SUMMARY" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Yellow
Write-Host ""

if ($adminPassed) {
  Write-Host "✓ Admin Functionality Tests: PASSED" -ForegroundColor Green
} else {
  Write-Host "✗ Admin Functionality Tests: FAILED" -ForegroundColor Red
}

if ($buyerPassed) {
  Write-Host "✓ Buyer Functionality Tests: PASSED" -ForegroundColor Green
} else {
  Write-Host "✗ Buyer Functionality Tests: FAILED" -ForegroundColor Red
}

Write-Host ""
Write-Host "Test logs saved to:" -ForegroundColor Cyan
Write-Host "  - __tests__/results/admin-test.log"
Write-Host "  - __tests__/results/buyer-test.log"
Write-Host ""

# Exit with appropriate code
if ($adminPassed -and $buyerPassed) {
  Write-Host "==========================================" -ForegroundColor Green
  Write-Host "ALL TESTS PASSED ✓" -ForegroundColor Green
  Write-Host "==========================================" -ForegroundColor Green
  exit 0
} else {
  Write-Host "==========================================" -ForegroundColor Red
  Write-Host "SOME TESTS FAILED ✗" -ForegroundColor Red
  Write-Host "==========================================" -ForegroundColor Red
  exit 1
}
