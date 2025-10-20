"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function LocationForm({ location }: { location?: { id: string; code: string; name: string; type: string } }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [code, setCode] = useState(location?.code ?? "");
  const [name, setName] = useState(location?.name ?? "");
  const [type, setType] = useState(location?.type ?? "STORAGE");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const payload = { code, name, type };
    const res = await fetch(location ? `/api/locations/${location.id}` : "/api/locations", {
      method: location ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.message ?? "Failed to save location");
      return;
    }
    startTransition(() => {
      router.push("/locations");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-xl">
      <div>
        <label className="block text-sm font-medium">Code</label>
        <input className="mt-1 w-full border rounded p-2" value={code} onChange={(e) => setCode(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input className="mt-1 w-full border rounded p-2" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium">Type</label>
        <select className="mt-1 w-full border rounded p-2" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="STORAGE">STORAGE</option>
          <option value="RECEIVING">RECEIVING</option>
          <option value="SHIPPING">SHIPPING</option>
          <option value="PICKING">PICKING</option>
        </select>
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div className="flex gap-2">
        <button disabled={isPending} type="submit" className="px-3 py-2 rounded bg-black text-white disabled:opacity-50 dark:bg-white dark:text-black">
          {location ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
