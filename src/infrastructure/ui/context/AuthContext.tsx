import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, UserCredentials } from '../../../domain/entities/User';
import { AuthService } from '../../../application/services/AuthService';
import { AuthUseCases } from '../../../domain/useCases/AuthUseCases';
import { AuthRepositoryImpl } from '../../adapters/AuthRepositoryImpl';

// Create the repository, use cases, and service
const authRepository = new AuthRepositoryImpl();
const authUseCases = new AuthUseCases(authRepository);
const authService = new AuthService(authUseCases);

// Define the context type
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Create the context with a default value
export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => false,
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load user and token from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  /**
   * Login a user
   * @param email User email
   * @param password User password
   * @returns Promise with boolean indicating success
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    const credentials: UserCredentials = { email, password };
    const result = await authService.login(credentials);
    
    if (result) {
      setUser(result.user);
      setToken(result.token);
      return true;
    }
    
    return false;
  };

  /**
   * Logout a user
   */
  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
