"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";

export default function SiteHeader() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkAuth = () => {
    if (typeof window === "undefined") return;
    try {
      const storedUser = window.localStorage.getItem("user");
      if (!storedUser) {
        setIsLoggedIn(false);
        return;
      }
      try {
        const parsed = JSON.parse(storedUser);
        const valid = parsed && (parsed.id || parsed.email || parsed.username);
        setIsLoggedIn(valid);
      } catch {
        setIsLoggedIn(false);
      }
    } catch {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkAuth();
    // Check auth when menu opens
    if (isMenuOpen) {
      checkAuth();
    }
  }, [isMenuOpen]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("user");
      window.localStorage.removeItem("userId");
      window.localStorage.removeItem("userEmail");
      window.localStorage.removeItem("username");
      window.localStorage.removeItem("savedSpaces");
    }
    setIsLoggedIn(false);
    setIsMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="bg-[#c8d5b9] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-[#b5c3a6] sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-[#1f1f1f]">
          Thyrd Spaces
        </h1>
      </div>
      
      <button 
        className="text-[#1f1f1f] p-2 rounded-lg hover:bg-[#b5c3a6] transition-colors"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth=""
        >
          <path d="M3 7h18M3 12h18M3 17h18"/>
        </svg>
      </button>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-[#c8d5b9] z-50 w-full h-full">
          <div className="flex items-center justify-between p-4 border-b border-[#b5c3a6]">
            <h2 className="text-lg font-semibold text-[#1f1f1f]">Menu</h2>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="text-[#1f1f1f] p-2 rounded-lg hover:bg-[#b5c3a6]"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="p-6 space-y-6">
            <Link 
            href="/" 
            className="block text-lg font-medium text-[#1f1f1f] py-3 px-4 rounded-lg hover:bg-[#b5c3a6] transition-colors"
            onClick={() => setIsMenuOpen(false)}
            >
            Home
            </Link>
            <Link
              href="/about"
              className="block text-lg font-medium text-[#1f1f1f] py-3 px-4 rounded-lg hover:bg-[#b5c3a6] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/view-profile" 
              className="block text-lg font-medium text-[#1f1f1f] py-3 px-4 rounded-lg hover:bg-[#b5c3a6] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
            
            <div className="border-t border-[#b5c3a6] my-4"></div>
            
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="block w-full text-lg font-bold text-[#1f1f1f] py-3 px-4 rounded-lg bg-[#b5c3a6] hover:bg-[#a8b89a] text-center transition-colors"
              >
                Log out
              </button>
            ) : (
              <Link 
                href="/login" 
                className="block text-lg font-bold text-[#1f1f1f] py-3 px-4 rounded-lg bg-[#b5c3a6] hover:bg-[#a8b89a] text-center transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Log in!
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}