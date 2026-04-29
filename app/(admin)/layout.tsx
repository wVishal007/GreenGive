"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session?.user?.role !== "admin")
      router.push("/dashboard");
  }, [status, session, router]);

  if (status === "loading") return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            href="/admin/admin-home"
            className="text-xl font-bold text-purple-600"
          >
            Digital Heroes Admin
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/admin/users"
              className="text-gray-600 hover:text-purple-600"
            >
              Users
            </Link>
            <Link
              href="/admin/draws"
              className="text-gray-600 hover:text-purple-600"
            >
              Draws
            </Link>
            <Link
              href="/admin/charities"
              className="text-gray-600 hover:text-purple-600"
            >
              Charities
            </Link>
            <Link
              href="/admin/winners"
              className="text-gray-600 hover:text-purple-600"
            >
              Winners
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
