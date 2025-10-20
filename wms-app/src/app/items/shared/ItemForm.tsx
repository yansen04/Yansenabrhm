"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function ItemForm({ item }: { item?: { id: string; sku: string; name: string; uom: string; description?: string | null } }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [sku, setSku] = useState(item?.sku ?? "");
  const [name, setName] = useState(item?.name ?? "");
  const [uom, setUom] = useState(item?.uom ?? "PCS");
  const [description, setDescription] = useState(item?.description ?? "");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const payload = { sku, name, uom, description };
    const res = await fetch(item ? `/api/items/${item.id}` : "/api/items", {
      method: item ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.message ?? "Failed to save item");
      return;
    }

    startTransition(() => {
      router.push("/items");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-xl">
      <div>
        <label className="block text-sm font-medium">SKU</label>
        <input className="mt-1 w-full border rounded p-2" value={sku} onChange={(e) => setSku(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input className="mt-1 w-full border rounded p-2" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium">UOM</label>
        <input className="mt-1 w-full border rounded p-2" value={uom} onChange={(e) => setUom(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea className="mt-1 w-full border rounded p-2" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div className="flex gap-2">
        <button disabled={isPending} type="submit" className="px-3 py-2 rounded bg-black text-white disabled:opacity-50 dark:bg-white dark:text-black">
          {item ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
