import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import EditUserForm from "@/components/edit-user-form";
import { Pages, Routes } from "@/constants/enums";
import clsx from "clsx";
import { JSX } from "react";
import { authOptions } from "../server/auth";

// AdminPage component for rendering the admin dashboard
export default async function AdminPage(): Promise<JSX.Element> {
  const session = await getServerSession(authOptions);

  // Redirect if no session exists
  if (!session?.user) {
    redirect(`/auth/${Pages.LOGIN}`);
  }

  // Redirect if user is not an admin
  if (session.user.role !== UserRole.ADMIN) {
    redirect(`/${Routes.PROFILE}`);
  }

  return (
    <main
      className={clsx(
        "min-h-screen bg-background",
        "flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8",
        "transition-colors duration-300 dark"
      )}
      aria-labelledby="admin-dashboard-title"
    >
      <section
        className={clsx(
          "w-full max-w-4xl p-6 lg:p-8",
          "glass-card",
          "supports-[backdrop-filter]:backdrop-blur-md"
        )}
      >
        <div className="container mx-auto">
          {/* Title */}
          <h1
            id="admin-dashboard-title"
            className={clsx(
              "text-3xl lg:text-4xl font-heading font-bold text-gradient-primary animate-reveal-text",
              "mb-8 text-center"
            )}
          >
            {/* Admin Dashboard */}
          </h1>

          {/* User Edit Form */}
          <div className="relative">
            <EditUserForm user={session.user} />
          </div>
        </div>
      </section>
    </main>
  );
}


