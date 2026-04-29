import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import Draw from "@/models/Draw";
import Winner from "@/models/Winner";
import {
  generateRandomDraw,
  calculatePrizePool,
  runDraw,
  saveWinners,
} from "@/lib/draw-engine";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDatabase();
  const draws = await Draw.find().sort({ year: -1, month: -1 });
  return NextResponse.json({ draws });
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { month, year, drawType } = await req.json();
  await connectToDatabase();

  const existing = await Draw.findOne({ month, year });
  if (existing)
    return NextResponse.json({ error: "Draw already exists" }, { status: 400 });

  const drawNumbers = generateRandomDraw();
  const lastDraw = await Draw.findOne({ status: "published" }).sort({
    year: -1,
    month: -1,
  });
  const rollover = lastDraw?.rollover5Match || 0;
  const prizePool = await calculatePrizePool(month, year, rollover);

  const draw = await Draw.create({
    month,
    year,
    drawNumbers,
    drawType: drawType || "random",
    status: "pending",
    prizePool,
    rollover5Match: 0,
  });

  return NextResponse.json({ draw });
}
