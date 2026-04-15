import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import api, { setAuthToken } from "../api/client";

const STORAGE_KEY = "flexboard-session";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const persistSession = useCallback((nextToken, nextUser) => {
    if (!nextToken || !nextUser) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        token: nextToken,
        user: nextUser
      })
    );
  }, []);

  const applySession = useCallback(
    ({ token: nextToken, user: nextUser }) => {
      setToken(nextToken);
      setUser(nextUser);
      setAuthToken(nextToken);
      persistSession(nextToken, nextUser);
    },
    [persistSession]
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    persistSession(null, null);
  }, [persistSession]);

  const refreshSession = useCallback(async () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (!stored) {
        setIsLoading(false);
        return;
      }

      const parsed = JSON.parse(stored);

      if (!parsed?.token) {
        logout();
        setIsLoading(false);
        return;
      }

      setAuthToken(parsed.token);
      const { data } = await api.get("/auth/me");
      applySession({
        token: parsed.token,
        user: data.user
      });
    } catch (_error) {
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [applySession, logout]);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const setUnreadNotifications = useCallback(
    (count) => {
      setUser((previous) => {
        if (!previous) {
          return previous;
        }

        const nextUser = {
          ...previous,
          unreadNotifications: count
        };

        persistSession(token, nextUser);
        return nextUser;
      });
    },
    [persistSession, token]
  );

  const value = useMemo(
    () => ({
      token,
      user,
      isLoading,
      applySession,
      refreshSession,
      logout,
      setUnreadNotifications
    }),
    [
      token,
      user,
      isLoading,
      applySession,
      refreshSession,
      logout,
      setUnreadNotifications
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
