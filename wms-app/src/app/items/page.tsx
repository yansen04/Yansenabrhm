import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ItemsPage() {
  const items = await prisma.item.findMany({ orderBy: { sku: "asc" } });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Items</h2>
        <Link href="/items/new" className="px-3 py-2 rounded bg-black text-white dark:bg-white dark:text-black">New Item</Link>
      </div>
      <table className="w-full border text-sm">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="text-left p-2 border">SKU</th>
            <th className="text-left p-2 border">Name</th>
            <th className="text-left p-2 border">UOM</th>
            <th className="text-left p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id}>
              <td className="p-2 border font-mono">{it.sku}</td>
              <td className="p-2 border">{it.name}</td>
              <td className="p-2 border">{it.uom}</td>
              <td className="p-2 border">
                <Link className="underline" href={`/items/${it.id}`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
