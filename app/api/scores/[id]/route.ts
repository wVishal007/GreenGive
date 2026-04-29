import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import Score from "@/models/Score";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { score, date } = await req.json();
  await connectToDatabase();

  const existing = await Score.findOne({ userId: token.id, _id: params.id });
  if (!existing)
    return NextResponse.json({ error: "Score not found" }, { status: 404 });

  if (score && (score < 1 || score > 45)) {
    return NextResponse.json({ error: "Invalid score" }, { status: 400 });
  }

  if (date) {
    const duplicate = await Score.findOne({
      userId: token.id,
      date: new Date(date),
      _id: { $ne: params.id },
    });
    if (duplicate)
      return NextResponse.json(
        { error: "Score already exists for this date" },
        { status: 400 },
      );
    existing.date = new Date(date);
  }
  if (score) existing.score = score;

  await existing.save();
  return NextResponse.json({ score: existing });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDatabase();
  const result = await Score.deleteOne({ _id: params.id, userId: token.id });
  if (result.deletedCount === 0)
    return NextResponse.json({ error: "Score not found" }, { status: 404 });

  return NextResponse.json({ success: true });
}
