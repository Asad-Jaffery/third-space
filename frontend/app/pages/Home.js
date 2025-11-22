'use client';

import { useState } from 'react';

export default function ThyrdSpacesHome() {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const categories = ['All', 'Park', 'Altar', 'Library', 'Community Center', 'Garden'];
  
  const mockResults = [
    { id: 1, name: 'Volunteer Park', description: 'This park is lovely, open to the public...', category: 'park', views: 1234 },
    { id: 2, name: 'Altar at Udistrict', description: 'Cozy neighborhood Altar with great vibes...', category: 'Altar', views: 892 },
    { id: 3, name: 'Capitol Hill Library', description: 'Community library with study spaces...', category: 'library', views: 567 },
    { id: 4, name: 'Green Lake Park', description: 'Beautiful lakeside park for walking...', category: 'park', views: 2341 },
  ];

  const handleSearch = () => {
    console.log('Searching for:', keyword, category);
  };

  return (
    <div className="min-h-screen bg-[#3a3a3a]">
      {/* Header */}
      <header className="bg-[#c8d5b9] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-[#2d2d2d]">Thyrd Spaces</h1>
        </div>
        <button className="text-[#2d2d2d]">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className="bg-white max-w-4xl mx-auto min-h-screen">
        {/* introo Section */}
        <div className="bg-[#d4d4d4] px-6 py-8 text-center">
          <h2 className="text-4xl font-bold text-[#2d2d2d] mb-4">Welcome to Thyrd Spaces</h2>
          <p className="text-lg text-[#4a4a4a] mb-6 leading-relaxed">
            Thyrd spaces is a website that facilitates community-spread findings of third spaces!<br/>
            Come explore third places in Seattle and read more about our initiative!
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-2 bg-[#2d2d2d] text-white rounded">
              About Thyrd Spaces
            </button>
            <button className="px-6 py-2 bg-white text-[#2d2d2d] rounded border border-[#2d2d2d]">
              Add a Third Space
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="px-6 py-6">
          <h3 className="text-2xl font-bold text-[#2d2d2d] mb-4">Search for Third Spaces</h3>
          
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#2d2d2d] mb-2">Keyword</label>
                <input
                  type="text"
                  placeholder="Value"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-[#2d2d2d] mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-white"
                >
                  <option value="">Description Value</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <button
              onClick={handleSearch}
              className="px-8 py-2 bg-[#2d2d2d] text-white rounded"
            >
              Search
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className="px-6 py-6">
          <h3 className="text-2xl font-bold text-[#2d2d2d] mb-4">Search Results</h3>
          
          <div className="space-y-4">
            {mockResults.map(result => (
              <div key={result.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-xl font-bold text-[#2d2d2d]">{result.name}</h4>
                  <span className="px-3 py-1 bg-[#f5e6e6] text-[#6b4444] rounded-full text-sm border border-[#6b4444]">
                    {result.category}
                  </span>
                </div>
                <p className="text-sm text-[#4a4a4a] mb-3 leading-relaxed">{result.description}</p>
                <div className="flex items-center gap-2 text-sm text-[#6a6a6a]">
                  <span>{result.views} views</span>
                </div>
              </div>
            ))}
          </div>

          {/*  */}
          <div className="py-6 flex items-center justify-center gap-2">
            <button 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="px-4 py-2 bg-white border border-gray-300 rounded"
            >
              Previous
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-[#2d2d2d] text-white rounded">
              {currentPage}
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded">
              2
            </button>
            <span>...</span>
            <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded">
              68
            </button>
            <button 
              onClick={() => setCurrentPage(Math.min(68, currentPage + 1))}
              className="px-4 py-2 bg-white border border-gray-300 rounded"
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
              <a href="#" className="hover:underline">Home</a>
              <span>|</span>
              <a href="#" className="hover:underline">About</a>
              <span>|</span>
              <a href="#" className="hover:underline">Profile</a>
            </div>
            <div className="text-center md:text-right text-sm">
              <p className="font-bold">Thyrd Spaces</p>
              <p className="text-gray-400">copyright 2025</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}