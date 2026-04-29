"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  subscriptionStatus: string;
}

export default function AdminUsers() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session?.user?.role !== "admin") router.push("/dashboard");
  }, [status, session, router]);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.users || []));
  }, []);

  if (status === "loading")
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="animate-pulse text-emerald-400 text-xl">Loading...</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#030712] relative">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 via-transparent to-amber-950/20" />

      <div className="relative z-10 max-w-6xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-12">
            User <span className="text-emerald-400">Management</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Subscription
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <motion.tr
                  key={u._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-800/50 hover:bg-gray-900/30 transition-colors"
                >
                  <td className="px-6 py-4 text-white font-medium">{u.name}</td>
                  <td className="px-6 py-4 text-gray-400">{u.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                        u.role === "admin"
                          ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current" />
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                        u.subscriptionStatus === "active"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current" />
                      {u.subscriptionStatus}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
}
