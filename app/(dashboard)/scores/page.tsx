"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Confetti from "react-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface Score {
  _id: string;
  score: number;
  date: string;
  createdAt: string;
}

export default function ScoresPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [scores, setScores] = useState<Score[]>([]);
  const [newScore, setNewScore] = useState({ score: "", date: "" });
  const [error, setError] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    fetch("/api/scores")
      .then((res) => res.json())
      .then((data) => setScores(data.scores || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newScore),
    });

    const data = await res.json();
    if (res.ok) {
      setScores([data.score, ...scores].slice(0, 5));
      setNewScore({ score: "", date: "" });
      toast.success("Score added successfully! 🎉");
      // Confetti removed from score submit - only show on actual wins
    } else {
      setError(data.error);
      toast.error(data.error || "Failed to add score");
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/scores/${id}`, { method: "DELETE" });
    setScores(scores.filter((s) => s._id !== id));
    toast.success("Score deleted");
  };

  return (
    <div className="min-h-screen bg-[#030712] relative">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 via-transparent to-amber-950/20" />

      {showConfetti && (
        <Confetti
          width={typeof window !== "undefined" ? window.innerWidth : 1920}
          height={typeof window !== "undefined" ? window.innerHeight : 1080}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      <div className="relative z-10 max-w-4xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-12">
            My <span className="text-emerald-400">Scores</span>
          </h1>
        </motion.div>

        {session?.user?.subscriptionStatus !== "active" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 mb-8"
          >
            <p className="text-amber-400">
              Active subscription required to enter scores.
            </p>
          </motion.div>
        )}

        {/* Add Score Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Add New Score</h2>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-rose-400 mb-4"
            >
              {error}
            </motion.p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Score (1-45)"
                min="1"
                max="45"
                value={newScore.score}
                onChange={(e) =>
                  setNewScore({ ...newScore, score: e.target.value })
                }
                className="input"
                required
              />
              <input
                type="date"
                value={newScore.date}
                onChange={(e) =>
                  setNewScore({ ...newScore, date: e.target.value })
                }
                className="input"
                required
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="btn-primary"
            >
              Add Score
            </motion.button>
          </form>
        </motion.div>

        {/* Recent Scores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6"
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            Recent Scores{" "}
            <span className="text-gray-400 text-lg">({scores.length}/5)</span>
          </h2>
          {scores.length === 0 ? (
            <p className="text-gray-400">
              No scores yet. Add your first score above.
            </p>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {scores.map((s, index) => (
                  <motion.div
                    key={s._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex justify-between items-center p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-black text-lg">
                          {s.score}
                        </span>
                      </div>
                      <div>
                        <span className="text-white font-bold text-lg">
                          {s.score} points
                        </span>
                        <span className="text-gray-400 ml-4">
                          {new Date(s.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(s._id)}
                      className="text-rose-400 hover:text-rose-300 font-medium opacity-0 group-hover:opacity-100 transition-all"
                    >
                      Delete
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
