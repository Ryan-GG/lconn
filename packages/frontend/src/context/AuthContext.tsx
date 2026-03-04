import { createContext, useContext, ReactNode } from 'react';
import { authClient } from '../lib/auth-client';

interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, isPending: loading } = authClient.useSession();

  const user = session?.user as User | undefined ?? null;

  const login = () => {
    authClient.signIn.social({ provider: 'github', callbackURL: "http://localhost:3000" });
  };

  const logout = async () => {
    await authClient.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
