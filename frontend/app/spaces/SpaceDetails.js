"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

const getApiBase = () => {
  const raw =
    (process.env.NEXT_PUBLIC_API_URL || "").trim() ||
    "https://third-space.onrender.com";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  return `https://${raw.replace(/^\/+/, "")}`;
};

export default function SpaceDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const spaceId = searchParams.get('id');
  const API_BASE = getApiBase();
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const isSupabase = API_BASE.includes("supabase.co");
  
  const [activeTab, setActiveTab] = useState('reviews');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [spaceData, setSpaceData] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formTab, setFormTab] = useState('review'); // review | reflection
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [reflectionTitle, setReflectionTitle] = useState('');
  const [reflectionBody, setReflectionBody] = useState('');
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [localReviews, setLocalReviews] = useState([]);
  const [localReflections, setLocalReflections] = useState([]);

  const normalizeSpace = (raw) => ({
    id: raw.id,
    name: raw.name,
    description: raw.description,
    tags: Array.isArray(raw.tags)
      ? raw.tags
      : String(raw.tags || "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
    image: raw.photo_url || "",
    location: raw.location_data || "",
    reviews: raw.reviews || [],
  });

  const getDetailRequest = (id) => {
    if (!isSupabase) {
      return {
        url: `${API_BASE}/third_space/${id}`,
        options: {},
        parse: (payload) => payload.space || payload,
      };
    }
    if (!SUPABASE_KEY) {
      throw new Error("Supabase anon key missing (NEXT_PUBLIC_SUPABASE_ANON_KEY)");
    }
    return {
      url: `${API_BASE}/rest/v1/spaces?id=eq.${id}&select=*`,
      options: {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
        },
      },
      parse: (payload) => (Array.isArray(payload) ? payload[0] : null),
    };
  };

  useEffect(() => {
    if (!spaceId) {
      setError("No space selected.");
      setIsLoading(false);
      return;
    }

    const fetchSpace = async () => {
      setError("");
      setIsLoading(true);
      try {
        const { url, options, parse } = getDetailRequest(spaceId);
        const res = await fetch(url, options);
        if (!res.ok) {
          if (res.status === 404) {
            setError(
              "Space not found or the spaces endpoint is not available on the API. Please run the backend locally with the latest code or deploy the updated backend."
            );
            return;
          }
          const errText = await res.text();
          throw new Error(errText || `Request failed with ${res.status}`);
        }
        const data = await res.json();
        const raw = parse(data);
        setSpaceData(normalizeSpace(raw));

        // Load local reviews/reflections for this space
        const sid = parseInt(spaceId, 10);
        if (!Number.isNaN(sid) && typeof window !== "undefined") {
          try {
            const storedReviews = JSON.parse(window.localStorage.getItem("userReviews") || "[]");
            const storedReflections = JSON.parse(window.localStorage.getItem("userReflections") || "[]");
            setLocalReviews(storedReviews.filter((r) => r.spaceId === sid));
            setLocalReflections(storedReflections.filter((r) => r.spaceId === sid));
          } catch {
            setLocalReviews([]);
            setLocalReflections([]);
          }
        }
      } catch (err) {
        console.error("Load space failed:", err);
        setError(
          err?.message?.includes("Failed to fetch")
            ? "Could not load this space (network/server issue). Please retry."
            : err.message || "Unable to load this space right now."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpace();
  }, [spaceId, API_BASE]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#3a3a3a] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#3a3a3a] flex items-center justify-center px-4">
        <div className="bg-white max-w-sm w-full rounded-md border border-red-200 px-4 py-3 text-red-700 text-center">
          {error}
        </div>
      </div>
    );
  }

  if (!spaceData) {
    return (
      <div className="min-h-screen bg-[#3a3a3a] flex items-center justify-center">
        <div className="text-white text-xl">No data for this space.</div>
      </div>
    );
  }

  const nameParts = (spaceData.name || "").split(" ").filter(Boolean);
  const combinedReviews = [...(spaceData.reviews || []), ...localReviews];
  const validRatings = combinedReviews
    .map((r) => Number(r.rating))
    .filter((n) => Number.isFinite(n) && n > 0);
  const averageRating =
    validRatings.length > 0
      ? validRatings.reduce((sum, val) => sum + val, 0) / validRatings.length
      : 0;
  const clampedAverage = Math.min(5, Math.max(0, averageRating));

  return (
    <div className="min-h-screen bg-[#3a3a3a]">
      <SiteHeader />

      {/* Main Content */}
      <main className="bg-white max-w-md mx-auto min-h-screen pt-16 pb-24">
        <div className="px-4 py-3">
          <button
            onClick={() => router.back()}
            className="text-sm text-[#2d2d2d] underline hover:no-underline flex items-center gap-1"
          >
            <span>←</span> Back
          </button>
        </div>

        {/* Place Header */}
        <div className="bg-[#d4d4d4] px-6 py-3 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#2d2d2d]">
            {nameParts.map((word, index) => (
              <span key={`${word}-${index}`}>
                {word}
                {index < nameParts.length - 1 && <br />}
              </span>
            ))}
          </h2>
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className="text-[#2d2d2d]"
          >
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {/* Image */}
        <div className="w-full h-48 bg-gray-300">
          <img 
            src={spaceData.image} 
            alt={spaceData.altText || spaceData.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Tags */}
        <div className="px-6 py-4 flex gap-2">
          {spaceData.tags.map((tag, index) => (
            <span key={tag} className={`px-4 py-1 rounded-full text-sm border ${
              index % 2 === 0 
                ? 'bg-[#f5e6e6] text-[#6b4444] border-[#6b4444]' 
                : 'bg-[#e6f5e6] text-[#446b44] border-[#446b44]'
            }`}>
              {tag}
            </span>
          ))}
          <button
            className="ml-auto px-4 py-1 bg-[#2d2d2d] text-white rounded text-sm"
            onClick={() => {
              setIsFormOpen(true);
              setFormTab('review');
            }}
          >
            Review/Reflect
          </button>
        </div>

        {/* Description */}
        <div className="px-6 py-4">
          <h3 className="text-xl font-bold text-[#2d2d2d] mb-2">Description</h3>
          <p className="text-sm text-[#4a4a4a] leading-relaxed">
            {spaceData.description}
          </p>
        </div>

        {/* Directions */}
        <div className="px-6 py-4">
          <h3 className="text-xl font-bold text-[#2d2d2d] mb-2">Directions</h3>
          <a 
            href={spaceData.location} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-[#4a4a4a] underline"
          >
            {spaceData.name} Google Map
          </a>
        </div>

        {/* Ratings */}
        <div className="px-6 py-4">
          <h3 className="text-xl font-bold text-[#2d2d2d] mb-2">Ratings</h3>
          {validRatings.length === 0 ? (
            <div className="flex gap-1 text-[#2d2d2d]" aria-label="No ratings yet">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div
                className="flex gap-1 text-[#2d2d2d]"
                aria-label={`Average rating ${clampedAverage.toFixed(1)} out of 5`}
              >
                {[1, 2, 3, 4, 5].map((star) => {
                  const fillPercent = Math.max(
                    0,
                    Math.min(1, clampedAverage - (star - 1))
                  ) * 100;
                  return (
                    <div key={star} className="relative w-5 h-5">
                      <svg
                        className="absolute inset-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      <div
                        className="absolute inset-0 overflow-hidden"
                        style={{ width: `${fillPercent}%` }}
                      >
                        <svg
                          className="w-5 h-5 text-[#2d2d2d]"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="text-sm text-[#4a4a4a]">
                {clampedAverage.toFixed(1)} ({validRatings.length} rating
                {validRatings.length === 1 ? "" : "s"})
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="px-6 py-4 flex gap-2 border-b">
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded text-[#2d2d2d] font-medium ${activeTab === 'reviews' ? 'bg-[#e0e0e0]' : 'bg-white border'}`}
          >
            Reviews
          </button>
          <button 
            onClick={() => setActiveTab('reflections')}
            className={`px-4 py-2 rounded text-[#2d2d2d] font-medium ${activeTab === 'reflections' ? 'bg-[#e0e0e0]' : 'bg-white border'}`}
          >
            Reflections
          </button>
        </div>

        {/* Reviews / Reflections List */}
        {activeTab === 'reviews' ? (
          <div className="px-6 py-4 space-y-4">
            {([...localReviews, ...(spaceData.reviews || [])].length > 0) ? (
              [...localReviews, ...(spaceData.reviews || [])].map((review) => (
                <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-lg font-bold text-[#2d2d2d]">{review.title}</h4>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg 
                          key={star} 
                          className={`w-4 h-4 ${star <= review.rating ? 'text-[#2d2d2d] fill-current' : 'text-[#2d2d2d]'}`} 
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
                  <div className="flex items-center gap-2 text-sm text-[#6a6a6a] bg-[#e8e8e8] px-3 py-2 rounded">
                    <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="3" y="6" width="18" height="15" rx="2" />
                      <path d="M7 3v3M17 3v3" stroke="white" strokeWidth="2" />
                    </svg>
                    <span>{review.date || ""} - {review.author || "Anonymous"}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-[#6a6a6a]">No reviews yet. Be the first to review this space!</p>
              </div>
            )}
          </div>
        ) : (
          <div className="px-6 py-4 space-y-4">
            {localReflections.length > 0 ? (
              localReflections.map((reflection) => (
                <div key={reflection.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-lg font-bold text-[#2d2d2d]">{reflection.title}</h4>
                  </div>
                  <p className="text-sm text-[#4a4a4a] mb-3 leading-relaxed">{reflection.text}</p>
                  <div className="flex items-center gap-2 text-sm text-[#6a6a6a] bg-[#e8e8e8] px-3 py-2 rounded">
                    <svg className="w-4 h-4 text-[#2d2d2d]" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    <span>{reflection.date || ""} - {reflection.author || "Anonymous"}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-[#6a6a6a]">No reflections yet. Be the first to reflect on this space!</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-6 flex items-center justify-center gap-2">
          <button 
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            className="w-8 h-8 flex items-center justify-center"
          >
            &lt;
          </button>
          <button className="w-8 h-8 flex items-center justify-center bg-[#2d2d2d] text-white rounded">
            {currentPage}
          </button>
          <span>...</span>
          <button className="w-8 h-8 flex items-center justify-center">
            68
          </button>
          <button 
            onClick={() => setCurrentPage(Math.min(68, currentPage + 1))}
            className="w-8 h-8 flex items-center justify-center"
          >
            &gt;
          </button>
        </div>
      </main>

      <SiteFooter />

      {/* Review/Reflection Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsFormOpen(false)}
          />
          <div
            className="relative z-10 w-[92%] max-w-sm bg-white rounded-lg shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#cdd2c5] px-4 py-3 flex items-start justify-between">
              <h2 className="text-lg font-bold text-[#111] leading-snug">
                Add a Review or Rating
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-2xl text-[#111] leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form
              className="p-4 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                setFormError("");

                if (typeof window === "undefined") return;
                const rawUser = window.localStorage.getItem("user");
                if (!rawUser) {
                  setFormError("Please log in to submit a review or reflection.");
                  return;
                }
                let userObj = null;
                try {
                  userObj = JSON.parse(rawUser);
                } catch {
                  setFormError("Please log in to submit a review or reflection.");
                  return;
                }

                const author = userObj?.username || userObj?.email || "You";
                const dateStr = new Date().toLocaleDateString();
                const sid = parseInt(spaceId, 10);

                const spaceName = spaceData?.name || "";

                if (formTab === 'review') {
                  const newReview = {
                    id: Date.now(),
                    title: reviewTitle,
                    text: reviewBody,
                    rating,
                    author,
                    date: dateStr,
                    spaceId: sid,
                    spaceName,
                  };
                  setLocalReviews((prev) => [newReview, ...prev]);
                  try {
                    const stored = JSON.parse(window.localStorage.getItem("userReviews") || "[]");
                    const updated = [newReview, ...stored];
                    window.localStorage.setItem("userReviews", JSON.stringify(updated));
                  } catch {
                    window.localStorage.setItem("userReviews", JSON.stringify([newReview]));
                  }
                } else {
                  const newReflection = {
                    id: Date.now(),
                    title: reflectionTitle,
                    text: reflectionBody,
                    author,
                    date: dateStr,
                    spaceId: sid,
                    spaceName,
                  };
                  setLocalReflections((prev) => [newReflection, ...prev]);
                  try {
                    const stored = JSON.parse(window.localStorage.getItem("userReflections") || "[]");
                    const updated = [newReflection, ...stored];
                    window.localStorage.setItem("userReflections", JSON.stringify(updated));
                  } catch {
                    window.localStorage.setItem("userReflections", JSON.stringify([newReflection]));
                  }
                }

                setIsFormOpen(false);
                setReviewTitle('');
                setReviewBody('');
                setReflectionTitle('');
                setReflectionBody('');
                setRating(0);
              }}
            >
              <p className="text-sm text-[#111] font-medium">All fields required.</p>
              {formError && (
                <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
                  {formError}
                </div>
              )}

              {/* Tabs */}
              <div className="flex gap-4 border border-gray-200 rounded-md px-3 py-2">
                <button
                  type="button"
                  onClick={() => setFormTab('review')}
                  className={`pb-1 text-sm font-semibold ${
                    formTab === 'review'
                      ? 'border-b-2 border-[#1f2a1f] text-[#1f2a1f]'
                      : 'text-gray-500'
                  }`}
                >
                  Review
                </button>
                <button
                  type="button"
                  onClick={() => setFormTab('reflection')}
                  className={`pb-1 text-sm font-semibold ${
                    formTab === 'reflection'
                      ? 'border-b-2 border-[#1f2a1f] text-[#1f2a1f]'
                      : 'text-gray-500'
                  }`}
                >
                  Reflection
                </button>
              </div>

              {formTab === 'review' ? (
                <div className="space-y-3 border border-gray-200 rounded-md p-3">
                  <div>
                    <label className="block text-sm font-semibold text-[#111] mb-1">
                      Review Title
                    </label>
                    <input
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="Value"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#111] mb-1">
                      Rate the Third Space out of 5 Stars
                    </label>
                    <div className="flex gap-2 text-lg text-[#1f2a1f]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          className={`focus:outline-none ${rating >= star ? 'text-[#1f2a1f]' : 'text-gray-400'}`}
                          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#111] mb-1">
                      Description of Review
                    </label>
                    <textarea
                      value={reviewBody}
                      onChange={(e) => setReviewBody(e.target.value)}
                      placeholder="Value"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm min-h-[100px]"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 border border-gray-200 rounded-md p-3">
                  <div>
                    <label className="block text-sm font-semibold text-[#111] mb-1">
                      Reflection Title
                    </label>
                    <input
                      value={reflectionTitle}
                      onChange={(e) => setReflectionTitle(e.target.value)}
                      placeholder="Value"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#111] mb-1">
                      Reflection (write about the fun memories created here!)
                    </label>
                    <textarea
                      value={reflectionBody}
                      onChange={(e) => setReflectionBody(e.target.value)}
                      placeholder="Value"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm min-h-[120px]"
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-1 bg-[#1f2a1f] text-white font-semibold py-2.5 rounded-md"
              >
                Add
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
