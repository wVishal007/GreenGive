import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Draw from "@/models/Draw";
import Winner from "@/models/Winner";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await connectToDatabase();

  const totalUsers = await User.countDocuments();
  const activeSubs = await User.countDocuments({
    subscriptionStatus: "active",
  });
  const lastDraw = await Draw.findOne({ status: "published" }).sort({
    year: -1,
    month: -1,
  });
  const prizePool = lastDraw
    ? lastDraw.prizePool.match5 +
      lastDraw.prizePool.match4 +
      lastDraw.prizePool.match3
    : 0;
  const charityTotal = 0;

  return NextResponse.json({ totalUsers, activeSubs, prizePool, charityTotal });
}
