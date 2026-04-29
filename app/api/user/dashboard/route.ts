import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import Score from "@/models/Score";
import User from "@/models/User";
import Charity from "@/models/Charity";
import Winner from "@/models/Winner";
import Draw from "@/models/Draw";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! });
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDatabase();

  const [scores, user, winners, nextDraw] = await Promise.all([
    Score.find({ userId: token.id }).sort({ date: -1 }).limit(5),
    User.findById(token.id).populate("charityId"),
    Winner.find({ userId: token.id, payoutStatus: "paid" }),
    Draw.findOne({ status: "pending" }).sort({ createdAt: 1 }),
  ]);

  const totalWinnings = winners.reduce((sum, w) => sum + w.prizeAmount, 0);

  const monthlySub = user?.subscriptionPlan === "yearly" ? 600 : 60;
  const contributedPerMonth = (monthlySub * (user?.charityPercent || 10)) / 100;
  const totalContributed = contributedPerMonth * 6; // Estimate 6 months

  let nextDrawDate = null;
  let nextDrawDays = 0;
  if (nextDraw) {
    const drawDate = new Date(nextDraw.year, nextDraw.month - 1, 1);
    nextDrawDate = drawDate.toISOString();
    nextDrawDays = Math.ceil(
      (drawDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
  }

  const recentWin = await Winner.findOne({ userId: token.id })
    .sort({ createdAt: -1 })
    .populate("drawId", "month year");

  return NextResponse.json({
    subscriptionStatus: user?.subscriptionStatus || "inactive",
    scoreCount: scores.length,
    charityName: (user?.charityId as any)?.name || "Not Selected",
    totalWinnings: parseFloat(totalWinnings.toFixed(2)),
    totalContributed: parseFloat(totalContributed.toFixed(2)),
    nextDrawDate,
    nextDrawDays: Math.max(0, nextDrawDays),
    recentWin: recentWin
      ? {
          amount: recentWin.prizeAmount,
          matchType: recentWin.matchType,
          drawDate: `${(recentWin.drawId as any)?.month}/${(recentWin.drawId as any)?.year}`,
        }
      : null,
  });
}
