import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const LineSchema = z.object({ itemId: z.string().min(1), quantity: z.number().int().positive() });
const ReceiptSchema = z.object({ reference: z.string().min(1), lines: z.array(LineSchema).min(1) });

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = ReceiptSchema.parse(json);

    const created = await prisma.$transaction(async (tx) => {
      const receipt = await tx.receipt.create({ data: { reference: data.reference } });
      for (const line of data.lines) {
        await tx.receiptLine.create({ data: { receiptId: receipt.id, itemId: line.itemId, quantity: line.quantity } });
        const recvLoc = await tx.location.findFirst({ where: { type: "RECEIVING" } });
        const anyLoc = recvLoc ?? (await tx.location.findFirst({}));
        if (!anyLoc) throw new Error("No location available");
        await tx.inventory.upsert({
          where: { itemId_locationId: { itemId: line.itemId, locationId: anyLoc.id } },
          update: { quantity: { increment: line.quantity } },
          create: { itemId: line.itemId, locationId: anyLoc.id, quantity: line.quantity },
        });
      }
      await tx.receipt.update({ where: { id: receipt.id }, data: { status: "RECEIVED" } });
      return receipt;
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function GET() {
  const receipts = await prisma.receipt.findMany({ orderBy: { createdAt: "desc" }, include: { lines: true } });
  return NextResponse.json(receipts);
}
