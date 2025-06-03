import { User, UserCredentials } from '../../domain/entities/User';
import { AuthRepository } from '../../domain/ports/AuthRepository';

/**
 * Implementation of the AuthRepository interface
 */
export class AuthRepositoryImpl implements AuthRepository {
  private API_URL = 'http://localhost:5000';

  /**
   * Login a user
   * @param credentials User credentials
   * @returns Promise with user and token if successful, null otherwise
   */
  async login(credentials: UserCredentials): Promise<{ user: User; token: string } | null> {
    try {
      const response = await fetch(`${this.API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const responseData = await response.json();
        
        if (responseData.success && responseData.data) {
          // Log completo de la respuesta para depuración
          console.log('Respuesta completa del login:', responseData);
          console.log('Datos del usuario del backend:', responseData.data.user);
          
          const userData = responseData.data.user;
          const token = responseData.data.token;
          
          if (!userData || !token) {
            console.error('Login response missing user or token data:', responseData);
            return null;
          }
          
          // Verificar específicamente si existe _id en userData
          console.log('userData._id existe?', !!userData.id);
          console.log('Valor de userData._id:', userData.id);
          
          const user: User = {
            id: userData.id,
            username: userData.username,
            email: userData.email,
          };

          // Log para ver cómo se ve el objeto user antes de guardarlo
          console.log('Objeto user construido para guardar:', user);
          
          // Store user and token in localStorage
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', token);
          
          // Verificar lo que realmente se guardó
          const savedUser = localStorage.getItem('user');
          console.log('Usuario realmente guardado en localStorage:', savedUser);

          return { user, token };
        } else {
          console.error('Login response format unexpected:', responseData);
          return null;
        }
      }
      return null;
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
