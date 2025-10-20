import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { NextResponse, NextRequest } from "next/server";

const ItemSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  uom: z.string().min(1),
  description: z.string().optional().nullable(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const json = await req.json();
    const data = ItemSchema.parse(json);
    const updated = await prisma.item.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.item.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ message }, { status: 400 });
  }
}
