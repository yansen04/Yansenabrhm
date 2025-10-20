export default function Home() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <Card title="Items" href="/items" desc="Kelola master item dan SKU" />
        <Card title="Locations" href="/locations" desc="Kelola lokasi gudang" />
        <Card title="Inventory" href="/inventory" desc="Lihat stok by lokasi" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Receipts" href="/receipts" desc="Penerimaan barang" />
        <Card title="Picks" href="/picks" desc="Pengambilan/pengeluaran" />
      </div>
    </div>
  );
}

function Card({ title, href, desc }: { title: string; href: string; desc: string }) {
  return (
    <a href={href} className="block border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900">
      <div className="text-lg font-medium">{title}</div>
      <div className="text-sm text-gray-600 dark:text-gray-300">{desc}</div>
    </a>
  );
}
