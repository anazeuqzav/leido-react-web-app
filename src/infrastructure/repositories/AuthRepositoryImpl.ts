import axios from 'axios';
import config from '../../config/api';
import { User, UserCredentials } from '../../domain/entities/User';
import { AuthRepository } from '../../application/interfaces/AuthRepository';

/**
 * Implementation of the AuthRepository interface
 */
export class AuthRepositoryImpl implements AuthRepository {
  private API_URL = config.API_URL;

  /**
   * Login a user
   * @param credentials User credentials
   * @returns Promise with user and token if successful, null otherwise
   */
  async login(credentials: UserCredentials): Promise<{ user: User; token: string } | null> {
    try {
      const response = await axios.post(`${this.API_URL}/auth/login`, credentials, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data && response.data.success && response.data.data) {

        const userData = response.data.data.user;
        const token = response.data.data.token;

        if (!userData || !token) {
          console.error('Login response missing user or token data:', response.data);
          return null;
        }

        const user: User = {
          id: userData.id,
          username: userData.username,
          email: userData.email,
        };

        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);

        return { user, token };
      } else {
        console.error('Login response format unexpected:', response.data);
        return null;
      }
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  /**
   * Logout a user
   */
  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
}
