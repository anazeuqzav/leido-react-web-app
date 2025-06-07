import { User, UserCredentials } from "../../domain/entities/User";

/**
 * Interface for the Authentication Repository
 * Defines methods for user authentication
 */
export interface AuthRepository {
  login(credentials: UserCredentials): Promise<{ user: User; token: string } | null>;
  logout(): void;
}
