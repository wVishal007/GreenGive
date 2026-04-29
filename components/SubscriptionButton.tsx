"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

interface SubscriptionButtonProps {
  plan?: "monthly" | "yearly";
  className?: string;
  children?: React.ReactNode;
}

export default function SubscriptionButton({
  plan = "monthly",
  className = "",
  children,
}: SubscriptionButtonProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  if (!session) return null;

  return (
    <div>
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className={`${className} disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading ? "Processing..." : children || "Subscribe Now"}
      </button>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
}
