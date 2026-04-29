"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Charity {
  _id: string;
  name: string;
  description: string;
  logoUrl?: string;
  website?: string;
  featured: boolean;
}

export default function CharitiesPage() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [search, setSearch] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  useEffect(() => {
    fetch("/api/charities")
      .then((res) => res.json())
      .then((data) => setCharities(data.charities || []));
  }, []);

  const filtered = charities.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchesFeatured = featuredOnly ? c.featured : true;
    return matchesSearch && matchesFeatured;
  });

  const featuredCharities = filtered.filter((c) => c.featured);
  const otherCharities = filtered.filter((c) => !c.featured);

  return (
    <div className="min-h-screen bg-[#030712] relative">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 via-transparent to-amber-950/20" />

      <div className="relative z-10 max-w-6xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Our <span className="text-emerald-400">Charities</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover the charities you can support. A portion of every
            subscription goes directly to your chosen cause.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <input
            type="text"
            placeholder="Search charities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input flex-1"
          />
          <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={featuredOnly}
              onChange={(e) => setFeaturedOnly(e.target.checked)}
              className="rounded border-gray-700 bg-gray-800 text-emerald-500 focus:ring-emerald-500"
            />
            Show featured only
          </label>
        </motion.div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No charities found.</p>
          </div>
        ) : (
          <>
            {/* Featured Charities */}
            {featuredCharities.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="text-amber-400">⭐</span> Featured Charities
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {featuredCharities.map((c, index) => (
                    <motion.div
                      key={c._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-900/50 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-6 hover:border-amber-400/40 transition-all"
                    >
                      {c.logoUrl && (
                        <img
                          src={c.logoUrl}
                          alt={c.name}
                          className="w-16 h-16 mb-4 rounded-xl object-cover"
                        />
                      )}
                      <h3 className="text-xl font-bold text-white mb-2">
                        {c.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">
                        {c.description}
                      </p>
                      {c.website && (
                        <a
                          href={c.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:text-emerald-300 text-sm"
                        >
                          Visit Website →
                        </a>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* All Charities */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                All Charities
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {otherCharities.map((c, index) => (
                  <motion.div
                    key={c._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-emerald-500/30 transition-all"
                  >
                    {c.logoUrl && (
                      <img
                        src={c.logoUrl}
                        alt={c.name}
                        className="w-16 h-16 mb-4 rounded-xl object-cover"
                      />
                    )}
                    <h3 className="text-xl font-bold text-white mb-2">
                      {c.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      {c.description}
                    </p>
                    {c.website && (
                      <a
                        href={c.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 text-sm"
                      >
                        Visit Website →
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
