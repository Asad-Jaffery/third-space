"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

export default function SpaceDetails() {
  const searchParams = useSearchParams();
  const spaceId = searchParams.get('id');
  
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

  // Mock data - in a real app this would come from a database or API
  const allSpaces = [
    {
      id: 1,
      name: 'Volunteer Park',
      description: 'A wonderful park for park goers and park enthusiasts. It is free, parking is lovely for all the commuters. Beautiful views and there are covered areas that are sometimes reserved.',
      tags: ['park', 'views'],
      image: '/api/placeholder/400/200',
      altText: 'Beautiful park with walking trails',
      location: 'https://maps.google.com/volunteer-park',
      reviews: [
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
          title: "Perfect for Morning Walks!",
          text: "Beautiful scenery and well-maintained paths. Great place to start the day.",
          author: "MorningWalker",
          date: "11/18/2025",
          rating: 5
        }
      ]
    }
  ];

  useEffect(() => {
    if (spaceId) {
      const space = allSpaces.find(s => s.id === parseInt(spaceId));
      setSpaceData(space);
    } else {
      // Default to first space if no ID provided
      setSpaceData(allSpaces[0]);
    }
  }, [spaceId]);

  if (!spaceData) {
    return (
      <div className="min-h-screen bg-[#3a3a3a] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#3a3a3a]">
      <SiteHeader />

      {/* Main Content */}
      <main className="bg-white max-w-md mx-auto min-h-screen pt-16 pb-24">
        {/* Place Header */}
        <div className="bg-[#d4d4d4] px-6 py-3 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#2d2d2d]">{spaceData.name.split(' ').map((word, index) => (
            <span key={index}>
              {word}
              {index < spaceData.name.split(' ').length - 1 && <br />}
            </span>
          ))}</h2>
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
        <div className="px-6 py-4">3r3333
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
          {spaceData.reviews && spaceData.reviews.length > 0 ? (
            spaceData.reviews.map((review) => (
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
                  <span>{review.date} - {review.author}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-[#6a6a6a]">No reviews yet. Be the first to review this space!</p>
            </div>
          )}
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
                if (formTab === 'review') {
                  console.log('Submit review', {
                    reviewTitle,
                    rating,
                    reviewBody,
                  });
                } else {
                  console.log('Submit reflection', {
                    reflectionTitle,
                    reflectionBody,
                  });
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
