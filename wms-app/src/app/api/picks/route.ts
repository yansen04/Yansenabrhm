import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const LineSchema = z.object({ itemId: z.string().min(1), quantity: z.number().int().positive() });
const PickSchema = z.object({ reference: z.string().min(1), lines: z.array(LineSchema).min(1) });

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = PickSchema.parse(json);

    const created = await prisma.$transaction(async (tx) => {
      const pick = await tx.pick.create({ data: { reference: data.reference } });
      for (const line of data.lines) {
        await tx.pickLine.create({ data: { pickId: pick.id, itemId: line.itemId, qty: line.quantity } });
        // Deduct stock from any location where available, prioritizing STORAGE
        const invRows = await tx.inventory.findMany({ where: { itemId: line.itemId }, include: { location: true }, orderBy: { location: { type: "asc" } } });
        let remaining = line.quantity;
        for (const inv of invRows) {
          if (remaining <= 0) break;
          const take = Math.min(inv.quantity, remaining);
          if (take > 0) {
            await tx.inventory.update({ where: { id: inv.id }, data: { quantity: { decrement: take } } });
            remaining -= take;
          }
        }
        if (remaining > 0) throw new Error("Insufficient stock for item");
      }
      await tx.pick.update({ where: { id: pick.id }, data: { status: "PICKED" } });
      return pick;
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function GET() {
  const picks = await prisma.pick.findMany({ orderBy: { createdAt: "desc" }, include: { lines: true } });
  return NextResponse.json(picks);
}
