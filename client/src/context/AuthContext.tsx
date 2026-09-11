import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import type { AuthUser } from '../types/auth';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

function getStoredUser(): AuthUser | null {
  const storedUser = localStorage.getItem('user');

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    return null;
  }
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('accessToken'),
  );

  const [user, setUser] = useState<AuthUser | null>(
    getStoredUser,
  );

  const login = (
    accessToken: string,
    loggedInUser: AuthUser,
  ) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem(
      'user',
      JSON.stringify(loggedInUser),
    );

    setToken(accessToken);
    setUser(loggedInUser);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider',
    );
  }

  return context;
}