/**
 * Utility functions for authentication
 */

/**
 * Gets authentication headers with token
 * @returns Headers object with authorization token
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Handles authentication errors
 * @param error The error object
 */
export const handleAuthError = (error: any) => {
  // Si el error es 401 (no autorizado), redirigir al login
  if (error.response && error.response.status === 401) {
    // Limpiar el token y redirigir al login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  return Promise.reject(error);
};
