"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Item = { id: string; sku: string; name: string };

type InventoryRow = { id: string; item: Item; location: { id: string; code: string }; quantity: number };

export function NewPickForm() {
  const [inventories, setInventories] = useState<InventoryRow[]>([]);
  const [reference, setReference] = useState("");
  const [lines, setLines] = useState<{ itemId: string; quantity: number }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/inventory")
      .then((r) => r.json())
      .then(setInventories)
      .catch(() => setInventories([]));
  }, []);

  function addLine() {
    setLines((prev) => [...prev, { itemId: inventories[0]?.item.id ?? "", quantity: 1 }]);
  }

  function updateLine(idx: number, patch: Partial<{ itemId: string; quantity: number }>) {
    setLines((prev) => prev.map((l, i) => (i === idx ? { ...l, ...patch } : l)));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/picks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference, lines }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.message ?? "Failed to create pick");
      return;
    }
    startTransition(() => {
      router.push("/picks");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-2xl">
      <div>
        <label className="block text-sm font-medium">Reference</label>
        <input className="mt-1 w-full border rounded p-2" value={reference} onChange={(e) => setReference(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Lines</h4>
          <button type="button" onClick={addLine} className="px-2 py-1 rounded border">Add line</button>
        </div>
        {lines.map((line, idx) => (
          <div key={idx} className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <select className="border rounded p-2" value={line.itemId} onChange={(e) => updateLine(idx, { itemId: e.target.value })}>
              {inventories.map((inv) => (
                <option key={inv.id} value={inv.item.id}>{inv.item.sku} - {inv.item.name}</option>
              ))}
            </select>
            <input type="number" min={1} className="border rounded p-2" value={line.quantity} onChange={(e) => updateLine(idx, { quantity: Number(e.target.value) })} />
          </div>
        ))}
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button disabled={isPending} type="submit" className="px-3 py-2 rounded bg-black text-white disabled:opacity-50 dark:bg-white dark:text-black">Create</button>
    </form>
  );
}
