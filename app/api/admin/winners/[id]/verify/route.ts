import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import Winner from "@/models/Winner";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! });
  if (!token || token.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await connectToDatabase();

  const winner = await Winner.findByIdAndUpdate(
    params.id,
    { verified: true, verifiedBy: token.id, verifiedAt: new Date() },
    { new: true },
  ).populate("userId", "name email");

  if (!winner) {
    return NextResponse.json({ error: "Winner not found" }, { status: 404 });
  }

  return NextResponse.json({ winner });
}
