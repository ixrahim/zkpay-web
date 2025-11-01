import { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Load auth state from localStorage on mount
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      console.log('[Auth] Loading stored auth...');
      console.log('[Auth] Token exists:', !!storedToken);
      console.log('[Auth] User exists:', !!storedUser);

      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        console.log('[Auth] ✓ Auth restored:', parsedUser.userId);
      } else {
        console.log('[Auth] No stored auth found');
      }
    } catch (error) {
      console.error('[Auth] Failed to load stored auth:', error);
      // Clear corrupted data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (newUser: User, newToken: string) => {
    console.log('[Auth] Logging in:', newUser.userId);
    
    setUser(newUser);
    setToken(newToken);
    
    // ✅ Persist to localStorage
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    console.log('[Auth] ✓ Auth saved to localStorage');
  };

  const logout = () => {
    console.log('[Auth] Logging out');
    
    setUser(null);
    setToken(null);
    
    // ✅ Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    console.log('[Auth] ✓ Auth cleared');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        login, 
        logout, 
        isAuthenticated: !!token && !!user,
        loading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}