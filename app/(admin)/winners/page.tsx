"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface Winner {
  _id: string;
  userId: { _id: string; name: string; email: string };
  matchType: number;
  scoreNumbers: number[];
  prizeAmount: number;
  payoutStatus: string;
  verified: boolean;
  createdAt: string;
}

export default function AdminWinners() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [winners, setWinners] = useState<Winner[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session?.user?.role !== "admin") router.push("/dashboard");
  }, [status, session, router]);

  const fetchWinners = () => {
    fetch("/api/admin/winners")
      .then((res) => res.json())
      .then((data) => setWinners(data.winners || []));
  };

  useEffect(() => {
    fetchWinners();
  }, []);

  const handleVerify = async (id: string) => {
    const res = await fetch(`/api/admin/winners/${id}/verify`, {
      method: "PUT",
    });
    if (res.ok) {
      toast.success("Winner verified!");
      fetchWinners();
    }
  };

  const handlePayout = async (id: string) => {
    const transactionId = prompt("Enter transaction ID:");
    if (!transactionId) return;

    const res = await fetch(`/api/admin/winners/${id}/payout`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactionId }),
    });
    if (res.ok) {
      toast.success("Payout completed!");
      fetchWinners();
    }
  };

  if (status === "loading")
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="animate-pulse text-emerald-400 text-xl">Loading...</div>
      </div>
    );

  const getMatchColor = (matchType: number) => {
    if (matchType === 5)
      return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    if (matchType === 4)
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  };

  return (
    <div className="min-h-screen bg-[#030712] relative">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 via-transparent to-amber-950/20" />

      <div className="relative z-10 max-w-7xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Winner <span className="text-emerald-400">Management</span>
          </h1>
          <p className="text-gray-400 mb-12">
            Verify winners and process payouts for all draws.
          </p>
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
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  Match Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  Numbers
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  Prize
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {winners.map((w, index) => (
                <motion.tr
                  key={w._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-800/50 hover:bg-gray-900/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="text-white font-medium">
                      {w.userId?.name || "Unknown"}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {w.userId?.email || ""}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${getMatchColor(w.matchType)}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {w.matchType} Numbers
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {w.scoreNumbers?.join(", ") || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-emerald-400 font-bold">
                    ${w.prizeAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                          w.verified
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {w.verified ? "Verified" : "Pending"}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                          w.payoutStatus === "paid"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {w.payoutStatus}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {!w.verified && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleVerify(w._id)}
                          className="btn-ghost text-xs px-3 py-1"
                        >
                          Verify
                        </motion.button>
                      )}
                      {w.verified && w.payoutStatus !== "paid" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePayout(w._id)}
                          className="btn-primary text-xs px-3 py-1"
                        >
                          Process Payout
                        </motion.button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {winners.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No winners yet. Publish a draw to see winners here.
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
