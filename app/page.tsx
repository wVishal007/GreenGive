"use client";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useEffect, useState, useRef } from "react";

function AnimatedCounter({
  end,
  duration = 2,
}: {
  end: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#030712] relative overflow-hidden">
      {/* Floating gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 blur-3xl rounded-full animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 blur-3xl rounded-full animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/[0.03] blur-3xl rounded-full" />

      {/* Nav */}
      <nav className="relative z-10 flex justify-between items-center p-6 max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-black text-white"
        >
          Digital<span className="text-emerald-400">Heroes</span>
        </motion.h1>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="text-gray-300 hover:text-emerald-400 transition-colors py-2"
          >
            Login
          </Link>
          <Link href="/signup" className="relative group">
            <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-25 rounded-xl group-hover:opacity-40 transition-opacity" />
            <span className="relative bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold px-6 py-2 rounded-xl transition-all hover:scale-105 block">
              Sign Up Free
            </span>
          </Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-40 text-center">
        {/* Social proof badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-8"
        >
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-emerald-400 text-sm font-medium">
            $50,000+ donated to charity
          </span>
        </motion.div>

        {/* Hero headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-6xl md:text-8xl font-black text-white mb-6 leading-[0.9] tracking-tight"
        >
          Play to Win.
          <br />
          <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-400 bg-clip-text text-transparent">
            Give to Save.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Turn your golf game into real rewards and charitable impact. Every
          round brings you closer to winningâ€”and helping others.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
        >
          <Link href="/signup" className="relative group">
            <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-25 rounded-xl group-hover:opacity-40 transition-opacity" />
            <span className="relative bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-gray-900 font-bold px-8 py-4 rounded-xl text-lg block transition-all hover:scale-105 shadow-2xl shadow-emerald-500/25">
              Start Winning Now â†’
            </span>
          </Link>
          <Link
            href="#how-it-works"
            className="border-2 border-gray-700 text-gray-300 hover:border-emerald-500 hover:text-emerald-400 font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:bg-emerald-500/5"
          >
            See How It Works
          </Link>
        </motion.div>

        {/* Animated Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-black text-emerald-400 mb-1">
              <AnimatedCounter end={2400} />+
            </div>
            <div className="text-sm text-gray-500">Active Players</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-black text-amber-400 mb-1">
              $<AnimatedCounter end={50000} />+
            </div>
            <div className="text-sm text-gray-500">Donated</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-black text-white mb-1">
              $<AnimatedCounter end={120000} />+
            </div>
            <div className="text-sm text-gray-500">Prizes Won</div>
          </div>
        </motion.div>
      </main>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="relative z-10 max-w-7xl mx-auto px-6 py-32"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-white text-center mb-16"
        >
          How It <span className="text-emerald-400">Works</span>
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Track Scores",
              desc: "Enter your last 5 Stableford scores. Simple, fast, rewarding.",
              icon: "ðŸ“Š",
            },
            {
              step: "02",
              title: "Choose Charity",
              desc: "Pick a cause you care about. Your subscription helps them.",
              icon: "â¤ï¸",
            },
            {
              step: "03",
              title: "Win Prizes",
              desc: "Monthly draws with prize pools from all subscribers.",
              icon: "ðŸ†",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-2xl group-hover:from-emerald-500/10 transition-all" />
              <div className="relative bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 hover:border-emerald-500/30 transition-all hover:-translate-y-1">
                <div className="text-5xl mb-4">{item.icon}</div>
                <div className="text-emerald-400 text-sm font-bold mb-2">
                  STEP {item.step}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Prize + Charity Storytelling */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-white mb-6">
              Every Round <span className="text-emerald-400">Gives Back</span>
            </h3>
            <p className="text-gray-400 mb-4">
              20% of every subscription goes directly to your chosen charity.
              The rest funds our monthly prize pools.
            </p>
            <p className="text-gray-400">
              Last month, we donated $12,000 to charity and awarded $28,000 in
              prizes to 15 winners.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-6 text-center shadow-2xl shadow-emerald-500/20">
              <div className="text-4xl font-black text-white mb-2">$12K</div>
              <div className="text-emerald-100 text-sm">Donated Last Month</div>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-center shadow-2xl shadow-amber-500/20">
              <div className="text-4xl font-black text-white mb-2">$28K</div>
              <div className="text-amber-100 text-sm">Prizes Awarded</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Charities Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-white text-center mb-16"
        >
          Featured <span className="text-emerald-400">Charities</span>
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {[
            {
              name: "Red Cross",
              desc: "Providing humanitarian aid worldwide",
              icon: "â¤ï¸",
            },
            {
              name: "Ocean Cleanup",
              desc: "Cleaning plastic from oceans",
              icon: "ðŸŒŠ",
            },
            {
              name: "Education First",
              desc: "Supporting global education access",
              icon: "ðŸ“š",
            },
          ].map((charity, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-emerald-500/30 transition-all hover:-translate-y-1"
            >
              <div className="text-4xl mb-4">{charity.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">
                {charity.name}
              </h3>
              <p className="text-gray-400 text-sm">{charity.desc}</p>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/charities" className="btn-secondary inline-block">
            View All Charities â†’
          </Link>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-emerald-500/10 to-amber-500/10 border border-gray-800 rounded-3xl p-12"
        >
          <h3 className="text-4xl font-bold text-white mb-6">
            Ready to Make an Impact?
          </h3>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of players who are winning prizes while supporting
            causes they care about.
          </p>
          <Link href="/signup" className="relative group inline-block">
            <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-25 rounded-xl group-hover:opacity-40 transition-opacity" />
            <span className="relative bg-gradient-to-r from-emerald-500 to-emerald-400 text-gray-900 font-bold px-8 py-4 rounded-xl text-lg block transition-all hover:scale-105">
              Join Digital Heroes â†’
            </span>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
