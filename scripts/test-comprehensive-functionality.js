
const fetch = require('node-fetch');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';
const COOKIE_FILE = '/tmp/test_session.txt';

class TestRunner {
  constructor() {
    this.cookies = '';
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  async test(name, testFn) {
    try {
      console.log(`🧪 Testing: ${name}`);
      await testFn();
      this.results.passed++;
      this.results.tests.push({ name, status: 'PASSED' });
      console.log(`✅ PASSED: ${name}`);
    } catch (error) {
      this.results.failed++;
      this.results.tests.push({ name, status: 'FAILED', error: error.message });
      console.log(`❌ FAILED: ${name} - ${error.message}`);
    }
  }

  async makeRequest(path, options = {}) {
    const url = `${BASE_URL}${path}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.cookies) {
      headers.Cookie = this.cookies;
    }

    const response = await fetch(url, {
      ...options,
      headers
    });

    // Extract cookies from response
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      this.cookies = setCookie.split(';')[0];
    }

    return response;
  }

  async runAllTests() {
    console.log('🚀 Starting Comprehensive Functionality Tests\n');

    // Test 1: Server Health Check
    await this.test('Server Health Check', async () => {
      const response = await this.makeRequest('/login');
      if (response.status !== 200) {
        throw new Error(`Server not responding correctly: ${response.status}`);
      }
    });

    // Test 2: User Registration
    await this.test('User Registration', async () => {
      const timestamp = Date.now();
      const response = await this.makeRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          username: `testuser${timestamp}`,
          email: `test${timestamp}@example.com`,
          password: 'password123'
        })
      });

      if (response.status !== 200) {
        const error = await response.text();
        throw new Error(`Registration failed: ${response.status} - ${error}`);
      }

      const data = await response.json();
      if (!data.user || !data.user.username) {
        throw new Error('Registration response missing user data');
      }
    });

    // Test 3: Admin Login
    await this.test('Admin Login', async () => {
      const response = await this.makeRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          username: 'admin',
          password: 'adminadmin'
        })
      });

      if (response.status !== 200) {
        const error = await response.text();
        throw new Error(`Admin login failed: ${response.status} - ${error}`);
      }

      const data = await response.json();
      if (!data.user || !data.user.isAdmin) {
        throw new Error('Admin login response missing admin privileges');
      }
    });

    // Test 4: Admin Stats API
    await this.test('Admin Stats API', async () => {
      const response = await this.makeRequest('/api/admin/stats');

      if (response.status !== 200) {
        const error = await response.text();
        throw new Error(`Admin stats failed: ${response.status} - ${error}`);
      }

      const data = await response.json();
      if (typeof data.userCount !== 'number' || typeof data.questionCount !== 'number') {
        throw new Error('Admin stats response missing required data');
      }
    });

    // Test 5: Admin Users API
    await this.test('Admin Users API', async () => {
      const response = await this.makeRequest('/api/admin/users');

      if (response.status !== 200) {
        const error = await response.text();
        throw new Error(`Admin users failed: ${response.status} - ${error}`);
      }

      const data = await response.json();
      if (!Array.isArray(data.users)) {
        throw new Error('Admin users response missing users array');
      }
    });

    // Test 6: Companies API
    await this.test('Companies API', async () => {
      const response = await this.makeRequest('/api/companies');

      if (response.status !== 200) {
        const error = await response.text();
        throw new Error(`Companies API failed: ${response.status} - ${error}`);
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Companies API response should be an array');
      }
    });

    // Test 7: Questions API
    await this.test('Questions API', async () => {
      const response = await this.makeRequest('/api/questions');

      if (response.status !== 200) {
        const error = await response.text();
        throw new Error(`Questions API failed: ${response.status} - ${error}`);
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Questions API response should be an array');
      }
    });

    // Test 8: System Design Questions API
    await this.test('System Design Questions API', async () => {
      const response = await this.makeRequest('/api/system-design-questions');

      if (response.status !== 200) {
        const error = await response.text();
        throw new Error(`System Design Questions API failed: ${response.status} - ${error}`);
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('System Design Questions API response should be an array');
      }

      if (data.length < 100) {
        throw new Error(`Expected 100+ system design questions, got ${data.length}`);
      }
    });

    // Test 9: System Design Frameworks API
    await this.test('System Design Frameworks API', async () => {
      const response = await this.makeRequest('/api/system-design-frameworks');

      if (response.status !== 200) {
        const error = await response.text();
        throw new Error(`System Design Frameworks API failed: ${response.status} - ${error}`);
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('System Design Frameworks API response should be an array');
      }
    });

    // Test 10: Stories API (Create)
    await this.test('Stories API - Create', async () => {
      const response = await this.makeRequest('/api/stories', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Test Story',
          situation: 'Test situation description',
          task: 'Test task description',
          action: 'Test action description',
          result: 'Test result description'
        })
      });

      if (response.status !== 201) {
        const error = await response.text();
        throw new Error(`Story creation failed: ${response.status} - ${error}`);
      }

      const data = await response.json();
      if (!data.story || !data.story.id) {
        throw new Error('Story creation response missing story data');
      }
    });

    // Test 11: Page Load Tests
    const pages = [
      '/dashboard',
      '/question-bank',
      '/system-design-questions',
      '/story-templates',
      '/admin'
    ];

    for (const page of pages) {
      await this.test(`Page Load: ${page}`, async () => {
        const response = await this.makeRequest(page);
        if (response.status !== 200) {
          throw new Error(`Page ${page} returned status ${response.status}`);
        }
        
        const html = await response.text();
        if (!html.includes('<!DOCTYPE html>')) {
          throw new Error(`Page ${page} did not return valid HTML`);
        }
      });
    }

    // Test 12: Authentication Flow
    await this.test('Authentication Flow - Logout and Re-login', async () => {
      // Logout
      const logoutResponse = await this.makeRequest('/api/auth/logout', {
        method: 'POST'
      });

      if (logoutResponse.status !== 200) {
        throw new Error(`Logout failed: ${logoutResponse.status}`);
      }

      // Clear cookies
      this.cookies = '';

      // Try to access protected route (should fail)
      const protectedResponse = await this.makeRequest('/api/admin/stats');
      if (protectedResponse.status === 200) {
        throw new Error('Protected route accessible without authentication');
      }

      // Login again
      const loginResponse = await this.makeRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          username: 'admin',
          password: 'adminadmin'
        })
      });

      if (loginResponse.status !== 200) {
        throw new Error('Re-login failed');
      }
    });

    this.printResults();
  }

  printResults() {
    console.log('\n📊 Test Results Summary');
    console.log('========================');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`📈 Success Rate: ${((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(1)}%`);

    if (this.results.failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.tests
        .filter(test => test.status === 'FAILED')
        .forEach(test => {
          console.log(`   - ${test.name}: ${test.error}`);
        });
    }

    console.log('\n🎯 All Tests Completed!');
    
    // Write results to file
    fs.writeFileSync('/home/ubuntu/em-interview-prep/test-results-comprehensive.json', 
      JSON.stringify(this.results, null, 2));
  }
}

// Run tests
const runner = new TestRunner();
runner.runAllTests().catch(error => {
  console.error('Test runner failed:', error);
  process.exit(1);
});
