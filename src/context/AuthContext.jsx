import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // ─── On mount: fetch current user if token exists ─────────────
  useEffect(() => {
    const initAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await authAPI.getMe();
        setUser(res.data.user);
      } catch (error) {
        console.error("Auth init failed:", error);
        // Token expired or invalid
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [token]);

  // ─── Login ────────────────────────────────────────────────────
  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { token: newToken, user: userData } = res.data;

    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData);

    return userData;
  };

  // ─── Register ─────────────────────────────────────────────────
  // Backend returns token + user immediately (no OTP flow)
  const register = async (data) => {
    // Strip +20 prefix — backend Joi expects 01xxxxxxxxx
    const phone = data.phone?.replace(/^\+20/, "").replace(/\s/g, "");

    const res = await authAPI.register({
      name: data.name,
      email: data.email,
      password: data.password,
      phone,
      national_id: data.national_id || undefined,
      address: data.address || undefined,
    });

    const { token: newToken, user: userData } = res.data;

    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData);

    return userData;
  };

  // ─── Logout ───────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // ─── Update profile ──────────────────────────────────────────
  const updateProfile = async (data) => {
    const res = await authAPI.updateMe(data);
    setUser(res.data.user);
    return res.data.user;
  };

  // ─── Change password ─────────────────────────────────────────
  const changePassword = async (currentPassword, newPassword) => {
    await authAPI.changePassword({ currentPassword, newPassword });
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
