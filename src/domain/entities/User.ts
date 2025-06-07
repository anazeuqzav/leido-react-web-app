/**
 * User entity representing a user in the system
 */
export interface User {
  id: string;
  username: string;
  email: string;
  _id?: string; // ID from MongoDB
}

/**
 * UserCredentials for authentication
 */
export interface UserCredentials {
  email: string;
  password: string;
}
