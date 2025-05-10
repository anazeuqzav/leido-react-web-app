import { UserCredentials, User } from '../../domain/entities/User';
import { AuthUseCases } from '../../domain/useCases/AuthUseCases';

/**
 * Authentication service that coordinates authentication operations
 */
export class AuthService {
  private authUseCases: AuthUseCases;

  constructor(authUseCases: AuthUseCases) {
    this.authUseCases = authUseCases;
  }

  /**
   * Login a user
   * @param credentials User credentials
   * @returns Promise with user and token if successful, null otherwise
   */
  async login(credentials: UserCredentials): Promise<{ user: User; token: string } | null> {
    return this.authUseCases.login(credentials);
  }

  /**
   * Logout a user
   */
  logout(): void {
    this.authUseCases.logout();
  }
}
