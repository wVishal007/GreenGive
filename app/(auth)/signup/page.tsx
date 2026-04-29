"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignupPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    charityId: "",
    charityPercent: 10,
    plan: "monthly",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) router.push("/login");
    else setError(data.error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] relative">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 via-transparent to-amber-950/20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/[0.03] blur-3xl rounded-full" />

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="relative z-10 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 w-96"
      >
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Join <span className="text-emerald-400">Digital Heroes</span>
        </h2>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-rose-400 mb-4 text-center"
          >
            {error}
          </motion.p>
        )}
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="input w-full mb-4"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="input w-full mb-4"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="input w-full mb-4"
          required
          minLength={8}
        />
        <select
          value={form.plan}
          onChange={(e) => setForm({ ...form, plan: e.target.value })}
          className="input w-full mb-4"
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
        <div className="mb-6">
          <label className="block text-gray-400 text-sm mb-2">
            Charity Contribution (%)
            <span className="text-gray-500 font-normal ml-1">
              min 10%, max 100%
            </span>
          </label>
          <input
            type="number"
            placeholder="10"
            value={form.charityPercent}
            onChange={(e) =>
              setForm({ ...form, charityPercent: +e.target.value })
            }
            className="input w-full"
            min={10}
            max={100}
          />
          <p className="text-gray-500 text-xs mt-1">
            Percentage of subscription donated to your chosen charity
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="btn-primary w-full"
        >
          Sign Up
        </motion.button>
        <p className="mt-6 text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-emerald-400 hover:text-emerald-300 font-medium"
          >
            Login
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
