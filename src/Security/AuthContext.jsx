import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/api";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carrega usuário salvo (ex: após F5)
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const profile = await api.getCurrentUserProfile();
          setUser(profile);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      await api.login(email, password);
      const profile = await api.getCurrentUserProfile();
      setUser(profile);
      return profile;
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem("accessToken");
  };

  const refreshUserProfile = async () => {
    try {
      const profile = await api.getCurrentUserProfile();
      setUser(profile);

      return profile;
    } catch (error) {
      console.error("Failed to refresh profile:", error);
      throw error;
    }
  };

  const value = {
    user,
    setUser,
    login,
    logout,
    isAuthenticated,
    loading,
    refreshUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {" "}
      {!loading && children}{" "}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
