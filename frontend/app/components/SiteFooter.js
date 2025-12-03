"use client";

import Link from "next/link";

export default function SiteFooter() {

  return (
    <footer className="bg-[#2d2d2d] text-white sticky bottom-0 z-40">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-6 text-sm">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span>|</span>
            <Link href="/about" className="hover:underline">About</Link>
            <span>|</span>
            <Link href="/view-profile" className="hover:underline">
              Profile
            </Link>
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