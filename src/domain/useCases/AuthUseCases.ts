import { UserCredentials, User } from '../entities/User';
import { AuthRepository } from '../ports/AuthRepository';

/**
 * Authentication use cases that encapsulate the business logic for authentication
 */
export class AuthUseCases {
  private authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  /**
   * Login a user
   * @param credentials User credentials
   * @returns Promise with user and token if successful, null otherwise
   */
  async login(credentials: UserCredentials): Promise<{ user: User; token: string } | null> {
    return this.authRepository.login(credentials);
  }

  /**
   * Logout a user
   */
  logout(): void {
    this.authRepository.logout();
  }
}
