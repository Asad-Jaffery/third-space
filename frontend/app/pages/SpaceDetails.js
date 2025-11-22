'use client';

import { useState } from 'react';

export default function VolunteerPark() {
  const [activeTab, setActiveTab] = useState('reviews');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const reviews = [
    {
      id: 1,
      title: "Great Trails!",
      text: "i love how the trails are nicely paved; they really minimize the chance for me to trip and fall",
      author: "Ink_Bot_Trots34",
      date: "11/19/2025",
      rating: 5
    },
    {
      id: 2,
      title: "Great Trails!",
      text: "i love how the trails are nicely paved; they really minimize the chance for me to trip and fall",
      author: "Ink_Bot_Trots34",
      date: "11/19/2025",
      rating: 5
    },
    {
      id: 3,
      title: "Great Trails!",
      text: "i love how the trails are nicely paved; they really minimize the chance for me to trip and fall",
      author: "Ink_Bot_Trots34",
      date: "11/19/2025",
      rating: 5
    }
  ];

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
        {/* Place Header */}
        <div className="bg-[#d4d4d4] px-6 py-3 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#2d2d2d]">Volunteer<br/>Park</h2>
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
            src="/api/placeholder/400/200" 
            alt="Volunteer Park"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Tags */}
        <div className="px-6 py-4 flex gap-2">
          <span className="px-4 py-1 bg-[#f5e6e6] text-[#6b4444] rounded-full text-sm border border-[#6b4444]">park</span>
          <span className="px-4 py-1 bg-[#e6f5e6] text-[#446b44] rounded-full text-sm border border-[#446b44]">views</span>
          <button className="ml-auto px-4 py-1 bg-[#2d2d2d] text-white rounded text-sm">Review/Reflect</button>
        </div>

        {/* Description */}
        <div className="px-6 py-4">
          <h3 className="text-xl font-bold text-[#2d2d2d] mb-2">Description</h3>
          <p className="text-sm text-[#4a4a4a] leading-relaxed">
            Volunteer park is a wonderful park for park goers and park enthusiasts. it is free. parking is lovely for all the commuters. beautiful views and there are covered areas that are sometimes reserved.
          </p>
        </div>

        {/* Directions */}
        <div className="px-6 py-4">
          <h3 className="text-xl font-bold text-[#2d2d2d] mb-2">Directions</h3>
          <a href="#" className="text-sm text-[#4a4a4a] underline">Volunteer Park Google Map</a>
        </div>

        {/* Ratings */}
        <div className="px-6 py-4">
          <h3 className="text-xl font-bold text-[#2d2d2d] mb-2">Ratings</h3>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className="w-5 h-5 text-[#2d2d2d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
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

        {/* Reviews List */}
        <div className="px-6 py-4 space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-lg font-bold text-[#2d2d2d]">{review.title}</h4>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-4 h-4 text-[#2d2d2d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                <span>{review.date} - {review.author}</span>
              </div>
            </div>
          ))}
        </div>

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
    </div>
  );
}