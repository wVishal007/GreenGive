"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Draw {
  _id: string;
  month: number;
  year: number;
  drawNumbers: number[];
  status: string;
  prizePool: { match5: number; match4: number; match3: number };
}

export default function DrawsPage() {
  const [draws, setDraws] = useState<Draw[]>([]);

  useEffect(() => {
    fetch("/api/draws")
      .then((res) => res.json())
      .then((data) => setDraws(data.draws || []));
  }, []);

  const getMonthName = (month: number) => {
    return new Date(2000, month - 1).toLocaleString("default", {
      month: "long",
    });
  };

  return (
    <div className="min-h-screen bg-[#030712] relative">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 via-transparent to-amber-950/20" />

      <div className="relative z-10 max-w-4xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Past <span className="text-emerald-400">Draws</span>
          </h1>
          <p className="text-gray-400 mb-12">
            View all monthly draws and winning numbers.
          </p>
        </motion.div>

        {draws.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              No draws yet. Check back after the first draw!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {draws.map((draw, index) => (
              <motion.div
                key={draw._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {getMonthName(draw.month)} {draw.year}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium mt-2 ${
                        draw.status === "published"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current" />
                      {draw.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Prize Pool</p>
                    <p className="text-2xl font-bold text-emerald-400">
                      $
                      {(
                        draw.prizePool.match5 +
                          draw.prizePool.match4 +
                          draw.prizePool.match3 || 0
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>

                {draw.drawNumbers && draw.drawNumbers.length > 0 ? (
                  <div>
                    <p className="text-gray-400 text-sm mb-3">
                      Winning Numbers
                    </p>
                    <div className="flex gap-3">
                      {draw.drawNumbers.map((num, i) => (
                        <div
                          key={i}
                          className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center"
                        >
                          <span className="text-white font-bold text-lg">
                            {num}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                        <p className="text-gray-400 text-xs">5 Numbers</p>
                        <p className="text-white font-bold">
                          ${draw.prizePool.match5?.toLocaleString() || 0}
                        </p>
                      </div>
                      <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                        <p className="text-gray-400 text-xs">4 Numbers</p>
                        <p className="text-white font-bold">
                          ${draw.prizePool.match4?.toLocaleString() || 0}
                        </p>
                      </div>
                      <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                        <p className="text-gray-400 text-xs">3 Numbers</p>
                        <p className="text-white font-bold">
                          ${draw.prizePool.match3?.toLocaleString() || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Draw pending...</p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
