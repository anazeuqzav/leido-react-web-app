/**
 * User entity representing a user in the system
 */
export interface User {
  id: string;
  username: string;
  email: string;
  _id?: string; // ID de MongoDB (para compatibilidad con el backend)
}

/**
 * UserCredentials for authentication
 */
export interface UserCredentials {
  email: string;
  password: string;
}
