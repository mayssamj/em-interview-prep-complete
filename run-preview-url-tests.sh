
#!/bin/bash

# Preview URL Testing Script
# Tests the application functionality on the preview URL

set -e

PREVIEW_URL="https://125d7b9e76-3000.preview.abacusai.app"
PROJECT_DIR="/home/ubuntu/em-interview-prep"

echo "🚀 Starting Preview URL Testing Suite"
echo "Preview URL: $PREVIEW_URL"
echo "Project Directory: $PROJECT_DIR"
echo "Timestamp: $(date)"
echo "=================================="

cd "$PROJECT_DIR"

# Set environment variable for preview URL
export PREVIEW_URL="$PREVIEW_URL"

# Clean up previous test results
echo "🧹 Cleaning up previous test results..."
rm -rf test-results/
rm -rf playwright-report/
rm -f test-results-preview.json

# Install dependencies if needed
echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Install Playwright browsers if needed
echo "🌐 Installing Playwright browsers..."
npx playwright install chromium

# Run connection tests first
echo "🔗 Running connection tests..."
npx playwright test tests/preview-url-connection-tests.spec.ts --reporter=list

# Run authentication tests
echo "🔐 Running authentication tests..."
npx playwright test tests/preview-url-authentication-tests.spec.ts --reporter=list

# Run navigation tests
echo "🧭 Running navigation tests..."
npx playwright test tests/preview-url-navigation-tests.spec.ts --reporter=list

# Run form submission tests
echo "📝 Running form submission tests..."
npx playwright test tests/preview-url-form-submission-tests.spec.ts --reporter=list

# Run comprehensive workflow tests
echo "🔄 Running comprehensive workflow tests..."
npx playwright test tests/preview-url-comprehensive-workflow-tests.spec.ts --reporter=list

# Run all preview URL tests together for final verification
echo "🎯 Running all preview URL tests together..."
npx playwright test tests/preview-url-*.spec.ts --reporter=json --output-file=test-results-preview.json

# Generate HTML report
echo "📊 Generating test report..."
npx playwright show-report --host=0.0.0.0 --port=9324 &
REPORT_PID=$!

# Parse test results
echo "📈 Parsing test results..."
if [ -f "test-results-preview.json" ]; then
    TOTAL_TESTS=$(jq '.stats.total' test-results-preview.json 2>/dev/null || echo "0")
    PASSED_TESTS=$(jq '.stats.passed' test-results-preview.json 2>/dev/null || echo "0")
    FAILED_TESTS=$(jq '.stats.failed' test-results-preview.json 2>/dev/null || echo "0")
    
    if [ "$TOTAL_TESTS" -gt 0 ]; then
        SUCCESS_RATE=$(echo "scale=2; $PASSED_TESTS * 100 / $TOTAL_TESTS" | bc -l 2>/dev/null || echo "0")
    else
        SUCCESS_RATE="0"
    fi
    
    echo "=================================="
    echo "📊 TEST RESULTS SUMMARY"
    echo "=================================="
    echo "Total Tests: $TOTAL_TESTS"
    echo "Passed: $PASSED_TESTS"
    echo "Failed: $FAILED_TESTS"
    echo "Success Rate: ${SUCCESS_RATE}%"
    echo "Preview URL: $PREVIEW_URL"
    echo "Timestamp: $(date)"
    echo "=================================="
    
    # Check if we meet the success criteria (>90%)
    if (( $(echo "$SUCCESS_RATE >= 90" | bc -l) )); then
        echo "✅ SUCCESS: Test success rate (${SUCCESS_RATE}%) meets the >90% requirement!"
        echo "🎉 Preview URL application is working correctly!"
        EXIT_CODE=0
    else
        echo "❌ FAILURE: Test success rate (${SUCCESS_RATE}%) is below the 90% requirement."
        echo "🔧 Some tests failed. Check the detailed report for issues."
        EXIT_CODE=1
    fi
else
    echo "❌ ERROR: Could not find test results file."
    EXIT_CODE=1
fi

# Test specific critical endpoints
echo "🔍 Testing critical API endpoints..."
ENDPOINT_TESTS=0
ENDPOINT_PASSED=0

# Test health endpoint
if curl -s -f "$PREVIEW_URL/api/health" > /dev/null; then
    echo "✅ Health endpoint: PASS"
    ENDPOINT_PASSED=$((ENDPOINT_PASSED + 1))
else
    echo "❌ Health endpoint: FAIL"
fi
ENDPOINT_TESTS=$((ENDPOINT_TESTS + 1))

# Test login page
if curl -s -f "$PREVIEW_URL/login" > /dev/null; then
    echo "✅ Login page: PASS"
    ENDPOINT_PASSED=$((ENDPOINT_PASSED + 1))
else
    echo "❌ Login page: FAIL"
fi
ENDPOINT_TESTS=$((ENDPOINT_TESTS + 1))

# Test dashboard redirect
if curl -s -I "$PREVIEW_URL/dashboard" | grep -q "307\|302\|200"; then
    echo "✅ Dashboard endpoint: PASS"
    ENDPOINT_PASSED=$((ENDPOINT_PASSED + 1))
else
    echo "❌ Dashboard endpoint: FAIL"
fi
ENDPOINT_TESTS=$((ENDPOINT_TESTS + 1))

ENDPOINT_SUCCESS_RATE=$(echo "scale=2; $ENDPOINT_PASSED * 100 / $ENDPOINT_TESTS" | bc -l)
echo "🌐 Endpoint Tests: $ENDPOINT_PASSED/$ENDPOINT_TESTS passed (${ENDPOINT_SUCCESS_RATE}%)"

# Final summary
echo "=================================="
echo "🏁 FINAL SUMMARY"
echo "=================================="
echo "Preview URL: $PREVIEW_URL"
echo "Playwright Tests: $PASSED_TESTS/$TOTAL_TESTS passed (${SUCCESS_RATE}%)"
echo "Endpoint Tests: $ENDPOINT_PASSED/$ENDPOINT_TESTS passed (${ENDPOINT_SUCCESS_RATE}%)"
echo "Report available at: http://localhost:9324"
echo "Timestamp: $(date)"

if [ $EXIT_CODE -eq 0 ]; then
    echo "🎉 ALL TESTS PASSED - Application is working correctly on preview URL!"
else
    echo "⚠️  SOME TESTS FAILED - Check the detailed report for issues."
fi

echo "=================================="

# Keep report server running for a bit
sleep 5
kill $REPORT_PID 2>/dev/null || true

exit $EXIT_CODE
