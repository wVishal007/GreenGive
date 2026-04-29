"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

interface Analytics {
  totalUsers: number;
  activeSubs: number;
  prizePool: number;
  charityTotal: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<Analytics>({
    totalUsers: 0,
    activeSubs: 0,
    prizePool: 0,
    charityTotal: 0,
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session?.user?.role !== "admin") router.push("/dashboard");
  }, [status, session, router]);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((res) => res.json())
      .then((data) => setAnalytics(data));
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="animate-pulse text-emerald-400 text-xl">
          Loading admin dashboard...
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Users",
      value: analytics.totalUsers.toLocaleString(),
      color: "emerald-400",
      bgColor: "from-emerald-500/10 to-emerald-600/5",
      borderColor: "border-emerald-500/20",
    },
    {
      label: "Active Subscribers",
      value: analytics.activeSubs.toLocaleString(),
      color: "amber-400",
      bgColor: "from-amber-500/10 to-amber-600/5",
      borderColor: "border-amber-500/20",
    },
    {
      label: "Prize Pool",
      value: `$${analytics.prizePool.toLocaleString()}`,
      color: "white",
      bgColor: "from-gray-500/10 to-gray-600/5",
      borderColor: "border-gray-700",
    },
    {
      label: "Charity Total",
      value: `$${analytics.charityTotal.toLocaleString()}`,
      color: "emerald-400",
      bgColor: "from-emerald-500/10 to-emerald-600/5",
      borderColor: "border-emerald-500/20",
    },
  ];

  const adminLinks = [
    {
      href: "/admin/users",
      title: "User Management",
      desc: "View and manage users",
      icon: "👥",
    },
    {
      href: "/admin/draws",
      title: "Draw Management",
      desc: "Run and publish draws",
      icon: "🎲",
    },
    {
      href: "/admin/charities",
      title: "Charity Management",
      desc: "Manage supported charities",
      icon: "❤️",
    },
    {
      href: "/admin/winners",
      title: "Winner Management",
      desc: "Verify and pay winners",
      icon: "🏆",
    },
  ];

  return (
    <div className="min-h-screen bg-[#030712] relative">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 via-transparent to-amber-950/20" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-500/5 blur-3xl rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Admin <span className="text-emerald-400">Dashboard</span>
          </h1>
          <p className="text-gray-400 mb-12">
            Manage users, draws, charities, and winners.
          </p>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${stat.bgColor} border ${stat.borderColor} rounded-2xl p-6 hover:border-gray-700 transition-all`}
            >
              <h3 className="text-gray-400 text-sm font-medium mb-2">
                {stat.label}
              </h3>
              <p className={`text-4xl font-black text-${stat.color}`}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Admin Links */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminLinks.map((link, index) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Link
                href={link.href}
                className="block bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-emerald-500/30 transition-all hover:-translate-y-1 hover:shadow-2xl group"
              >
                <div className="text-4xl mb-4">{link.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  {link.title}
                </h3>
                <p className="text-gray-400">{link.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
