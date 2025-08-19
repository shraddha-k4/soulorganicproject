import React, { useState, useContext, createContext, useEffect } from "react";

const authContext = createContext();

function useAuthProvider() {
  const [authed, setAuthed] = useState(false);
  const [role, setRole] = useState(null); // "seller" or "customer"

  // 👇 Run on app load to restore state from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (token && storedUser?.role) {
      setAuthed(true);
      setRole(storedUser.role);
    }
  }, []);

  return {
    authed,
    role,

    // 👇 Called from LoginForm
    login(userRole) {
      return new Promise((res) => {
        setAuthed(true);
        setRole(userRole);
        localStorage.setItem("auth_status", "true"); // Optional
        res();
      });
    },

    logout() {
      return new Promise((res) => {
        setAuthed(false);
        setRole(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("auth_status"); // Optional
        res();
      });
    },
  };
}

export function AuthProvider({ children }) {
  const auth = useAuthProvider();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export function useAuth() {
  return useContext(authContext);
}
