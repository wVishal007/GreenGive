"use client";

import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { motion, AnimatePresence } from "framer-motion";

interface WinnerBannerProps {
  amount: number;
  matchType: 3 | 4 | 5;
  drawDate: string;
  onDismiss: () => void;
}

export default function WinnerBanner({
  amount,
  matchType,
  drawDate,
  onDismiss,
}: WinnerBannerProps) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const getMatchLabel = () => {
    if (matchType === 5) return "5 Numbers Matched!";
    if (matchType === 4) return "4 Numbers Matched!";
    return "3 Numbers Matched!";
  };

  const getColor = () => {
    if (matchType === 5)
      return "from-amber-500/20 to-amber-600/10 border-amber-500/30";
    if (matchType === 4)
      return "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30";
    return "from-blue-500/20 to-blue-600/10 border-blue-500/30";
  };

  return (
    <>
      {showConfetti && (
        <Confetti
          width={typeof window !== "undefined" ? window.innerWidth : 1920}
          height={typeof window !== "undefined" ? window.innerHeight : 1080}
          recycle={false}
          numberOfPieces={300}
          colors={["#10B981", "#F59E0B", "#3B82F6", "#EF4444"]}
        />
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -50 }}
        className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 
                   bg-gradient-to-br ${getColor()} 
                   backdrop-blur-xl border rounded-3xl p-8 text-center
                   shadow-[0_0_60px_rgba(16,185,129,0.2)]`}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-6xl mb-4"
        >
          {matchType === 5 ? "🏆" : matchType === 4 ? "🎉" : "🎈"}
        </motion.div>

        <h2 className="text-3xl font-black text-white mb-2">You Won!</h2>

        <div
          className={`text-5xl font-black mb-4 ${
            matchType === 5
              ? "text-amber-400"
              : matchType === 4
              ? "text-emerald-400"
              : "text-blue-400"
          }`}
        >
          ${amount.toFixed(2)}
        </div>

        <p className="text-white font-bold mb-2">{getMatchLabel()}</p>
        <p className="text-gray-300 text-sm mb-6">Draw: {drawDate}</p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setShowConfetti(false);
            onDismiss();
          }}
          className="bg-white text-gray-900 font-bold px-6 py-3 rounded-xl"
        >
          Awesome!
        </motion.button>
      </motion.div>
    </>
  );
}
