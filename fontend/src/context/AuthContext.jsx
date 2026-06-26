import { createContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import { authAPI } from "../api/authAPI";

// Tạo context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          if (decoded.exp * 1000 > Date.now()) {
            try {
              const profileData = await authAPI.getProfile();
              setUser({ ...decoded, ...profileData });
            } catch (err) {
              console.error("Failed to fetch profile", err);
              setUser(decoded);
            }
          } else {
            localStorage.removeItem("token");
          }
        } catch (err) {
          console.error("Invalid token", err);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    try {
      const profileData = await authAPI.getProfile();
      setUser({ ...decoded, ...profileData });
    } catch (err) {
      console.error("Failed to fetch profile during login", err);
      setUser(decoded);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;