import { Suspense } from 'react';
import SpaceDetails from './SpaceDetails';
import Home from './Home';

export default function PagesRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#3a3a3a] flex items-center justify-center"><div className="text-white text-xl">Loading...</div></div>}>
      <Home />
    </Suspense>
  );
}