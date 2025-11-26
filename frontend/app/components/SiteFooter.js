"use client";

import { useRouter } from "next/navigation";

export default function SiteFooter() {
  const router = useRouter();

  return (
    <footer className="bg-[#2d2d2d] text-white sticky bottom-0 z-40">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-6 text-sm">
            <a
              href="/pages/Home"
              onClick={(e) => {
                e.preventDefault();
                router.push("/pages");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  router.push("/pages");
                }
              }}
              className="hover:underline"
            >
              Home
            </a>
            <span>|</span>
            <a href="#" className="hover:underline">
              About
            </a>
            <span>|</span>
            <a href="#" className="hover:underline">
              Profile
            </a>
          </div>
          <div className="text-center md:text-right text-sm">
            <p className="font-bold">Thyrd Spaces</p>
            <p className="text-gray-400">copyright 2025</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
