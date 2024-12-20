import React, { createContext, useState } from "react";

export interface AuthContext {
  username: string | null;
  isAuthenticated: boolean;
  signUp: (username: string) => boolean;
  signIn: (username: string) => boolean;
  signUp2: (username: string) => boolean;
}

const AuthContext = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  let isAuthenticated = username ? true : false;

  const signUp2 = async (user: string) => {
    const res = await fetch("http://127.0.0.1:3000/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Specify JSON format
      },
      body: JSON.stringify({ name: user }),
    });

    const data = await res.json();
    return data;
  };

  const signUp = (newUsername: string) => {
    const storedUsers = localStorage.getItem("users");
    const users: string[] = storedUsers ? JSON.parse(storedUsers) : [];

    if (users.some((user) => user === newUsername)) {
      alert("User already exists");
      return false;
    }

    users.push(newUsername.trim());
    localStorage.setItem("users", JSON.stringify(users));
    setUsername(null);
    return true;
  };

  const signIn = (loginName: string) => {
    const storedUsers = localStorage.getItem("users");
    const users: string[] = storedUsers ? JSON.parse(storedUsers) : [];

    if (users.some((user) => user === loginName)) {
      setUsername(loginName);
      const link = `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_APP_CLIENT_ID}&redirect_uri=http://localhost:5173/auth&login=${loginName}`;
      isAuthenticated = true;
      setUsername(loginName);
      window.location.assign(link);
      return true;
    }
    alert("User has not signed up");
    return false;
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, username: username, signUp, signIn, signUp2 }}
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
