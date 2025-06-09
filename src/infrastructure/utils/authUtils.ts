/**
 * Utility functions for authentication
 */

/**
 * Gets authentication headers with token
 * @returns Headers object with authorization token
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.warn('No authentication token found in localStorage');
    throw new Error('Authentication token not found. Please log in again.');
  }
  
  return { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

/**
 * Handles authentication errors
 * @param error The error to handle
 */
export const handleAuthError = (error: any) => {
  console.error('Auth error occurred:', error);
  
  // Handle network errors
  if (error.message === 'Network Error') {
    console.error('Network error - please check your internet connection');
    return Promise.reject(error);
  }
  
  // Handle 401 Unauthorized errors
  if (error?.response?.status === 401) {
    const originalRequest = error.config;
    
    // If this wasn't a retry and we have a refresh token, try to refresh
    if (!originalRequest._retry && localStorage.getItem('refreshToken')) {
      originalRequest._retry = true;
      console.log('Attempting to refresh token...');
    }
    
    // Clear auth data
    console.log('Clearing auth data and redirecting to login...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    
    // Store the current location to redirect back after login
    sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
    
    // Redirect to login with a message
    window.location.href = '/login?sessionExpired=true';
    return Promise.reject(error);
  }
  
  // Handle other types of errors
  if (error?.response?.data?.message) {
    console.error('Server error:', error.response.data.message);
    // You could show this to the user if you have a notification system
  }
  
  return Promise.reject(error);
};
