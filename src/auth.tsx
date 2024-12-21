import React, { createContext, useState } from "react";

export interface AuthContext {
  username: string | null;
  isAuthenticated: boolean;
  signUp: (
    username: string,
  ) => Promise<
    | { error: unknown; success?: undefined; data?: undefined }
    | { success: boolean; data: any; error?: undefined }
  >;
  signIn: (username: string) => Promise<Response | undefined>;
}

const AuthContext = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const isAuthenticated = username ? true : false;

  const signUp = async (user: string) => {
    try {
      const res = await fetch("http://127.0.0.1:3000/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: user }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        return { error: errorData.error || "Something went wrong on sign up" };
      }

      const data = await res.json();
      return { success: true, data };
    } catch (error) {
      console.error("Error on sign up: ", error);
      return { error: "Unexpected error" };
    }
  };

  const signIn = async (username: string) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    try {
      const res = await fetch(`http://127.0.0.1:3000/login/${username}`);
      return res;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        username: username,
        signUp,
        signIn,
      }}
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
