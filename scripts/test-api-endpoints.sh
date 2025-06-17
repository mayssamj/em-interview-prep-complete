
#!/bin/bash

echo "🚀 Testing EM Interview Prep API Endpoints"
echo "=========================================="

BASE_URL="http://localhost:3000"
COOKIE_FILE="/tmp/test_cookies.txt"
RESULTS_FILE="/tmp/test_results.txt"

# Initialize results
echo "Test Results:" > $RESULTS_FILE
PASSED=0
FAILED=0

# Test function
test_endpoint() {
    local name="$1"
    local method="$2"
    local endpoint="$3"
    local data="$4"
    local expected_status="$5"
    
    echo "🧪 Testing: $name"
    
    if [ "$method" = "POST" ] && [ -n "$data" ]; then
        response=$(curl -s -w "%{http_code}" -X POST \
            -H "Content-Type: application/json" \
            -d "$data" \
            -b "$COOKIE_FILE" -c "$COOKIE_FILE" \
            "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "%{http_code}" \
            -b "$COOKIE_FILE" -c "$COOKIE_FILE" \
            "$BASE_URL$endpoint")
    fi
    
    status_code="${response: -3}"
    
    if [ "$status_code" = "$expected_status" ]; then
        echo "✅ PASSED: $name (Status: $status_code)"
        echo "✅ PASSED: $name (Status: $status_code)" >> $RESULTS_FILE
        ((PASSED++))
    else
        echo "❌ FAILED: $name (Expected: $expected_status, Got: $status_code)"
        echo "❌ FAILED: $name (Expected: $expected_status, Got: $status_code)" >> $RESULTS_FILE
        ((FAILED++))
    fi
}

# Clear cookies
rm -f $COOKIE_FILE

# Test 1: Server Health
test_endpoint "Server Health Check" "GET" "/login" "" "200"

# Test 2: Admin Login
test_endpoint "Admin Login" "POST" "/api/auth/login" '{"username":"admin","password":"adminadmin"}' "200"

# Test 3: Admin Stats (requires auth)
test_endpoint "Admin Stats API" "GET" "/api/admin/stats" "" "200"

# Test 4: Admin Users (requires auth)
test_endpoint "Admin Users API" "GET" "/api/admin/users" "" "200"

# Test 5: Companies API
test_endpoint "Companies API" "GET" "/api/companies" "" "200"

# Test 6: Questions API
test_endpoint "Questions API" "GET" "/api/questions" "" "200"

# Test 7: System Design Questions
test_endpoint "System Design Questions API" "GET" "/api/system-design-questions" "" "200"

# Test 8: System Design Frameworks
test_endpoint "System Design Frameworks API" "GET" "/api/system-design-frameworks" "" "200"

# Test 9: Dashboard Page (requires auth)
test_endpoint "Dashboard Page" "GET" "/dashboard" "" "200"

# Test 10: Question Bank Page (requires auth)
test_endpoint "Question Bank Page" "GET" "/question-bank" "" "200"

# Test 11: Admin Page (requires auth)
test_endpoint "Admin Page" "GET" "/admin" "" "200"

# Test 12: Story Creation (requires auth)
test_endpoint "Story Creation API" "POST" "/api/stories" '{"title":"Test Story","situation":"Test situation","task":"Test task","action":"Test action","result":"Test result"}' "201"

echo ""
echo "📊 Test Results Summary"
echo "======================"
echo "✅ Passed: $PASSED"
echo "❌ Failed: $FAILED"

if [ $((PASSED + FAILED)) -gt 0 ]; then
    SUCCESS_RATE=$(echo "scale=1; $PASSED * 100 / ($PASSED + $FAILED)" | bc -l 2>/dev/null || echo "0.0")
    echo "📈 Success Rate: ${SUCCESS_RATE}%"
    echo "📈 Success Rate: ${SUCCESS_RATE}%" >> $RESULTS_FILE
fi

echo ""
echo "✅ Passed: $PASSED" >> $RESULTS_FILE
echo "❌ Failed: $FAILED" >> $RESULTS_FILE

echo "🎯 All Tests Completed!"
echo "📄 Results saved to: $RESULTS_FILE"
