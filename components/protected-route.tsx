"use client";

import type React from "react";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../lib/auth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { signedIn } = useAuth();
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    if (!signedIn && pathName != "/") {
      router.push("/");
    } else {
      if (signedIn && pathName == "/") {
        router.push("/dashboard");
      }
    }
  }, [signedIn, router, pathName]);

  return <>{children}</>;
}
