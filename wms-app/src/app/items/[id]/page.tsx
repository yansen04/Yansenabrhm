import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ItemForm } from "../shared/ItemForm";

export default async function EditItemPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const item = await prisma.item.findUnique({ where: { id } });
  if (!item) return notFound();
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Edit Item</h2>
      <ItemForm item={item} />
    </div>
  );
}
