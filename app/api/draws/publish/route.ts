import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import Draw from "@/models/Draw";
import Winner from "@/models/Winner";
import { runDraw, saveWinners } from "@/lib/draw-engine";

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { drawId } = await req.json();
  await connectToDatabase();

  const draw = await Draw.findById(drawId);
  if (!draw || draw.status === "published") {
    return NextResponse.json({ error: "Invalid draw" }, { status: 400 });
  }

  let winners;
  try {
    winners = await runDraw(draw.drawNumbers, drawId);
    await saveWinners(winners, drawId, draw.prizePool);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process draw" },
      { status: 500 },
    );
  }

  const has5MatchWinner = winners.some((w) => w.matchType === 5);
  if (!has5MatchWinner) {
    draw.rollover5Match = draw.prizePool.match5;
  }

  draw.status = "published";
  draw.publishedAt = new Date();
  await draw.save();

  return NextResponse.json({ draw, winners });
}
