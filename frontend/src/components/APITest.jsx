import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { BASE_URL } from '../utils/apiPaths';

const APITest = () => {
  const [testResults, setTestResults] = useState({
    baseURL: BASE_URL,
    healthCheck: 'Testing...',
    corsTest: 'Testing...',
    loginTest: 'Testing...',
    validationTest: 'Testing...'
  });

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    console.log('🧪 Running API Tests...');
    
    // Test 1: Health Check
    try {
      const healthResponse = await fetch(`${BASE_URL}/health`);
      const healthData = await healthResponse.json();
      setTestResults(prev => ({
        ...prev,
        healthCheck: healthResponse.ok ? `✅ ${healthData.status}` : `❌ ${healthResponse.status}`
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        healthCheck: `❌ ${error.message}`
      }));
    }

    // Test 2: CORS Test
    try {
      const corsResponse = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      });
      setTestResults(prev => ({
        ...prev,
        corsTest: corsResponse.ok ? `✅ CORS OK` : `❌ CORS Failed (${corsResponse.status})`
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        corsTest: `❌ ${error.message}`
      }));
    }

    // Test 3: Login Endpoint Test
    try {
      const loginResponse = await axiosInstance.post('/api/auth/login', {
        email: 'test@test.com',
        password: 'testpass'
      });
      setTestResults(prev => ({
        ...prev,
        loginTest: `⚠️ Unexpected success: ${loginResponse.status}`
      }));
    } catch (error) {
      if (error.response && (error.response.status === 400 || error.response.status === 401)) {
        setTestResults(prev => ({
          ...prev,
          loginTest: `✅ Endpoint accessible (${error.response.status} expected - ${error.response.data?.message || 'validation error'})`
        }));
      } else {
        setTestResults(prev => ({
          ...prev,
          loginTest: `❌ ${error.message} (${error.response?.status || 'No response'})`
        }));
      }
    }

    // Test 4: Validation Test (empty request)
    try {
      const validationResponse = await axiosInstance.post('/api/auth/login', {});
      setTestResults(prev => ({
        ...prev,
        validationTest: `⚠️ Unexpected success: ${validationResponse.status}`
      }));
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setTestResults(prev => ({
          ...prev,
          validationTest: `✅ Validation working (400 for empty request)`
        }));
      } else {
        setTestResults(prev => ({
          ...prev,
          validationTest: `❌ ${error.message} (${error.response?.status || 'No response'})`
        }));
      }
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      border: '2px solid #ccc', 
      padding: '15px', 
      borderRadius: '8px',
      fontSize: '12px',
      fontFamily: 'monospace',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>🧪 API Test Results</h3>
      <div><strong>Base URL:</strong> {testResults.baseURL}</div>
      <div><strong>Health Check:</strong> {testResults.healthCheck}</div>
      <div><strong>CORS Test:</strong> {testResults.corsTest}</div>
      <div><strong>Login Test:</strong> {testResults.loginTest}</div>
      <div><strong>Validation:</strong> {testResults.validationTest}</div>
      <button 
        onClick={runTests}
        style={{
          marginTop: '10px',
          padding: '5px 10px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Retest
      </button>
    </div>
  );
};

export default APITest;
