import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function LocationsPage() {
  const locations = await prisma.location.findMany({ orderBy: { code: "asc" } });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Locations</h2>
        <Link href="/locations/new" className="px-3 py-2 rounded bg-black text-white dark:bg-white dark:text-black">New Location</Link>
      </div>
      <table className="w-full border text-sm">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="text-left p-2 border">Code</th>
            <th className="text-left p-2 border">Name</th>
            <th className="text-left p-2 border">Type</th>
            <th className="text-left p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((loc) => (
            <tr key={loc.id}>
              <td className="p-2 border font-mono">{loc.code}</td>
              <td className="p-2 border">{loc.name}</td>
              <td className="p-2 border">{loc.type}</td>
              <td className="p-2 border">
                <Link className="underline" href={`/locations/${loc.id}`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
