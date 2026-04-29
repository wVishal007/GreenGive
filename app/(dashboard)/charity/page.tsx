"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Charity {
  _id: string;
  name: string;
  description: string;
  logoUrl?: string;
  featured?: boolean;
}

export default function CharityPage() {
  const { data: session, update } = useSession();
  const [charities, setCharities] = useState<Charity[]>([]);
  const [currentCharityId, setCurrentCharityId] = useState<string>("");
  const [changing, setChanging] = useState(false);

  useEffect(() => {
    fetch("/api/charities")
      .then((res) => res.json())
      .then((data) => setCharities(data.charities || []));
  }, []);

  useEffect(() => {
    if (session?.user?.charityId) {
      setCurrentCharityId(session.user.charityId as string);
    }
  }, [session]);

  const handleSelect = async (charityId: string) => {
    if (charityId === currentCharityId) return;

    setChanging(true);
    const res = await fetch("/api/user/charity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ charityId }),
    });

    if (res.ok) {
      setCurrentCharityId(charityId);
      await update();
      const charity = charities.find((c) => c._id === charityId);
      toast.success(`Now supporting ${charity?.name}! ❤️`);
    } else {
      toast.error("Failed to update charity");
    }
    setChanging(false);
  };

  const selectedCharity = charities.find((c) => c._id === currentCharityId);

  return (
    <div className="min-h-screen bg-[#030712] relative">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 via-transparent to-amber-950/20" />

      <div className="relative z-10 max-w-4xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Your <span className="text-emerald-400">Charity</span>
          </h1>
          <p className="text-gray-400 mb-8">
            Select a cause you care about. A portion of your subscription goes
            directly to them.
          </p>
        </motion.div>

        {/* Current Charity Card */}
        {selectedCharity ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center gap-4">
              {selectedCharity.logoUrl && (
                <img
                  src={selectedCharity.logoUrl}
                  alt={selectedCharity.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
              )}
              <div className="flex-1">
                <p className="text-emerald-400 text-sm font-medium mb-1">
                  Currently Supporting
                </p>
                <p className="text-2xl font-bold text-white">
                  {selectedCharity.name}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {selectedCharity.description}
                </p>
              </div>
              <div className="text-4xl">❤️</div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 text-center"
          >
            <p className="text-amber-400 text-lg font-bold mb-2">
              No Charity Selected
            </p>
            <p className="text-gray-400">
              Choose a charity below to start making an impact!
            </p>
          </motion.div>
        )}

        {/* All Charities Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-white mb-2">
            {selectedCharity ? "Change Charity" : "Select a Charity"}
          </h2>
          <p className="text-gray-400 mb-6">
            Click on a charity below to support them
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {charities.map((c, index) => {
              const isSelected = currentCharityId === c._id;
              return (
                <motion.div
                  key={c._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative bg-gray-900/50 backdrop-blur-xl border-2 rounded-2xl p-6 transition-all hover:-translate-y-1 ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-500/5 shadow-lg shadow-emerald-500/20"
                      : "border-gray-800 hover:border-emerald-500/50"
                  } ${changing ? "opacity-50 pointer-events-none" : ""}`}
                >
                  {c.logoUrl && (
                    <img
                      src={c.logoUrl}
                      alt={c.name}
                      className="w-16 h-16 mb-4 rounded-xl object-cover"
                    />
                  )}
                  {c.featured && (
                    <span className="inline-block bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-2 py-1 rounded-full mb-2">
                      ⭐ Featured
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-white mb-2">
                    {c.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">{c.description}</p>

                  {isSelected ? (
                    <div className="inline-flex items-center gap-2 text-emerald-400 text-sm font-medium bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                      ✓ Currently Selected
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSelect(c._id)}
                      disabled={changing}
                      className="btn-primary text-sm w-full"
                    >
                      Select This Charity
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {changing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
              <p className="text-white">Updating charity...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
