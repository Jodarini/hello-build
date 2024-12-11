import React, { createContext, useState } from "react";

export interface AuthContext {
  username: string | null;
  isAuthenticated: boolean;
  signUp: (username: string) => void;
  signIn: (username: string) => boolean;
}

const AuthContext = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const isAuthenticated = !!username;

  const signUp = (newUsername: string) => {
    const storedUsers = localStorage.getItem("users");
    const users: string[] = storedUsers ? JSON.parse(storedUsers) : [];

    if (users.some((user) => user === newUsername)) {
      alert("User already exists");
      return;
    }

    users.push(newUsername.trim());
    localStorage.setItem("users", JSON.stringify(users));
    setUsername(null);
  };

  const signIn = (loginName: string) => {
    const storedUsers = localStorage.getItem("users");
    const users: string[] = storedUsers ? JSON.parse(storedUsers) : [];

    if (users.some((user) => user === loginName)) {
      setUsername(loginName);
      alert("users logged in");
      return true;
    }
    alert("users not logged in");
    return false;
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, username: username, signUp, signIn }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
