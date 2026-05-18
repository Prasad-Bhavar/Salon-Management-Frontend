import { createContext, useContext, useEffect, useState } from "react";
import { setLogoutHandler } from "./logoutHandler";

// ─── Types ───────────────────────────────────────────────────────────────────

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  profile_picture: string | null; // ── added ──
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: any) => void;
  logout: () => void;
  loading: boolean;
  updateProfilePicture: (path: string | null) => void; // ── added ──
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_STORAGE_KEY = "okr_auth";

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.user ?? null;
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.token ?? null;
    }
    return null;
  });

  // ─── Login ────────────────────────────────────────────────────────────────
  // Expects data: { id, name, email, role, token, profile_picture }

  const login = (data: any) => {
    const authData = {
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        profile_picture: data.profile_picture ?? null, // ── added ──
      },
      token: data.token,
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
    setUser(authData.user);
    setToken(authData.token);
  };

  // ─── Logout ───────────────────────────────────────────────────────────────

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
    setToken(null);
  };

  // ─── Update profile picture ───────────────────────────────────────────────
  // Patches only React state — no localStorage update needed.
  // On next login the fresh value comes from the backend anyway.

  const updateProfilePicture = (path: string | null) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, profile_picture: path };
      // Persist so header avatar re-reads the correct value on re-render
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({ ...parsed, user: updated })
        );
      }
      return updated;
    });
  };

  // ─── Effects ──────────────────────────────────────────────────────────────

  useEffect(() => {
    setLogoutHandler(logout);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed.user ?? null);
      setToken(parsed.token ?? null);
    }
    setLoading(false);
  }, []);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, loading, updateProfilePicture }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};