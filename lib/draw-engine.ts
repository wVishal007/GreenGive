import { connectToDatabase } from "./mongodb";
import User from "@/models/User";
import Score from "@/models/Score";
import Draw from "@/models/Draw";
import Winner from "@/models/Winner";
import mongoose from "mongoose";

// Transparent draw generation with seed storage
export interface TransparentDrawResult {
  numbers: number[];
  seed: string;
  generatedAt: Date;
  verificationData: string;
}

export function generateRandomDraw(): number[] {
  const numbers: Set<number> = new Set();
  while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(numbers).sort((a, b) => a - b);
}

export function generateTransparentDraw(
  publicValue?: string,
): TransparentDrawResult {
  const generatedAt = new Date();
  const publicData =
    publicValue || process.env.DRAW_PUBLIC_VALUE || generatedAt.toISOString();
  const seed = `${publicData}-${generatedAt.getTime()}`;

  // Use Node.js crypto for cryptographically secure randomness
  const crypto = require("crypto");
  const numbers: Set<number> = new Set();

  while (numbers.size < 5) {
    const randomBytes = crypto.randomBytes(4);
    const randomInt = randomBytes.readUInt32BE(0);
    const num = (randomInt % 45) + 1;
    numbers.add(num);
  }

  return {
    numbers: Array.from(numbers).sort((a, b) => a - b),
    seed,
    generatedAt,
    verificationData: publicData,
  };
}

// Calculate prize pool at publish time (not creation)
export async function calculatePrizePool(
  month: number,
  year: number,
  rollover5Match: number = 0,
) {
  await connectToDatabase();

  const activeSubscribers = await User.countDocuments({
    subscriptionStatus: "active",
  });

  const monthlyFee = 20;
  const totalPool = activeSubscribers * monthlyFee * 0.9;

  return {
    match5: Math.round((totalPool * 0.4 + rollover5Match) * 100) / 100,
    match4: Math.round(totalPool * 0.35 * 100) / 100,
    match3: Math.round(totalPool * 0.25 * 100) / 100,
  };
}

// Run draw with proper score period filtering
export async function runDraw(drawNumbers: number[], drawId: string) {
  await connectToDatabase();

  const draw = await Draw.findById(drawId);
  if (!draw) throw new Error("Draw not found");

  const activeUsers = await User.find({ subscriptionStatus: "active" });
  const userIds = activeUsers.map((u) => u._id);

  // Only get scores for this draw period
  const allScores = await Score.find({
    userId: { $in: userIds },
    $or: [
      { drawMonth: draw.month, drawYear: draw.year }, // Scores marked for this draw
      { date: { $lt: draw.createdAt } }, // Backward compatibility
    ],
    isActive: true,
  }).sort({ date: -1 });

  const userScoresMap = new Map<string, number[]>();
  for (const score of allScores) {
    const uid = score.userId.toString();
    if (!userScoresMap.has(uid)) userScoresMap.set(uid, []);
    const arr = userScoresMap.get(uid)!;
    if (arr.length < 5) arr.push(score.score);
  }

  const winners: Array<{
    userId: string;
    matchType: 3 | 4 | 5;
    scoreNumbers: number[];
  }> = [];

  for (const user of activeUsers) {
    const userNumbers = userScoresMap.get(user._id.toString()) || [];
    if (userNumbers.length === 0) continue;

    const matches = drawNumbers.filter((n) => userNumbers.includes(n)).length;
    if (matches >= 3) {
      winners.push({
        userId: user._id.toString(),
        matchType: matches as 3 | 4 | 5,
        scoreNumbers: userNumbers,
      });
    }
  }

  return winners;
}

// Simulation function (doesn't save)
export async function runDrawSimulation(drawNumbers: number[], drawId: string) {
  const winners = await runDraw(drawNumbers, drawId);
  return winners;
}

// Save winners with proper rounding and session support
export async function saveWinners(
  winners: any[],
  drawId: string,
  prizePool: any,
  session?: mongoose.ClientSession,
) {
  await connectToDatabase();
  const draw = await Draw.findById(drawId).session(session || null);
  if (!draw) throw new Error("Draw not found");

  const grouped = winners.reduce(
    (acc, w) => {
      if (!acc[w.matchType]) acc[w.matchType] = [];
      acc[w.matchType].push(w);
      return acc;
    },
    {} as Record<number, typeof winners>,
  );

  for (const [matchType, group] of Object.entries(grouped)) {
    const poolKey = `match${matchType}` as keyof typeof prizePool;
    const groupArray = group as Array<{
      userId: string;
      matchType: number;
      scoreNumbers: number[];
    }>;

    const prizePerWinner =
      Math.round((prizePool[poolKey] / groupArray.length) * 100) / 100;
    const totalDistributed = prizePerWinner * groupArray.length;
    const remainder =
      Math.round((prizePool[poolKey] - totalDistributed) * 100) / 100;

    for (let i = 0; i < groupArray.length; i++) {
      const winner = groupArray[i];
      const finalPrize = i === 0 ? prizePerWinner + remainder : prizePerWinner;

      await Winner.create(
        [
          {
            drawId: new mongoose.Types.ObjectId(drawId),
            userId: new mongoose.Types.ObjectId(winner.userId),
            matchType: Number(matchType),
            scoreNumbers: winner.scoreNumbers,
            prizeAmount: finalPrize,
            payoutStatus: "pending",
            verified: false,
          },
        ],
        { session },
      );
    }
  }
}
