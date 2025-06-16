#!/bin/bash

# EM Interview Prep - Comprehensive Test Runner Script
# This script runs all tests with coverage reporting and detailed output

set -e  # Exit on any error

# Colors for output formatting
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/home/ubuntu/em-interview-prep"
LOG_FILE="$PROJECT_DIR/test-results.log"
COVERAGE_DIR="$PROJECT_DIR/coverage"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${CYAN}ℹ${NC} $1"
}

# Function to print header
print_header() {
    echo -e "\n${PURPLE}================================${NC}"
    echo -e "${PURPLE}  EM INTERVIEW PREP TEST SUITE  ${NC}"
    echo -e "${PURPLE}================================${NC}\n"
}

# Function to print section header
print_section() {
    echo -e "\n${YELLOW}--- $1 ---${NC}"
}

# Trap to handle script interruption
cleanup() {
    print_error "Test execution interrupted!"
    exit 1
}
trap cleanup INT TERM

# Start execution
START_TIME=$(date +%s)
print_header

# Change to project directory
cd "$PROJECT_DIR" || {
    print_error "Failed to change to project directory: $PROJECT_DIR"
    exit 1
}

print_status "Starting comprehensive test execution..."
print_info "Project Directory: $PROJECT_DIR"
print_info "Log File: $LOG_FILE"
print_info "Coverage Directory: $COVERAGE_DIR"

# Initialize log file
echo "EM Interview Prep - Test Execution Log" > "$LOG_FILE"
echo "Started at: $(date)" >> "$LOG_FILE"
echo "========================================" >> "$LOG_FILE"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_warning "node_modules not found. Installing dependencies..."
    npm install | tee -a "$LOG_FILE"
fi

# Clean previous coverage reports
print_section "Cleaning Previous Reports"
if [ -d "$COVERAGE_DIR" ]; then
    rm -rf "$COVERAGE_DIR"
    print_success "Cleaned previous coverage reports"
else
    print_info "No previous coverage reports found"
fi

# Run linting first
print_section "Code Quality Check (ESLint)"
print_status "Running ESLint..."
if npm run lint 2>&1 | tee -a "$LOG_FILE"; then
    print_success "ESLint passed"
    echo "✓ ESLint: PASSED" >> "$LOG_FILE"
else
    print_warning "ESLint found issues (continuing with tests)"
    echo "⚠ ESLint: ISSUES FOUND" >> "$LOG_FILE"
fi

# Run all tests with coverage
print_section "Running All Tests with Coverage"
print_status "Executing Jest test suite..."

# Create a temporary file to capture Jest output
JEST_OUTPUT=$(mktemp)

# Run Jest with comprehensive options
if npm run test:coverage -- --runInBand --colors --verbose --passWithNoTests 2>&1 | tee "$JEST_OUTPUT" | tee -a "$LOG_FILE"; then
    TEST_EXIT_CODE=0
    print_success "All tests completed successfully!"
    echo "✓ Jest Tests: PASSED" >> "$LOG_FILE"
else
    TEST_EXIT_CODE=$?
    print_error "Some tests failed!"
    echo "✗ Jest Tests: FAILED" >> "$LOG_FILE"
fi

# Extract test summary from Jest output
print_section "Test Summary"
if [ -f "$JEST_OUTPUT" ]; then
    # Extract test results summary
    if grep -q "Test Suites:" "$JEST_OUTPUT"; then
        echo -e "\n${CYAN}Test Results Summary:${NC}"
        grep -A 10 "Test Suites:" "$JEST_OUTPUT" | head -5
        
        # Add to log file
        echo "" >> "$LOG_FILE"
        echo "Test Results Summary:" >> "$LOG_FILE"
        grep -A 10 "Test Suites:" "$JEST_OUTPUT" | head -5 >> "$LOG_FILE"
    fi
    
    # Extract coverage summary
    if grep -q "Coverage summary" "$JEST_OUTPUT"; then
        echo -e "\n${CYAN}Coverage Summary:${NC}"
        grep -A 20 "Coverage summary" "$JEST_OUTPUT" | head -15
        
        # Add to log file
        echo "" >> "$LOG_FILE"
        echo "Coverage Summary:" >> "$LOG_FILE"
        grep -A 20 "Coverage summary" "$JEST_OUTPUT" | head -15 >> "$LOG_FILE"
    fi
    
    # Clean up temporary file
    rm "$JEST_OUTPUT"
fi

# Run specific test categories if they exist
print_section "Running Categorized Tests"

# Unit tests
if npm run test:unit --silent 2>/dev/null; then
    print_status "Running unit tests..."
    if npm run test:unit 2>&1 | tee -a "$LOG_FILE"; then
        print_success "Unit tests passed"
        echo "✓ Unit Tests: PASSED" >> "$LOG_FILE"
    else
        print_warning "Unit tests had issues"
        echo "⚠ Unit Tests: ISSUES" >> "$LOG_FILE"
    fi
fi

# API tests
if npm run test:api --silent 2>/dev/null; then
    print_status "Running API tests..."
    if npm run test:api 2>&1 | tee -a "$LOG_FILE"; then
        print_success "API tests passed"
        echo "✓ API Tests: PASSED" >> "$LOG_FILE"
    else
        print_warning "API tests had issues"
        echo "⚠ API Tests: ISSUES" >> "$LOG_FILE"
    fi
fi

# Integration tests
if npm run test:integration --silent 2>/dev/null; then
    print_status "Running integration tests..."
    if npm run test:integration 2>&1 | tee -a "$LOG_FILE"; then
        print_success "Integration tests passed"
        echo "✓ Integration Tests: PASSED" >> "$LOG_FILE"
    else
        print_warning "Integration tests had issues"
        echo "⚠ Integration Tests: ISSUES" >> "$LOG_FILE"
    fi
fi

# Database tests
if npm run test:database --silent 2>/dev/null; then
    print_status "Running database tests..."
    if npm run test:database 2>&1 | tee -a "$LOG_FILE"; then
        print_success "Database tests passed"
        echo "✓ Database Tests: PASSED" >> "$LOG_FILE"
    else
        print_warning "Database tests had issues"
        echo "⚠ Database Tests: ISSUES" >> "$LOG_FILE"
    fi
fi

# Check for coverage reports
print_section "Coverage Reports"
if [ -d "$COVERAGE_DIR" ]; then
    print_success "Coverage reports generated in: $COVERAGE_DIR"
    
    # List coverage files
    if [ -f "$COVERAGE_DIR/lcov-report/index.html" ]; then
        print_info "HTML Coverage Report: $COVERAGE_DIR/lcov-report/index.html"
    fi
    
    if [ -f "$COVERAGE_DIR/coverage-summary.json" ]; then
        print_info "JSON Coverage Summary: $COVERAGE_DIR/coverage-summary.json"
    fi
    
    if [ -f "$COVERAGE_DIR/lcov.info" ]; then
        print_info "LCOV Coverage Data: $COVERAGE_DIR/lcov.info"
    fi
else
    print_warning "No coverage reports generated"
fi

# Calculate execution time
END_TIME=$(date +%s)
EXECUTION_TIME=$((END_TIME - START_TIME))
MINUTES=$((EXECUTION_TIME / 60))
SECONDS=$((EXECUTION_TIME % 60))

# Final summary
print_section "Execution Summary"
echo -e "${CYAN}Total Execution Time:${NC} ${MINUTES}m ${SECONDS}s"
echo -e "${CYAN}Log File:${NC} $LOG_FILE"

# Add final summary to log
echo "" >> "$LOG_FILE"
echo "========================================" >> "$LOG_FILE"
echo "Completed at: $(date)" >> "$LOG_FILE"
echo "Total Execution Time: ${MINUTES}m ${SECONDS}s" >> "$LOG_FILE"
echo "Final Exit Code: $TEST_EXIT_CODE" >> "$LOG_FILE"

# Print final status
if [ $TEST_EXIT_CODE -eq 0 ]; then
    print_success "All tests completed successfully! 🎉"
    echo -e "\n${GREEN}✓ TEST SUITE PASSED${NC}\n"
else
    print_error "Some tests failed. Check the log for details."
    echo -e "\n${RED}✗ TEST SUITE FAILED${NC}\n"
fi

# Instructions for viewing results
print_info "To view detailed results:"
print_info "  • Log file: cat $LOG_FILE"
print_info "  • Coverage report: open $COVERAGE_DIR/lcov-report/index.html"
print_info "  • Re-run tests: $0"

exit $TEST_EXIT_CODE
