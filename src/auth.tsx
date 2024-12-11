import React, { createContext, useState } from "react";

export interface AuthContext {
  user: string | null;
  isAuthenticated: boolean;
  signUp: (username: string) => void;
  signIn: () => void;
}

const AuthContext = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const isAuthenticated = !!user;

  const signUp = (newUsername: string) => {
    const storedUsers = localStorage.getItem("users");

    const users: string[] = storedUsers ? JSON.parse(storedUsers) : [];

    if (users.some((user) => user === newUsername)) {
      alert("User already exists");
      return;
    }

    users.push(newUsername.trim());

    localStorage.setItem("users", JSON.stringify(users));
    setUser(null);
  };
  const signIn = () => {
    alert("it worked");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, signUp, signIn }}>
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
