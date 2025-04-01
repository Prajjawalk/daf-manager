"use client";

import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";

const checkSignedInQueryOptions = queryOptions({
  queryKey: ["Check Signed In"],
  queryFn: async (): Promise<boolean> => {
    const response = await fetch(`/api/check-login`, {
      credentials: "include",
    });
    const data = await response.json();
    return data.isSignedIn;
  },
});

function HomeContent() {
  const { data: isSignedIn, refetch: refetchSignInStatus } = useQuery(
    checkSignedInQueryOptions
  );
  const { mutate: signIn } = useMutation({
    mutationKey: ["Sign In"],
    mutationFn: async () => {
      console.log("Signing in");
      const response = await fetch(
        // `${getEnvOrThrow("SAFE_BACKEND_URL")}/init-login`
        "/api/init-login"
      );
      const { url } = await response.json();
      window.location.href = url;
    },
  });
  const { mutate: signOut } = useMutation({
    mutationKey: ["Sign Out"],
    mutationFn: async () => {
      console.log("signing out");
      await fetch(`/api/logout`, {
        method: "POST",
        credentials: "include",
      });
    },
    onSuccess: () => {
      refetchSignInStatus();
    },
  });
  return (
    <div className="min-h-screen flex items-center justify-center">
      {isSignedIn ? (
        <button
          type="button"
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors"
          onClick={() => {
            signOut();
          }}
        >
          Logout
        </button>
      ) : (
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors"
          onClick={() => {
            signIn();
          }}
        >
          Login
        </button>
      )}
    </div>
  );
}

export default function Home() {
  return <HomeContent />;
}
