import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function PicksPage() {
  const picks = await prisma.pick.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Picks</h2>
        <Link href="/picks/new" className="px-3 py-2 rounded bg-black text-white dark:bg-white dark:text-black">New Pick</Link>
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
          {picks.map((p) => (
            <tr key={p.id}>
              <td className="p-2 border font-mono">{p.reference}</td>
              <td className="p-2 border">{p.status}</td>
              <td className="p-2 border">{new Date(p.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
