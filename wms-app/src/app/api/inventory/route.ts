import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const rows = await prisma.inventory.findMany({ include: { item: true, location: true } });
  return NextResponse.json(rows);
}
