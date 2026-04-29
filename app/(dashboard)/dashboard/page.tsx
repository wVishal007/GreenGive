"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import CountdownTimer from "@/components/CountdownTimer";
import SubscriptionBadge from "@/components/SubscriptionBadge";

interface DashboardData {
  subscriptionStatus: string;
  scoreCount: number;
  charityName: string;
  totalWinnings: number;
  totalContributed: number;
  nextDrawDays: number;
  nextDrawDate: string | null;
  recentWin: {
    amount: number;
    matchType: number;
    drawDate: string;
  } | null;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<DashboardData>({
    subscriptionStatus: "Inactive",
    scoreCount: 0,
    charityName: "Not Selected",
    totalWinnings: 0,
    totalContributed: 0,
    nextDrawDays: 12,
    nextDrawDate: null,
    recentWin: null,
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetch("/api/user/dashboard")
        .then((res) => res.json())
        .then((apiData) => {
          setData({
            subscriptionStatus: apiData.subscriptionStatus || "Inactive",
            scoreCount: apiData.scoreCount || 0,
            charityName: apiData.charityName || "Not Selected",
            totalWinnings: apiData.totalWinnings || 0,
            totalContributed: apiData.totalContributed || 0,
            nextDrawDays: apiData.nextDrawDays || 12,
            nextDrawDate: apiData.nextDrawDate || null,
            recentWin: apiData.recentWin || null,
          });
        });
    }
  }, [session?.user?.id]);

  if (status === "loading")
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 text-emerald-400 text-xl"
        >
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          Loading your dashboard...
        </motion.div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#030712] relative">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 via-transparent to-amber-950/20" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/5 blur-3xl rounded-full" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-amber-500/5 blur-3xl rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back,{" "}
            <span className="text-emerald-400">{session?.user?.name}</span>
          </h1>
          <p className="text-gray-400 mb-12">
            Your journey to winning and giving continues.
          </p>
        </motion.div>

        {/* Top Stat Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Subscription Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-6 shadow-2xl shadow-emerald-500/20"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
            <div className="relative">
              <h3 className="text-emerald-100 text-sm font-medium mb-2">
                Subscription
              </h3>
              <div className="mb-4">
                <SubscriptionBadge status={data.subscriptionStatus} />
              </div>
              {data.subscriptionStatus !== "active" && (
                <Link
                  href="/pricing"
                  className="inline-block bg-white text-emerald-600 font-bold px-6 py-3 rounded-xl hover:bg-emerald-50 transition-all hover:scale-105 shadow-lg"
                >
                  View Plans
                </Link>
              )}
            </div>
          </motion.div>

          {/* Scores Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-emerald-500/30 transition-all group"
          >
            <h3 className="text-gray-400 text-sm font-medium mb-2">
              Scores Entered
            </h3>
            <div className="flex items-end gap-2 mb-4">
              <span className="text-3xl font-black text-white">
                {data.scoreCount}
              </span>
              <span className="text-gray-500 text-lg mb-1">/5</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3 mb-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(data.scoreCount / 5) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full"
              />
            </div>
            <Link
              href="/scores"
              className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all"
            >
              Enter Scores →
            </Link>
          </motion.div>

          {/* Charity Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-amber-500/30 transition-all group"
          >
            <h3 className="text-gray-400 text-sm font-medium mb-2">
              Supporting
            </h3>
            <p className="text-3xl font-black text-white mb-4">
              {data.charityName}
            </p>
            <Link
              href="/charity"
              className="text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all"
            >
              Change Charity →
            </Link>
          </motion.div>
        </div>

        {/* Secondary Stats + Countdown */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-900/30 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 text-sm font-medium">
                Total Winnings
              </h3>
              <span className="text-emerald-400 text-2xl">🏆</span>
            </div>
            <p className="text-4xl font-black text-white">
              ${data.totalWinnings.toLocaleString()}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-900/30 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 text-sm font-medium">
                Total Contributed
              </h3>
              <span className="text-amber-400 text-2xl">❤️</span>
            </div>
            <p className="text-4xl font-black text-white">
              ${data.totalContributed.toLocaleString()}
            </p>
          </motion.div>

          {/* Next Draw Countdown - Uses real draw date */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {data.nextDrawDate ? (
              <CountdownTimer targetDate={new Date(data.nextDrawDate)} />
            ) : (
              <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/20 rounded-2xl p-6 text-center">
                <h3 className="text-amber-400 text-sm font-medium mb-2">
                  Next Draw
                </h3>
                <p className="text-4xl font-black text-white">TBD</p>
                <p className="text-gray-400 text-sm mt-2">No draw scheduled</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap gap-4"
        >
          <Link href="/scores" className="btn-primary">
            Enter Score
          </Link>
          <Link href="/charity" className="btn-secondary">
            Change Charity
          </Link>
          <Link href="/draws" className="btn-ghost">
            Past Draws →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
