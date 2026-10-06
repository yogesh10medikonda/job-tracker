import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  // store the token, then load the full profile (includes resumeSkills)
  const handleAuth = async (data) => {
    localStorage.setItem("token", data.token);
    const me = await api.get("/auth/me");
    setUser(me.data);
  };

  const login = async (email, password) =>
    handleAuth((await api.post("/auth/login", { email, password })).data);

  const register = async (name, email, password) =>
    handleAuth((await api.post("/auth/register", { name, email, password })).data);

  const updateSkills = async (resumeSkills) => {
    const res = await api.put("/auth/skills", { resumeSkills });
    setUser(res.data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, updateSkills, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);