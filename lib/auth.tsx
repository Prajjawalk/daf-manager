"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import { queryOptions, useQuery } from "@tanstack/react-query";

type AuthContextType = {
  signedIn: boolean;
  refetch: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const checkSignedInQueryOptions = queryOptions({
  queryKey: ["Check Signed In"],
  queryFn: async (): Promise<boolean> => {
    const response = await fetch(`http://localhost:5454/check-login`, {
      credentials: "include",
    });
    const data = await response.json();
    return data.isSignedIn;
  },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: isSignedIn, refetch: refetchSignInStatus } = useQuery(
    checkSignedInQueryOptions
  );
  const [signedIn, setSignedIn] = useState<boolean>(false);
  const [, setLoading] = useState(true);

  useEffect(() => {
    if (isSignedIn) {
      setSignedIn(true);
    }
    setLoading(false);
  }, [isSignedIn]);

  return (
    <AuthContext.Provider value={{ signedIn, refetch: refetchSignInStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
