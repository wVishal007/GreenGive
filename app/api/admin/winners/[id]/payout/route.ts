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

  const { transactionId } = await req.json();

  await connectToDatabase();

  const winner = await Winner.findByIdAndUpdate(
    params.id,
    {
      payoutStatus: "paid",
      payoutDate: new Date(),
      payoutMethod: "stripe",
      payoutTransactionId: transactionId,
    },
    { new: true },
  ).populate("userId", "name email");

  if (!winner) {
    return NextResponse.json({ error: "Winner not found" }, { status: 404 });
  }

  return NextResponse.json({ winner });
}
