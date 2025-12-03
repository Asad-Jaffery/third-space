"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export default function ViewProfile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("savedSpaces");
  const [currentPage, setCurrentPage] = useState(1);
  const [savedSpaces, setSavedSpaces] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const userReviews = [
    {
      id: 1,
      spaceName: "Volunteer Park",
      title: "Great Trails!",
      text: "i love how the trails are nicely paved; they really minimize the chance for me to trip and fall",
      date: "11/19/2025",
      rating: 5,
    },
    {
      id: 2,
      spaceName: "Green Lake Park",
      title: "Beautiful Views",
      text: "Perfect spot for a peaceful walk around the lake",
      date: "11/15/2025",
      rating: 4,
    },
  ];

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const rawUser = window.localStorage.getItem("user");
      if (!rawUser) {
        router.push("/"); // send to auth landing
        return;
      }
      const parsedUser = JSON.parse(rawUser);
      if (!parsedUser || (!parsedUser.username && !parsedUser.email)) {
        window.localStorage.removeItem("user");
        router.push("/");
        return;
      }
      setUserData({
        username: parsedUser.username || "User",
        email: parsedUser.email || "Unknown",
        joinDate: "Member",
      });

      const rawSaved = window.localStorage.getItem("savedSpaces");
      if (rawSaved) {
        const parsedSaved = JSON.parse(rawSaved);
        setSavedSpaces(Array.isArray(parsedSaved) ? parsedSaved : []);
      }
    } catch {
      router.push("/");
    } finally {
      setIsReady(true);
    }
  }, [router]);

  const removeSaved = (id) => {
    const updated = savedSpaces.filter((s) => s.id !== id);
    setSavedSpaces(updated);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("savedSpaces", JSON.stringify(updated));
    }
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#3a3a3a] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#3a3a3a]">
      <SiteHeader />

      <main className="bg-white max-w-5xl mx-auto min-h-screen">
        <div className="bg-[#d4d4d4] px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-6">
            <div className="min-w-0">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#2d2d2d] mb-2 truncate">
                {userData?.username}
              </h2>
              <p className="text-sm text-[#4a4a4a] truncate">
                {userData?.email} • {userData?.joinDate}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-[#a8b89a] flex items-center justify-center">
                <svg className="w-8 h-8 sm:w-12 sm:h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              className="w-full sm:w-auto px-5 sm:px-6 py-2 sm:py-3 bg-[#2d2d2d] text-white rounded hover:bg-[#1a1a1a]"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.localStorage.removeItem("user");
                  window.localStorage.removeItem("userId");
                  window.localStorage.removeItem("userEmail");
                  window.localStorage.removeItem("username");
                  window.localStorage.removeItem("savedSpaces");
                }
                router.push("/");
              }}
            >
              Log Out
            </button>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-200 text-center">
          <div>
            <p className="text-3xl font-bold text-[#2d2d2d]">{savedSpaces.length}</p>
            <p className="text-sm text-[#6a6a6a]">Saved Spaces</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#2d2d2d]">{userReviews.length}</p>
            <p className="text-sm text-[#6a6a6a]">Reviews</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#2d2d2d]">0</p>
            <p className="text-sm text-[#6a6a6a]">Reflections</p>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-2 border-b border-gray-200">
          <button 
            onClick={() => setActiveTab("savedSpaces")}
            className={`w-full sm:w-auto px-6 py-2 rounded font-medium ${
              activeTab === "savedSpaces" 
                ? "bg-[#e0e0e0] text-[#2d2d2d]" 
                : "bg-white text-[#6a6a6a] border border-gray-300"
            }`}
          >
            Saved Spaces
          </button>
          <button 
            onClick={() => setActiveTab("reviews")}
            className={`w-full sm:w-auto px-6 py-2 rounded font-medium ${
              activeTab === "reviews" 
                ? "bg-[#e0e0e0] text-[#2d2d2d]" 
                : "bg-white text-[#6a6a6a] border border-gray-300"
            }`}
          >
            My Reviews
          </button>
          <button 
            onClick={() => setActiveTab("reflections")}
            className={`w-full sm:w-auto px-6 py-2 rounded font-medium ${
              activeTab === "reflections" 
                ? "bg-[#e0e0e0] text-[#2d2d2d]" 
                : "bg-white text-[#6a6a6a] border border-gray-300"
            }`}
          >
            My Reflections
          </button>
        </div>

        <div className="px-4 sm:px-6 py-6">
          {activeTab === "savedSpaces" && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-[#2d2d2d] mb-4">Saved Third Spaces</h3>
              {savedSpaces.length === 0 ? (
                <div className="text-sm text-[#6a6a6a]">No saved spaces yet.</div>
              ) : (
                savedSpaces.map((space) => (
                  <div key={space.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-xl font-bold text-[#2d2d2d]">{space.name}</h4>
                      <button
                        className="text-red-500"
                        aria-label="Remove from favorites"
                        onClick={() => removeSaved(space.id)}
                      >
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-sm text-[#4a4a4a] mb-3 leading-relaxed">{space.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {(space.tags || []).map((tag, idx) => (
                        <span
                          key={tag}
                          className={`px-3 py-1 rounded-full text-xs border ${
                            idx % 2 === 0
                              ? "bg-[#f5e6e6] text-[#6b4444] border-[#6b4444]"
                              : "bg-[#e6f5e6] text-[#446b44] border-[#446b44]"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-[#2d2d2d] mb-4">My Reviews</h3>
              {userReviews.map((review) => (
                <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm text-[#6a6a6a] mb-1">{review.spaceName}</p>
                      <h4 className="text-lg font-bold text-[#2d2d2d]">{review.title}</h4>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg 
                          key={star} 
                          className={`w-4 h-4 ${star <= review.rating ? "text-[#2d2d2d]" : "text-gray-300"}`} 
                          viewBox="0 0 24 24" 
                          fill={star <= review.rating ? "currentColor" : "none"}
                          stroke="currentColor" 
                          strokeWidth="2"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-[#4a4a4a] mb-3 leading-relaxed">{review.text}</p>
                  <p className="text-xs text-[#6a6a6a]">{review.date}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "reflections" && (
            <div className="text-center py-12">
              <p className="text-lg text-[#6a6a6a]">No reflections yet</p>
              <p className="text-sm text-[#6a6a6a] mt-2">Start reflecting on your third space experiences!</p>
            </div>
          )}
        </div>

        <div className="px-4 sm:px-6 py-6 flex items-center justify-center gap-2 border-t border-gray-200">
          <button 
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            Previous
          </button>
          <button className="w-10 h-10 flex items-center justify-center bg-[#2d2d2d] text-white rounded">
            {currentPage}
          </button>
          <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-50">
            2
          </button>
          <span>...</span>
          <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-50">
            5
          </button>
          <button 
            onClick={() => setCurrentPage(Math.min(5, currentPage + 1))}
            className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </main>
      
      <SiteFooter/>
    </div>
    );
}
