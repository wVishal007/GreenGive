import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import Charity from "@/models/Charity";

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const featured = searchParams.get("featured");

  const query = featured === "true" ? { featured: true } : {};
  const charities = await Charity.find(query).sort({ featured: -1, name: 1 });
  return NextResponse.json({ charities });
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { name, description, logoUrl, website, featured } = await req.json();
  await connectToDatabase();

  const charity = await Charity.create({
    name,
    description,
    logoUrl,
    website,
    featured: featured || false,
  });

  return NextResponse.json({ charity });
}
