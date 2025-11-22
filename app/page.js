import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#3a3a3a]">
      {/* Header */}
      <header className="bg-[#c8d5b9] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-[#2d2d2d]">Thyrd Spaces</h1>
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </div>
        <button className="text-[#2d2d2d]">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className="bg-white max-w-md mx-auto min-h-screen">
        <div className="px-6 py-6 text-center">
          <h2 className="text-3xl font-bold text-[#2d2d2d] mb-4">Welcome to Thyrd Spaces</h2>
          <p className="text-lg text-[#4a4a4a] mb-8 leading-relaxed">
            Discover and explore third places in your community.
          </p>
          
          <Link href="/spaces/volunteer-park">
            <button className="bg-[#c8d5b9] text-[#2d2d2d] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#b8c5a9] transition-colors">
              View Volunteer Park
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
