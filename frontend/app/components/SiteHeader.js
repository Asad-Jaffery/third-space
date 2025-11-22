"use client";

export default function SiteHeader() {
  return (
    <header className="bg-[#c8d5b9] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-[#b5c3a6]">
      <div className="flex items-center gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-[#1f1f1f]">
          Thyrd Spaces
        </h1>
      </div>
      <button className="text-[#1f1f1f]">
        <svg
          className="w-7 h-7"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 7h18M3 12h18M3 17h18" />
        </svg>
      </button>
    </header>
  );
}
