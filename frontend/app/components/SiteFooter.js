"use client";

import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-6 text-sm">
            <Link href="/pages/Home" className="hover:underline">Home</Link>
            <span>|</span>
            <Link href="/" className="hover:underline">About</Link>
            <span>|</span>
            <Link href="/pages/ViewProfileStatic" className="hover:underline">Profile</Link>
          </div>
          <div className="text-sm text-muted-foreground">
            <p className="font-bold">Thyrd Spaces</p>
            <p className="text-gray-400">© copyright 2025</p>
          </div>
        </div>
      </div>
    </footer>
  );
}