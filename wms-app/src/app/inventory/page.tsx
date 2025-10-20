import { prisma } from "@/lib/prisma";

export default async function InventoryPage() {
  const rows = await prisma.inventory.findMany({
    include: { item: true, location: true },
    orderBy: [{ location: { code: "asc" } }, { item: { sku: "asc" } }],
  });
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Inventory</h2>
      <table className="w-full border text-sm">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="text-left p-2 border">Location</th>
            <th className="text-left p-2 border">SKU</th>
            <th className="text-left p-2 border">Name</th>
            <th className="text-right p-2 border">Qty</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td className="p-2 border font-mono">{r.location.code}</td>
              <td className="p-2 border font-mono">{r.item.sku}</td>
              <td className="p-2 border">{r.item.name}</td>
              <td className="p-2 border text-right">{r.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
