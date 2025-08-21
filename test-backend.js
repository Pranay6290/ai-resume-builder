#!/usr/bin/env node

/**
 * Backend API Test Script
 * Tests if the deployed backend is responding correctly
 */

const BACKEND_URL = 'https://ai-resume-builder-5qok.onrender.com';
const FRONTEND_URL = 'https://ai-resume-builder-2-pqet.onrender.com';

console.log('🔧 Testing Configuration:');
console.log('Backend URL:', BACKEND_URL);
console.log('Frontend URL:', FRONTEND_URL);
console.log('');

console.log('🔍 Testing Backend API...');
console.log('========================');
console.log(`Backend URL: ${BACKEND_URL}`);
console.log(`Frontend URL: ${FRONTEND_URL}`);
console.log('');

// Test 1: Health Check
async function testHealthCheck() {
  try {
    console.log('1. Testing Health Check...');
    const response = await fetch(`${BACKEND_URL}/health`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Health Check: PASSED');
      console.log(`   Status: ${data.status}`);
      console.log(`   Uptime: ${data.uptime}s`);
    } else {
      console.log('❌ Health Check: FAILED');
      console.log(`   Status: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(data)}`);
    }
  } catch (error) {
    console.log('❌ Health Check: ERROR');
    console.log(`   Error: ${error.message}`);
  }
  console.log('');
}

// Test 2: CORS Preflight
async function testCORS() {
  try {
    console.log('2. Testing CORS Preflight...');
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'OPTIONS',
      headers: {
        'Origin': FRONTEND_URL,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    if (response.ok) {
      console.log('✅ CORS Preflight: PASSED');
      console.log(`   Status: ${response.status}`);
      console.log(`   CORS Headers: ${response.headers.get('Access-Control-Allow-Origin')}`);
    } else {
      console.log('❌ CORS Preflight: FAILED');
      console.log(`   Status: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ CORS Preflight: ERROR');
    console.log(`   Error: ${error.message}`);
  }
  console.log('');
}

// Test 3: Login Endpoint
async function testLoginEndpoint() {
  try {
    console.log('3. Testing Login Endpoint...');
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': FRONTEND_URL
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpassword'
      })
    });
    
    const data = await response.json();
    
    if (response.status === 400 || response.status === 401) {
      console.log('✅ Login Endpoint: ACCESSIBLE (validation error expected)');
      console.log(`   Status: ${response.status}`);
      console.log(`   Message: ${data.message}`);
    } else if (response.status === 404) {
      console.log('❌ Login Endpoint: NOT FOUND');
      console.log(`   Status: ${response.status}`);
    } else {
      console.log('⚠️  Login Endpoint: UNEXPECTED RESPONSE');
      console.log(`   Status: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(data)}`);
    }
  } catch (error) {
    console.log('❌ Login Endpoint: ERROR');
    console.log(`   Error: ${error.message}`);
  }
  console.log('');
}

// Test 4: Register Endpoint
async function testRegisterEndpoint() {
  try {
    console.log('4. Testing Register Endpoint...');
    const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': FRONTEND_URL
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpassword'
      })
    });
    
    const data = await response.json();
    
    if (response.status === 400 || response.status === 409) {
      console.log('✅ Register Endpoint: ACCESSIBLE (validation/conflict error expected)');
      console.log(`   Status: ${response.status}`);
      console.log(`   Message: ${data.message}`);
    } else if (response.status === 404) {
      console.log('❌ Register Endpoint: NOT FOUND');
      console.log(`   Status: ${response.status}`);
    } else {
      console.log('⚠️  Register Endpoint: UNEXPECTED RESPONSE');
      console.log(`   Status: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(data)}`);
    }
  } catch (error) {
    console.log('❌ Register Endpoint: ERROR');
    console.log(`   Error: ${error.message}`);
  }
  console.log('');
}

// Run all tests
async function runTests() {
  await testHealthCheck();
  await testCORS();
  await testLoginEndpoint();
  await testRegisterEndpoint();
  
  console.log('🎯 Diagnosis:');
  console.log('=============');
  console.log('If health check passes but CORS fails:');
  console.log('  → Check CORS_ORIGIN environment variable in Render');
  console.log('');
  console.log('If CORS passes but endpoints return 404:');
  console.log('  → Check if routes are properly mounted in server.js');
  console.log('');
  console.log('If all tests fail:');
  console.log('  → Backend service might not be running');
  console.log('  → Check Render deployment logs');
}

runTests().catch(console.error);
