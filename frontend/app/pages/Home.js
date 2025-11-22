"use client";

import { useEffect, useState } from "react";

const getApiBase = () => {
  const raw =
    (process.env.NEXT_PUBLIC_API_URL || "").trim() ||
    "https://third-space.onrender.com";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  // if user sets domain without protocol, default to https
  return `https://${raw.replace(/^\/+/, "")}`;
};

export default function ThyrdSpacesHome() {
  const API_BASE = getApiBase();
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

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

  const tagOptions = ["park", "views", "altar", "library", "community center", "garden"];

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

  const mockResults = [
    {
      id: 1,
      name: "Volunteer Park",
      description: "This park is lovely, open to the public...",
      category: "park",
      views: 1234,
    },
    {
      id: 2,
      name: "Altar at Udistrict",
      description: "Cozy neighborhood Altar with great vibes...",
      category: "Altar",
      views: 892,
    },
    {
      id: 3,
      name: "Capitol Hill Library",
      description: "Community library with study spaces...",
      category: "library",
      views: 567,
    },
    {
      id: 4,
      name: "Green Lake Park",
      description: "Beautiful lakeside park for walking...",
      category: "park",
      views: 2341,
    },
  ];

  const handleSearch = () => {
    console.log("Searching for:", keyword, category);
  };

  return (
    <div className="min-h-screen bg-[#3a3a3a]">
      {/* Header */}
      <header className="bg-[#c8d5b9] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-[#2d2d2d]">
            Thyrd Spaces
          </h1>
        </div>
        <button className="text-[#2d2d2d]">
          <svg
            className="w-8 h-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className="bg-white max-w-md mx-auto min-h-screen px-4 pt-5 shadow-sm">
        {/* intro Section */}
        <div className="bg-[#d4d4d4] px-4 sm:px-5 py-6 sm:py-8 text-center rounded-lg shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2d2d2d] mb-2 sm:mb-3 leading-tight">
            Welcome to Thyrd Spaces
          </h2>
          <p className="text-sm sm:text-base text-[#4a4a4a] mb-4 sm:mb-5 leading-relaxed">
            Thyrd spaces is a website that facilitates community-spread findings
            of third spaces!
            <br />
            Come explore third places in Seattle and read more about our
            initiative!
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3">
            <button className="w-full sm:w-auto px-5 py-2.5 bg-[#2d2d2d] text-white rounded-md text-sm sm:text-base">
              About Thyrd Spaces
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto px-5 py-2.5 bg-white text-[#2d2d2d] rounded-md border border-[#2d2d2d] transition-colors duration-150 hover:bg-[#1f2a1f] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1f2a1f] text-sm sm:text-base"
            >
              Add a Third Space
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="px-0 py-6">
          <h3 className="text-xl sm:text-2xl font-bold text-[#2d2d2d] mb-4">
            Search for Third Spaces
          </h3>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#2d2d2d] mb-2">
                  Keyword
                </label>
                <input
                  type="text"
                  placeholder="Value"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#2d2d2d] mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-white"
                >
                  <option value="">Description Value</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat.toLowerCase()}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleSearch}
              className="px-8 py-2 bg-[#2d2d2d] text-white rounded-md"
            >
              Search
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className="px-0 py-6">
          <h3 className="text-xl sm:text-2xl font-bold text-[#2d2d2d] mb-4">
            Search Results
          </h3>

          <div className="space-y-4">
            {mockResults.map((result) => (
              <div
                key={result.id}
                className="bg-white border border-gray-200 rounded-md p-4 shadow-sm"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-xl font-bold text-[#2d2d2d]">
                    {result.name}
                  </h4>
                  <span className="px-3 py-1 bg-[#f5e6e6] text-[#6b4444] rounded-md text-sm border border-[#6b4444]">
                    {result.category}
                  </span>
                </div>
                <p className="text-sm text-[#4a4a4a] mb-3 leading-relaxed">
                  {result.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-[#6a6a6a]">
                  <span>{result.views} views</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="py-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md"
            >
              Previous
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-[#2d2d2d] text-white rounded-md">
              {currentPage}
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-md">
              2
            </button>
            <span>...</span>
            <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-md">
              68
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(68, currentPage + 1))}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md"
            >
              Next
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#2d2d2d] text-white">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:underline">
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
            className="relative z-10 w-[92%] max-w-md rounded-lg bg-white shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* header */}
            <div className="bg-[#e0e0e0] px-5 py-4 flex items-start justify-between">
              <h2 className="text-2xl font-extrabold text-[#111] leading-snug">
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

            <form onSubmit={handleSubmitThirdSpace} className="p-5 space-y-4">
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
