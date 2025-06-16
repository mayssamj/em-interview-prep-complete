
#!/bin/bash

# Comprehensive test runner script for EM Interview Prep

set -e

echo "🧪 Running EM Interview Prep Test Suite"
echo "======================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js and npm are available
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
fi

# Generate Prisma client
print_status "Generating Prisma client..."
npx prisma generate

# Run different test suites
echo ""
print_status "Running Unit Tests..."
npm run test:unit || {
    print_warning "Some unit tests failed"
}

echo ""
print_status "Running API Tests..."
npm run test:api || {
    print_warning "Some API tests failed"
}

echo ""
print_status "Running Integration Tests..."
npm run test:integration || {
    print_warning "Some integration tests failed"
}

echo ""
print_status "Running Database Tests..."
npm run test:database || {
    print_warning "Some database tests failed"
}

echo ""
print_status "Running All Tests with Coverage..."
npm run test:coverage || {
    print_warning "Some tests failed during coverage run"
}

echo ""
print_status "Generating Test Report..."
npm run test:report || {
    print_warning "Test report generation failed"
}

echo ""
print_success "Test suite execution completed!"
echo ""
echo "📊 Check the coverage report in coverage/lcov-report/index.html"
echo "📋 Check the test report in test-results/"
echo ""
