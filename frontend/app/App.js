import { Suspense } from 'react';
import Home from './Home';
import ViewProfile from './ViewProfileStatic';
import Login from './Login';
import CreateAccount from './CreateAccount';

export default function PagesRoute() {
  return (
    <Suspense fallback={
    <div className="min-h-screen bg-[#3a3a3a] flex items-center justify-center">
        <div className="text-white text-xl">
            Loading...
            </div>
        </div>}>
      <Home />
    </Suspense>
  );
}