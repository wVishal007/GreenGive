"use client";

import { motion } from "framer-motion";

interface SubscriptionBadgeProps {
  status: string;
}

export default function SubscriptionBadge({ status }: SubscriptionBadgeProps) {
  const config = {
    active: {
      color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      label: "Active",
      icon: "✓",
    },
    inactive: {
      color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      label: "Inactive",
      icon: "○",
    },
    cancelled: {
      color: "bg-red-500/20 text-red-400 border-red-500/30",
      label: "Cancelled",
      icon: "✕",
    },
    expiring: {
      color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      label: "Expiring Soon",
      icon: "⚠",
    },
  };

  const badge = config[status as keyof typeof config] || config.inactive;

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${badge.color}`}
    >
      <span>{badge.icon}</span>
      {badge.label}
    </motion.span>
  );
}
