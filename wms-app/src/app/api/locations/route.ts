import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const LocationSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(["STORAGE", "RECEIVING", "SHIPPING", "PICKING"]),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = LocationSchema.parse(json);
    const created = await prisma.location.create({ data });
    return NextResponse.json(created, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function GET() {
  const locations = await prisma.location.findMany({ orderBy: { code: "asc" } });
  return NextResponse.json(locations);
}
