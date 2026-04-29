import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import Score from "@/models/Score";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDatabase();
  const scores = await Score.find({ userId: token.id })
    .sort({ date: -1 })
    .limit(5);
  return NextResponse.json({ scores });
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { score, date } = await req.json();

  if (!score || score < 1 || score > 45) {
    return NextResponse.json(
      { error: "Score must be between 1 and 45" },
      { status: 400 },
    );
  }
  if (!date || new Date(date).toDateString() > new Date().toDateString()) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  await connectToDatabase();

  const user = await User.findById(token.id);
  if (!user || user.subscriptionStatus !== "active") {
    return NextResponse.json(
      { error: "Active subscription required" },
      { status: 403 },
    );
  }

  const existingScore = await Score.findOne({
    userId: token.id,
    date: new Date(date),
  });
  if (existingScore) {
    return NextResponse.json(
      { error: "Score already exists for this date" },
      { status: 400 },
    );
  }

  const userScores = await Score.find({ userId: token.id }).sort({ date: 1 });
  if (userScores.length >= 5) {
    await Score.findByIdAndDelete(userScores[0]._id);
  }

  const newScore = await Score.create({
    userId: token.id,
    score,
    date: new Date(date),
  });

  return NextResponse.json({ score: newScore });
}
