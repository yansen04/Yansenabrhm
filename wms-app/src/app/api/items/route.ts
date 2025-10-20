import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { NextResponse } from "next/server";

const ItemSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  uom: z.string().min(1),
  description: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = ItemSchema.parse(json);
    const created = await prisma.item.create({ data });
    return NextResponse.json(created, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function GET() {
  const items = await prisma.item.findMany({ orderBy: { sku: "asc" } });
  return NextResponse.json(items);
}
