"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

const plans = [
  {
    id: "monthly",
    name: "Monthly",
    price: "$60",
    period: "month",
    description: "Perfect for trying out",
    features: [
      "Enter up to 5 scores per month",
      "Support your favorite charity",
      "Chance to win monthly draws",
      "Cancel anytime",
    ],
  },
  {
    id: "yearly",
    name: "Yearly",
    price: "$600",
    period: "year",
    description: "Best value - save $120",
    badge: "Best Value",
    features: [
      "Enter up to 5 scores per month",
      "Support your favorite charity",
      "Chance to win monthly draws",
      "Save $120 compared to monthly",
      "Priority support",
    ],
  },
];

export default function PricingCards() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleSubscribe = async (plan: string) => {
    if (!session) return;
    setLoading(plan);
    setError("");

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.mock) {
        window.location.reload();
      } else {
        setError(data.error || "Failed to start checkout");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {plans.map((plan, index) => (
        <motion.div
          key={plan.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`relative bg-gray-900/50 backdrop-blur-xl border rounded-2xl p-8 hover:border-emerald-500/30 transition-all ${
            plan.id === "yearly" ? "border-amber-500/50" : "border-gray-800"
          }`}
        >
          {plan.badge && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-gray-900 text-xs font-bold px-4 py-1 rounded-full">
              {plan.badge}
            </div>
          )}

          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
            <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
            <div className="flex items-end justify-center gap-1">
              <span className="text-5xl font-black text-white">
                {plan.price}
              </span>
              <span className="text-gray-400 mb-1">/{plan.period}</span>
            </div>
          </div>

          <ul className="space-y-3 mb-8">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-300">
                <svg
                  className="w-5 h-5 text-emerald-400 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          <button
            onClick={() => handleSubscribe(plan.id)}
            disabled={loading !== null}
            className={`w-full py-3 px-6 rounded-xl font-bold transition-all hover:scale-105 ${
              plan.id === "yearly"
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-gray-900 hover:from-amber-400 hover:to-amber-500"
                : "bg-emerald-600 text-white hover:bg-emerald-500"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading === plan.id
              ? "Processing..."
              : "Start Supporting & Winning"}
          </button>
        </motion.div>
      ))}

      {error && (
        <div className="col-span-2 text-center text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
