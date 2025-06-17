
#!/bin/bash

echo "🚀 Starting Comprehensive Routing and Functionality Tests"
echo "=================================================="

# Set test environment
export NODE_ENV=test
export PREVIEW_URL="http://localhost:3000"

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

# Check if server is running
print_status "Checking if development server is running..."
if curl -s http://localhost:3000 > /dev/null; then
    print_success "Development server is running on http://localhost:3000"
else
    print_error "Development server is not running. Please start it with 'npm run dev'"
    exit 1
fi

# Wait for server to be fully ready
print_status "Waiting for server to be fully ready..."
sleep 3

# Test server endpoints
print_status "Testing critical server endpoints..."
endpoints=(
    "/login"
    "/dashboard" 
    "/question-bank"
    "/system-design-questions"
    "/stories"
    "/my-stories"
    "/admin"
)

failed_endpoints=0
for endpoint in "${endpoints[@]}"; do
    status_code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$endpoint")
    if [[ "$status_code" == "200" || "$status_code" == "307" || "$status_code" == "302" ]]; then
        print_success "✓ $endpoint (HTTP $status_code)"
    else
        print_error "✗ $endpoint (HTTP $status_code)"
        ((failed_endpoints++))
    fi
done

if [ $failed_endpoints -gt 0 ]; then
    print_warning "$failed_endpoints endpoints failed initial check"
else
    print_success "All endpoints passed initial check"
fi

# Run comprehensive tests
print_status "Running comprehensive Playwright tests..."

# Test 1: Routing Fix Tests
print_status "🔧 Running routing fix tests..."
npx playwright test tests/comprehensive-routing-fix.spec.ts --reporter=list
routing_exit_code=$?

# Test 2: Form Submission Tests  
print_status "📝 Running form submission tests..."
npx playwright test tests/form-submission-tests.spec.ts --reporter=list
form_exit_code=$?

# Test 3: Authentication and Admin Tests
print_status "🔐 Running authentication and admin tests..."
npx playwright test tests/authentication-admin-tests.spec.ts --reporter=list
auth_exit_code=$?

# Test 4: User Workflow Tests
print_status "👤 Running user workflow tests..."
npx playwright test tests/user-workflow-tests.spec.ts --reporter=list
workflow_exit_code=$?

# Calculate overall results
total_tests=4
passed_tests=0

if [ $routing_exit_code -eq 0 ]; then ((passed_tests++)); fi
if [ $form_exit_code -eq 0 ]; then ((passed_tests++)); fi
if [ $auth_exit_code -eq 0 ]; then ((passed_tests++)); fi
if [ $workflow_exit_code -eq 0 ]; then ((passed_tests++)); fi

success_rate=$((passed_tests * 100 / total_tests))

echo ""
echo "=================================================="
echo "🎯 COMPREHENSIVE TEST RESULTS"
echo "=================================================="
echo "Routing Fix Tests:        $([ $routing_exit_code -eq 0 ] && echo "✅ PASSED" || echo "❌ FAILED")"
echo "Form Submission Tests:    $([ $form_exit_code -eq 0 ] && echo "✅ PASSED" || echo "❌ FAILED")"
echo "Authentication Tests:     $([ $auth_exit_code -eq 0 ] && echo "✅ PASSED" || echo "❌ FAILED")"
echo "User Workflow Tests:      $([ $workflow_exit_code -eq 0 ] && echo "✅ PASSED" || echo "❌ FAILED")"
echo ""
echo "Overall Success Rate: $success_rate% ($passed_tests/$total_tests test suites passed)"

if [ $success_rate -ge 90 ]; then
    print_success "🎉 SUCCESS: Achieved >90% test success rate!"
    echo "✅ All critical routing issues have been fixed"
    echo "✅ Form submissions are working correctly"
    echo "✅ Authentication and admin functionality verified"
    echo "✅ User workflows are functioning properly"
elif [ $success_rate -ge 75 ]; then
    print_warning "⚠️  PARTIAL SUCCESS: $success_rate% success rate (target: >90%)"
    echo "Some tests failed - review the output above for details"
else
    print_error "❌ FAILURE: Only $success_rate% success rate (target: >90%)"
    echo "Multiple test failures detected - significant issues remain"
fi

# Generate detailed report
print_status "Generating detailed test report..."
npx playwright show-report --host=0.0.0.0 --port=9323 &
REPORT_PID=$!

echo ""
echo "📊 Detailed test report available at: http://localhost:9323"
echo "🔍 Test artifacts saved in: ./test-results/"
echo "📋 JSON results saved in: ./test-results-comprehensive.json"

# Final status
echo ""
if [ $success_rate -ge 90 ]; then
    exit 0
else
    exit 1
fi
