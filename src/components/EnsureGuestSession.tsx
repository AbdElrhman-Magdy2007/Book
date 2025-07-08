"use client";
import { useEffect } from "react";
import { ensureGuestSession } from "@/lib/guest-session";

export default function EnsureGuestSession() {
  useEffect(() => {
    ensureGuestSession();
  }, []);
  return null;
}
