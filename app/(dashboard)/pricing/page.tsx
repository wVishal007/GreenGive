"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import PricingCards from "@/components/PricingCards";

export default function PricingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#030712] relative">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 via-transparent to-amber-950/20" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/5 blur-3xl rounded-full" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-amber-500/5 blur-3xl rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Support your favorite charity and get a chance to win prizes. Every
            subscription makes a difference.
          </p>
        </motion.div>

        <PricingCards />
      </div>
    </div>
  );
}
