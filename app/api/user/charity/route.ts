import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! });
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { charityId } = await req.json();
  await connectToDatabase();

  if (charityId && !mongoose.Types.ObjectId.isValid(charityId)) {
    return NextResponse.json({ error: "Invalid charity ID" }, { status: 400 });
  }

  await User.findByIdAndUpdate(token.id, { charityId: charityId || null });
  return NextResponse.json({ success: true });
}
