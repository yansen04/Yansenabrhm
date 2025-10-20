import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WMS Lite",
  description: "A simple warehouse management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}> 
        <div className="min-h-screen grid grid-cols-[240px_1fr]">
          <aside className="border-r bg-gray-50 dark:bg-gray-900 p-4 space-y-2">
            <h1 className="text-xl font-semibold">WMS Lite</h1>
            <nav className="grid gap-2">
              <Link className="hover:underline" href="/">Dashboard</Link>
              <Link className="hover:underline" href="/items">Items</Link>
              <Link className="hover:underline" href="/locations">Locations</Link>
              <Link className="hover:underline" href="/inventory">Inventory</Link>
              <Link className="hover:underline" href="/receipts">Receipts</Link>
              <Link className="hover:underline" href="/picks">Picks</Link>
            </nav>
          </aside>
          <main className="p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
