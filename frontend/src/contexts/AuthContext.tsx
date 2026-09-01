import React, { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { AuthUser } from '../types/auth';
import { api, getAccessToken, refreshSession, setAccessToken, setSessionExpiredHandler } from '../lib/apiClient';

interface GymViewSession {
  gymId: string;
  gymName: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  systemLogin: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  gymView: GymViewSession | null;
  viewGymAsOwner: (gymId: string) => Promise<AuthUser>;
  exitGymView: () => void;
  updateUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [gymView, setGymView] = useState<GymViewSession | null>(null);
  const adminSessionRef = useRef<{ user: AuthUser; accessToken: string } | null>(null);

  useEffect(() => {
    setSessionExpiredHandler(() => setUser(null));
    return () => setSessionExpiredHandler(null);
  }, []);

  useEffect(() => {
    (async () => {
      const session = await refreshSession();
      setUser(session?.user ?? null);
      setIsLoading(false);
    })();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthUser> => {
    const data = await api.post<{ user: AuthUser; accessToken: string }>('/api/auth/login', { email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data.user;
  }, []);

  const systemLogin = useCallback(async (email: string, password: string): Promise<AuthUser> => {
    const data = await api.post<{ user: AuthUser; accessToken: string }>('/api/auth/system-login', {
      email,
      password,
    });
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await api.post('/api/auth/logout');
    } finally {
      setAccessToken(null);
      setUser(null);
      adminSessionRef.current = null;
      setGymView(null);
    }
  }, []);

  const viewGymAsOwner = useCallback(
    async (gymId: string): Promise<AuthUser> => {
      if (!user) {
        throw new Error('Not authenticated');
      }
      adminSessionRef.current = { user, accessToken: getAccessToken()! };

      const data = await api.get<{ user: AuthUser; accessToken: string; gym: { id: string; name: string } }>(
        `/api/superadmin/gyms/${gymId}/view`
      );
      setAccessToken(data.accessToken);
      setUser(data.user);
      setGymView({ gymId: data.gym.id, gymName: data.gym.name });
      return data.user;
    },
    [user]
  );

  const exitGymView = useCallback((): void => {
    const admin = adminSessionRef.current;
    if (!admin) return;
    setAccessToken(admin.accessToken);
    setUser(admin.user);
    adminSessionRef.current = null;
    setGymView(null);
  }, []);

  const updateUser = useCallback((updated: AuthUser): void => {
    setUser(updated);
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, login, systemLogin, logout, gymView, viewGymAsOwner, exitGymView, updateUser }),
    [user, isLoading, login, systemLogin, logout, gymView, viewGymAsOwner, exitGymView, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
