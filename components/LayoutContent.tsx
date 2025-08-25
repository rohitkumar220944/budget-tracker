"use client";

import React from "react";
import { Navigation } from "@/components/navigation";
import { useAuth } from "@/app/providers/AuthProvider";

// Wrapper to decide whether to show Navigation
export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  // If user is not logged in → don’t show Navigation
  if (!user) {
    return <main className="min-h-screen bg-background">{children}</main>;
  }

  // If logged in → show Navigation + children
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">{children}</main>
    </>
  );
}
