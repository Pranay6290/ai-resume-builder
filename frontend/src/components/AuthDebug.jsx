import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/userContext';

const AuthDebug = () => {
  const { user, loading } = useContext(UserContext);
  const [authState, setAuthState] = useState({});

  useEffect(() => {
    const updateAuthState = () => {
      const token = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');
      
      setAuthState({
        hasToken: !!token,
        tokenLength: token ? token.length : 0,
        hasStoredUser: !!storedUser,
        contextUser: !!user,
        contextLoading: loading,
        currentPath: window.location.pathname
      });
    };

    updateAuthState();
    
    // Update every second to monitor changes
    const interval = setInterval(updateAuthState, 1000);
    
    return () => clearInterval(interval);
  }, [user, loading]);

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '10px', 
      right: '10px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white',
      border: '1px solid #333', 
      padding: '10px', 
      borderRadius: '8px',
      fontSize: '11px',
      fontFamily: 'monospace',
      zIndex: 9999,
      maxWidth: '250px'
    }}>
      <h4 style={{ margin: '0 0 8px 0', color: '#4CAF50' }}>🔐 Auth Debug</h4>
      <div><strong>Token:</strong> {authState.hasToken ? `✅ (${authState.tokenLength} chars)` : '❌ None'}</div>
      <div><strong>Stored User:</strong> {authState.hasStoredUser ? '✅ Yes' : '❌ No'}</div>
      <div><strong>Context User:</strong> {authState.contextUser ? '✅ Loaded' : '❌ None'}</div>
      <div><strong>Loading:</strong> {authState.contextLoading ? '⏳ Yes' : '✅ No'}</div>
      <div><strong>Path:</strong> {authState.currentPath}</div>
      
      <button 
        onClick={() => {
          console.log('🔍 Auth Debug Info:');
          console.log('Token:', localStorage.getItem('accessToken'));
          console.log('Stored User:', localStorage.getItem('user'));
          console.log('Context User:', user);
          console.log('Loading:', loading);
        }}
        style={{
          marginTop: '8px',
          padding: '4px 8px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '10px'
        }}
      >
        Log Details
      </button>
    </div>
  );
};

export default AuthDebug;
