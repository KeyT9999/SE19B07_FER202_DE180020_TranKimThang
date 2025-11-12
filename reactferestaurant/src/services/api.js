/**
 * API Configuration for JSON Server
 * Base URL: Uses proxy in development (package.json) or environment variable
 * In development: Proxy redirects requests to http://localhost:3001
 * In production: Uses REACT_APP_API_BASE_URL or default to http://localhost:3001
 */

import axios from 'axios';

// Determine base URL based on environment
// Option 1: Use proxy (recommended for development)
//   - Set baseURL to empty string '' to use relative URLs
//   - React dev server proxy will forward requests to http://localhost:3001
// Option 2: Use direct URL with CORS enabled
//   - Set baseURL to 'http://localhost:3001'
//   - Requires JSON server to have CORS enabled (use: npm run server)
const getBaseURL = () => {
  // If REACT_APP_API_BASE_URL is set, use it (highest priority)
  if (process.env.REACT_APP_API_BASE_URL) {
    console.log('[API] Using REACT_APP_API_BASE_URL:', process.env.REACT_APP_API_BASE_URL);
    return process.env.REACT_APP_API_BASE_URL;
  }
  
  // In development, use direct URL with CORS enabled
  // IMPORTANT: Start JSON server with CORS enabled using: npm run server
  // Alternative: Use proxy by setting REACT_APP_USE_PROXY=true
  const useProxy = process.env.REACT_APP_USE_PROXY === 'true';
  
  if (process.env.NODE_ENV === 'development') {
    if (useProxy) {
      // Use proxy: empty string = relative URLs
      // Note: Proxy requires React dev server to be running and proxy configured in package.json
      // You may need to restart React app after enabling proxy
      console.log('[API] Development mode: Using proxy (relative URLs)');
      console.log('[API] Requests will be proxied through React dev server to http://localhost:3001');
      return ''; 
    } else {
      // Use direct URL: requires CORS to be enabled on JSON server (default)
      // IMPORTANT: Start JSON server with CORS enabled using: npm run server
      console.log('[API] Development mode: Using direct URL (http://localhost:3001)');
      console.log('[API] Make sure JSON server is running with CORS enabled: npm run server');
      return 'http://localhost:3001';
    }
  }
  
  // Production: use direct URL
  console.log('[API] Production mode: Using http://localhost:3001');
  return 'http://localhost:3001';
};

// Create axios instance with configuration
const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const fullURL = config.baseURL 
      ? `${config.baseURL}${config.url}` 
      : config.url;
    console.log(`[API] ${config.method?.toUpperCase()} ${fullURL}`);
    console.log('[API] Request config:', {
      baseURL: config.baseURL,
      url: config.url,
      fullURL: fullURL,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    const fullURL = response.config.baseURL 
      ? `${response.config.baseURL}${response.config.url}` 
      : response.config.url;
    console.log(`[API] Response ${response.status} ${fullURL}`);
    console.log('[API] Response data:', response.data);
    return response;
  },
  (error) => {
    const fullURL = error.config?.baseURL 
      ? `${error.config.baseURL}${error.config.url}` 
      : error.config?.url || 'unknown';
    console.error('[API] Error:', error.message);
    console.error('[API] Error URL:', fullURL);
    console.error('[API] Error details:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack
    });
    if (error.response) {
      console.error('[API] Response error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error('[API] No response received:', {
        request: error.request,
        readyState: error.request?.readyState,
        status: error.request?.status,
        statusText: error.request?.statusText
      });
      console.error('[API] This usually means:');
      console.error('  - Server is not running');
      console.error('  - CORS is blocking the request');
      console.error('  - Network error');
    } else {
      console.error('[API] Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
