"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page
    router.push("/login");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-400 to-primary-600">
      <div className="text-center">
        <div className="animate-pulse text-6xl mb-4">✨</div>
        <h1 className="text-4xl font-bold text-dark">Loading...</h1>
      </div>
    </div>
  );
}
