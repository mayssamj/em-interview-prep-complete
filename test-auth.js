
// Using Node.js built-in fetch (Node 18+)

const BASE_URL = 'http://localhost:3001';

async function testAuthentication() {
  console.log('🧪 Testing Authentication System...\n');

  // Test 1: Admin Login
  console.log('1. Testing Admin Login (admin/adminadmin)...');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'adminadmin' })
    });
    const data = await response.json();
    
    if (response.ok && data.user.isAdmin) {
      console.log('✅ Admin login successful');
      console.log(`   User: ${data.user.username}, Admin: ${data.user.isAdmin}`);
    } else {
      console.log('❌ Admin login failed');
      console.log('   Response:', data);
    }
  } catch (error) {
    console.log('❌ Admin login error:', error.message);
  }

  // Test 2: Demo User Login
  console.log('\n2. Testing Demo User Login (demo/demodemo)...');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'demo', password: 'demodemo' })
    });
    const data = await response.json();
    
    if (response.ok && !data.user.isAdmin) {
      console.log('✅ Demo user login successful');
      console.log(`   User: ${data.user.username}, Admin: ${data.user.isAdmin}`);
    } else {
      console.log('❌ Demo user login failed');
      console.log('   Response:', data);
    }
  } catch (error) {
    console.log('❌ Demo user login error:', error.message);
  }

  // Test 3: User Registration
  console.log('\n3. Testing User Registration...');
  const randomUser = `testuser${Date.now()}`;
  try {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: randomUser, password: 'password123' })
    });
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ User registration successful');
      console.log(`   New user: ${data.user.username}`);
      
      // Test 4: Login with newly registered user
      console.log('\n4. Testing login with newly registered user...');
      const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: randomUser, password: 'password123' })
      });
      const loginData = await loginResponse.json();
      
      if (loginResponse.ok) {
        console.log('✅ New user login successful');
        console.log(`   User: ${loginData.user.username}`);
      } else {
        console.log('❌ New user login failed');
        console.log('   Response:', loginData);
      }
    } else {
      console.log('❌ User registration failed');
      console.log('   Response:', data);
    }
  } catch (error) {
    console.log('❌ Registration error:', error.message);
  }

  // Test 5: Invalid Credentials
  console.log('\n5. Testing invalid credentials...');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'invalid', password: 'invalid' })
    });
    const data = await response.json();
    
    if (!response.ok && data.error === 'Invalid credentials') {
      console.log('✅ Invalid credentials properly rejected');
    } else {
      console.log('❌ Invalid credentials test failed');
      console.log('   Response:', data);
    }
  } catch (error) {
    console.log('❌ Invalid credentials test error:', error.message);
  }

  // Test 6: Duplicate Registration
  console.log('\n6. Testing duplicate registration...');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'password123' })
    });
    const data = await response.json();
    
    if (!response.ok && data.error === 'Username already exists') {
      console.log('✅ Duplicate registration properly rejected');
    } else {
      console.log('❌ Duplicate registration test failed');
      console.log('   Response:', data);
    }
  } catch (error) {
    console.log('❌ Duplicate registration test error:', error.message);
  }

  console.log('\n🎉 Authentication testing complete!');
}

testAuthentication().catch(console.error);
