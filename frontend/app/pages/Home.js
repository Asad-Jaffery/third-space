"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
// love this addition ^

const getApiBase = () => {
  const raw =
    (process.env.NEXT_PUBLIC_API_URL || "").trim() ||
    "https://third-space.onrender.com";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  // if user sets domain without protocol, default to https
  return `https://${raw.replace(/^\/+/, "")}`;
};

export default function ThyrdSpacesHome() {
  const router = useRouter();
  const API_BASE = getApiBase();
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const isSupabase = API_BASE.includes("supabase.co");
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [loginPrompt, setLoginPrompt] = useState(false);
  const [spaces, setSpaces] = useState([]);
  const [filteredSpaces, setFilteredSpaces] = useState([]);
  const [searchActive, setSearchActive] = useState(false);
  const [isLoadingSpaces, setIsLoadingSpaces] = useState(true);
  const [spacesError, setSpacesError] = useState("");
  const [savedSpaces, setSavedSpaces] = useState([]);

  // Wake backend to avoid first-request cold start
  useEffect(() => {
    const wakeServer = async () => {
      try {
        await fetch(`${API_BASE}/`, { method: "GET" });
      } catch {
        // ignore; this is just a warm-up call
      }
    };
    wakeServer();
  }, [API_BASE]);

  // Load saved spaces from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("savedSpaces");
      if (raw) {
        const parsed = JSON.parse(raw);
        setSavedSpaces(Array.isArray(parsed) ? parsed : []);
      }
    } catch {
      // ignore
    }
  }, []);

  const categories = [
    "All",
    "Park",
    "Altar",
    "Library",
    "Community Center",
    "Garden",
  ];

  // ---- modal state + form state ----
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formTags, setFormTags] = useState([]);
  const [formDesc, setFormDesc] = useState("");
  const [formPhoto, setFormPhoto] = useState(null);
  const [formAlt, setFormAlt] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [tagSelect, setTagSelect] = useState("");
  const PAGE_SIZE = 3;

  const tagOptions = ["park", "views", "altar", "library", "community center", "garden"];

  const normalizeSpace = (space) => ({
    id: space.id,
    name: space.name,
    description: space.description,
    tags: Array.isArray(space.tags)
      ? space.tags
      : String(space.tags || "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
    image: space.photo_url || "",
    location: space.location_data || "",
  });

  const getListRequest = () => {
    if (!isSupabase) {
      return {
        url: `${API_BASE}/third_space/`,
        options: {},
        parse: (payload) => (payload.spaces || []).map(normalizeSpace),
      };
    }
    if (!SUPABASE_KEY) {
      throw new Error("Supabase anon key missing (NEXT_PUBLIC_SUPABASE_ANON_KEY)");
    }
    return {
      url: `${API_BASE}/rest/v1/spaces?select=*`,
      options: {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
        },
      },
      parse: (payload) => (Array.isArray(payload) ? payload.map(normalizeSpace) : []),
    };
  };

  // If user clears search fields, immediately show all spaces again.
  useEffect(() => {
    if (!keyword.trim() && !category.trim()) {
      setFilteredSpaces(spaces);
      setSearchActive(false);
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, category, spaces]);

  const fetchSpaces = useCallback(async () => {
    setSpacesError("");
    setIsLoadingSpaces(true);
    try {
      const { url, options, parse } = getListRequest();
      const res = await fetch(url, options);
      if (!res.ok) {
        // If backend hasn't been updated/deployed yet, we'll surface a clear message.
        if (res.status === 404) {
          setSpaces([]);
          setFilteredSpaces([]);
          setSpacesError(
            "Spaces endpoint not found on the API. Please run the backend locally with the latest code or deploy the updated backend."
          );
          return;
        }
        const errText = await res.text();
        throw new Error(errText || `Request failed with ${res.status}`);
      }
      const data = await res.json();
      const parsed = parse(data);
      setSpaces(parsed);
      setFilteredSpaces(parsed);
      setSearchActive(false);
      setCurrentPage(1);
    } catch (err) {
      console.error("Fetch spaces failed:", err);
      setSpacesError(
        err?.message?.includes("Failed to fetch")
          ? "Could not load spaces (network/server issue). Please retry."
          : err.message || "Unable to load spaces right now."
      );
    } finally {
      setIsLoadingSpaces(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces]);

  const totalPages = Math.max(1, Math.ceil(filteredSpaces.length / PAGE_SIZE));

  const addTag = (tag) => {
    if (!tag) return;
    if (formTags.includes(tag)) return;
    setFormTags((prev) => [...prev, tag]);
  };

  const removeTag = (tag) => {
    setFormTags((prev) => prev.filter((t) => t !== tag));
  };

  const resetForm = () => {
    setFormName("");
    setFormTags([]);
    setFormDesc("");
    setFormPhoto(null);
    setFormAlt("");
    setFormLocation("");
    setTagSelect("");
  };

  const handleSubmitThirdSpace = (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");
    setIsSubmitting(true);

    const fileToBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

    const submit = async () => {
      try {
        const photoString = formPhoto ? await fileToBase64(formPhoto) : "";

        const payload = {
          name: formName.trim(),
          description: formDesc.trim(),
          tags: formTags.join(", "),
          photo_url: photoString,
          location_data: formLocation.trim(),
        };

        let newSpace = null;

        if (isSupabase) {
          if (!SUPABASE_KEY) {
            throw new Error("Supabase anon key missing (NEXT_PUBLIC_SUPABASE_ANON_KEY)");
          }
          const res = await fetch(`${API_BASE}/rest/v1/spaces`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
              Prefer: "return=representation",
            },
            body: JSON.stringify([payload]),
          });
          if (!res.ok) {
            const errText = await res.text();
            throw new Error(errText || `Request failed with ${res.status}`);
          }
          const data = await res.json();
          newSpace = normalizeSpace((data || [])[0] || payload);
        } else {
          const res = await fetch(`${API_BASE}/third_space/new`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            mode: "cors",
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            const errText = await res.text();
            throw new Error(errText || `Request failed with ${res.status}`);
          }

          const data = await res.json();
          const createdId = data?.id;
          newSpace = normalizeSpace({
            id: createdId,
            ...payload,
          });
        }

        if (newSpace) {
          setSpaces((prev) => [newSpace, ...prev]);
          // Respect current filter state
          if (searchActive) {
            const matchesKeyword =
              keyword.trim() === "" ||
              newSpace.name.toLowerCase().includes(keyword.trim().toLowerCase()) ||
              newSpace.description.toLowerCase().includes(keyword.trim().toLowerCase());
            const matchesCategory =
              !category ||
              category === "all" ||
              (newSpace.tags || []).some((t) => t.toLowerCase() === category.toLowerCase());
            if (matchesKeyword && matchesCategory) {
              setFilteredSpaces((prev) => [newSpace, ...prev]);
            }
          } else {
            setFilteredSpaces((prev) => [newSpace, ...prev]);
          }
        }
        setSubmitSuccess("Space saved!");
        resetForm();
        setIsModalOpen(false);
      } catch (err) {
        console.error("Submit third space failed:", err);
        setSubmitError(
          err?.message?.includes("Failed to fetch")
            ? "Could not reach the server. Please retry in a moment (Render may be waking)."
            : err.message || "Something went wrong while saving."
        );
      } finally {
        setIsSubmitting(false);
      }
    };

    submit();
  };

  const handleSearch = () => {
    const trimmedKeyword = keyword.trim().toLowerCase();
    const trimmedCategory = category.trim().toLowerCase();
    const hasQuery = Boolean(trimmedKeyword || trimmedCategory);

    if (!hasQuery) {
      setFilteredSpaces(spaces);
      setSearchActive(false);
      setCurrentPage(1);
      return;
    }

    const matches = spaces.filter((space) => {
      const nameMatch = space.name?.toLowerCase().includes(trimmedKeyword);
      const descMatch = space.description?.toLowerCase().includes(trimmedKeyword);
      const tagMatch = (space.tags || []).some((t) => t.toLowerCase().includes(trimmedKeyword));
      const keywordOk = !trimmedKeyword || nameMatch || descMatch || tagMatch;

      const categoryOk =
        !trimmedCategory ||
        trimmedCategory === "all" ||
        (space.tags || []).some((t) => t.toLowerCase() === trimmedCategory);

      return keywordOk && categoryOk;
    });

    setFilteredSpaces(matches);
    setSearchActive(true);
    setCurrentPage(1);
  };

  const toggleSaveSpace = (space) => {
    const exists = savedSpaces.some((s) => s.id === space.id);
    const updated = exists
      ? savedSpaces.filter((s) => s.id !== space.id)
      : [...savedSpaces, space];
    setSavedSpaces(updated);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("savedSpaces", JSON.stringify(updated));
    }
  };

  return (
    <div className="min-h-screen bg-[#1f1f1f]">
      <SiteHeader />

      {/* Main Content */}
      <main className="bg-white max-w-md mx-auto min-h-screen px-4 pt-16 pb-24 shadow-sm border border-gray-200">
        {/* intro Section */}
        <div className="bg-[#d4d4d4] px-4 sm:px-5 py-6 sm:py-8 text-center rounded-lg shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1f1f1f] mb-2 sm:mb-3 leading-tight">
            Welcome to Thyrd Spaces
          </h1>

          <p className="text-sm sm:text-base text-[#2f2f2f] mb-4 sm:mb-5 leading-relaxed">
            Thyrd spaces is a website that facilitates community-spread findings
            of third spaces!
            <br />
            Come explore third places in Seattle and read more about our
            initiative!
          </p>
          <div className="flex justify-center">
            <button className="w-full sm:w-auto px-6 py-3 bg-[#2d2d2d] text-white rounded-md text-sm sm:text-base">
              About Thyrd Spaces
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="px-0 py-6 bg-[#d4d4d4] mt-4 rounded-lg shadow-sm">
          <h3 className="text-xl sm:text-2xl font-bold text-[#2d2d2d] mb-4 px-4">
            Search for Third Spaces
          </h3>

          <div className="space-y-4 px-4 pb-4">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-bold text-[#2d2d2d] mb-2">
                  Keyword
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Value"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded bg-white pr-10"
                  />
                  <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                    🔍
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#2d2d2d] mb-2">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded bg-white appearance-none pr-8"
                  >
                    <option value="">Value</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat.toLowerCase()}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 pointer-events-none">
                    ▾
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleSearch}
                className="px-8 py-2 bg-[#2d2d2d] text-white rounded-md w-40"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="px-0 py-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl sm:text-2xl font-bold text-[#2d2d2d]">
              Search Results
            </h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-white border border-[#2d2d2d] text-[#2d2d2d] rounded-md text-sm shadow-sm flex items-center gap-2"
            >
              Add a Third Space <span className="text-lg leading-none">+</span>
            </button>
          </div>

          <div className="space-y-4">
            {isLoadingSpaces ? (
              <div className="text-sm text-[#4a4a4a]">Loading spaces...</div>
            ) : spacesError ? (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
                {spacesError}
              </div>
            ) : filteredSpaces.length === 0 ? (
              <div className="text-sm text-[#4a4a4a]">
                {searchActive
                  ? "No spaces match your search yet."
                  : "No spaces yet. Add the first one!"}
              </div>
            ) : (
              filteredSpaces
                .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
                .map((result) => (
                  <div
                    key={result.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => router.push(`/space-details?id=${result.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        router.push(`/space-details?id=${result.id}`);
                      }
                    }}
                    className="bg-white border border-gray-200 rounded-md p-3 shadow-sm cursor-pointer transition-transform transition-shadow duration-150 hover:-translate-y-[2px] hover:shadow-md"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-lg font-bold text-[#2d2d2d]">
                          {result.name}
                        </h4>
                        <p className="text-sm text-[#4a4a4a] truncate max-w-[180px]">
                          {result.description}
                        </p>
                      </div>
                      <button
                        className={`text-[#2d2d2d] ${savedSpaces.some((s) => s.id === result.id) ? "text-red-600" : ""}`}
                        aria-label="Favorite"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveSpace(result);
                        }}
                      >
                        <svg
                          className="w-8 h-8"
                          viewBox="0 0 24 24"
                          fill={savedSpaces.some((s) => s.id === result.id) ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex gap-2 mb-2">
                      {(result.tags || []).map((tag, idx) => (
                        <span
                          key={`${result.id}-${tag}`}
                          className={`px-3 py-1 rounded-md text-xs border ${
                            idx % 2 === 0
                              ? "bg-[#f5e6e6] text-[#6b4444] border-[#6b4444]"
                              : "bg-[#e6f5e6] text-[#446b44] border-[#446b44]"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {result.image ? (
                      <div className="w-full h-36 bg-gray-200 rounded-md overflow-hidden">
                        <img
                          src={result.image}
                          alt={result.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : null}
                  </div>
                ))
            )}
          </div>

          {/* Pagination */}
          {filteredSpaces.length > PAGE_SIZE && (
            <div className="py-6 flex items-center justify-center gap-3 text-sm text-[#6a6a6a]">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="flex items-center gap-1 text-[#6a6a6a] disabled:text-gray-400"
                disabled={currentPage === 1}
              >
                ← <span>Previous</span>
              </button>
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 flex items-center justify-center bg-[#2d2d2d] text-white rounded-md">
                  {currentPage}
                </button>
                {currentPage + 1 <= totalPages && (
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="w-8 h-8 flex items-center justify-center text-[#2d2d2d] border border-transparent hover:border-gray-300 rounded"
                  >
                    {currentPage + 1}
                  </button>
                )}
                {currentPage + 2 < totalPages && <span>...</span>}
                {currentPage + 1 < totalPages && (
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="w-8 h-8 flex items-center justify-center text-[#2d2d2d] border border-transparent hover:border-gray-300 rounded"
                  >
                    {totalPages}
                  </button>
                )}
              </div>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="flex items-center gap-1 text-[#2d2d2d] disabled:text-gray-400"
                disabled={currentPage === totalPages}
              >
                <span>Next</span> →
              </button>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />

      {/* ---------- Modal ---------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsModalOpen(false)}
          />

          {/* modal box */}
          <div
            className="relative z-10 w-[92%] max-w-sm rounded-lg bg-white shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* header */}
            <div className="bg-[#e0e0e0] px-4 py-3 flex items-start justify-between">
              <h2 className="text-xl font-bold text-[#111] leading-snug">
                Add a Third Space
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-2xl text-[#111] leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitThirdSpace} className="p-4 space-y-3">
              <p className="text-sm text-[#111] font-medium">All fields required.</p>
              {submitError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                  {submitError}
                </p>
              )}
              {submitSuccess && (
                <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
                  {submitSuccess}
                </p>
              )}

              {/* Third Space Name */}
              <div>
                <label className="block text-sm font-semibold text-[#111] mb-1">
                  Third Space Name
                </label>
                <input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Value"
                  className="w-full border border-gray-400 rounded-md px-3 py-2 text-[#111] placeholder:text-gray-500 focus:border-[#1f2a1f] focus:ring-2 focus:ring-[#1f2a1f]/20"
                  required
                />
              </div>

              {/* Select Tags */}
              <div>
                <label className="block text-sm font-semibold text-[#111] mb-1">
                  Select Tags
                </label>
                <select
                  value={tagSelect}
                  onChange={(e) => {
                    setTagSelect(e.target.value);
                    addTag(e.target.value);
                  }}
                  className="w-full border border-gray-400 rounded-md px-3 py-2 bg-white text-[#111] placeholder:text-gray-500 focus:border-[#1f2a1f] focus:ring-2 focus:ring-[#1f2a1f]/20"
                  required={formTags.length === 0}
                >
                  <option value="">Value</option>
                  {tagOptions.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>

                {/* tag chips */}
                {formTags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formTags.map((t) => (
                      <span
                        key={t}
                        className="flex items-center gap-1 px-2 py-1 rounded-md border border-gray-400 text-xs bg-gray-100 text-[#111]"
                      >
                        {t}
                        <button
                          type="button"
                          onClick={() => removeTag(t)}
                          className="text-sm leading-none"
                          aria-label={`Remove ${t}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-[#111] mb-1">
                  Description of Third Space
                </label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Value"
                  className="w-full border border-gray-400 rounded-md px-3 py-2 min-h-[80px] text-[#111] placeholder:text-gray-500 focus:border-[#1f2a1f] focus:ring-2 focus:ring-[#1f2a1f]/20"
                  required
                />
              </div>

              {/* Upload Photo */}
              <div>
                <label className="block text-sm font-semibold text-[#111] mb-1">
                  Upload a Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormPhoto(e.target.files?.[0] ?? null)}
                  className="w-full border border-gray-400 rounded-md px-3 py-2 bg-white text-[#111] focus:border-[#1f2a1f] focus:ring-2 focus:ring-[#1f2a1f]/20"
                  required
                />
                {formPhoto && (
                  <p className="text-xs text-[#111] mt-1">
                    Selected: {formPhoto.name}
                  </p>
                )}
              </div>

              {/* Alt Text */}
              <div>
                <label className="block text-sm font-semibold text-[#111] mb-1">
                  Alt Text
                </label>
                <textarea
                  value={formAlt}
                  onChange={(e) => setFormAlt(e.target.value)}
                  placeholder="Describe the image under two short sentences."
                  className="w-full border border-gray-400 rounded-md px-3 py-2 min-h-[70px] text-[#111] placeholder:text-gray-500 focus:border-[#1f2a1f] focus:ring-2 focus:ring-[#1f2a1f]/20"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-[#111] mb-1">
                  Location (Google Link)
                </label>
                <input
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="Value"
                  className="w-full border border-gray-400 rounded-md px-3 py-2 text-[#111] placeholder:text-gray-500 focus:border-[#1f2a1f] focus:ring-2 focus:ring-[#1f2a1f]/20"
                  required
                />
              </div>

              {/* Add button */}
              <button
                type="submit"
                className="w-full mt-2 bg-[#1f2a1f] text-white font-semibold py-2.5 rounded-md disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Add"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
