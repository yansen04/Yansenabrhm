import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ReceiptsPage() {
  const receipts = await prisma.receipt.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Receipts</h2>
        <Link href="/receipts/new" className="px-3 py-2 rounded bg-black text-white dark:bg-white dark:text-black">New Receipt</Link>
      </div>
      <table className="w-full border text-sm">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="text-left p-2 border">Reference</th>
            <th className="text-left p-2 border">Status</th>
            <th className="text-left p-2 border">Created</th>
          </tr>
        </thead>
        <tbody>
          {receipts.map((r) => (
            <tr key={r.id}>
              <td className="p-2 border font-mono">{r.reference}</td>
              <td className="p-2 border">{r.status}</td>
              <td className="p-2 border">{new Date(r.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
