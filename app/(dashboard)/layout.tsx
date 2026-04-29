"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import SubscriptionBadge from "@/components/SubscriptionBadge";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="text-emerald-400 text-xl">Loading...</div>
      </div>
    );
  }

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/scores", label: "Scores" },
    { href: "/charity", label: "Charity" },
    { href: "/winners", label: "Winnings" },
    { href: "/pricing", label: "Subscription" },
  ];

  return (
    <div className="min-h-screen bg-[#030712] relative">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 via-transparent to-amber-950/20" />

      <nav className="relative z-10 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            href="/dashboard"
            className="text-xl font-bold text-white flex items-center gap-2"
          >
            <span className="text-emerald-400">Digital</span> Heroes
          </Link>

          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-emerald-400 transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}

            <div className="flex items-center gap-4 pl-6 border-l border-gray-700">
              <SubscriptionBadge
                status={session?.user?.subscriptionStatus || "inactive"}
              />
              <span className="text-gray-400 text-sm">
                {session?.user?.name}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10">{children}</main>
    </div>
  );
}
