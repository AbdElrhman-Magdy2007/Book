// ProfileClient.tsx
// This client component acts as a bridge between the server component (page.tsx) and the interactive EditUserForm.
// It ensures that all event handlers and interactivity are handled only in the client, following Next.js best practices.

"use client";

import EditUserForm from "@/components/edit-user-form";
import { Session } from "next-auth";

export default function ProfileClient({ user }: { user: Session["user"] }) {
  return <EditUserForm user={user} />;
}
