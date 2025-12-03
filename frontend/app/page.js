"use client";

import { Suspense, useEffect, useState } from "react";
import Home from "./Home";
import Login from "./login/Login";
import CreateAccount from "./createaccount/CreateAccount";

export default function PagesRoute() {
  const [isReady, setIsReady] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    try {
      const storedUser =
        typeof window !== "undefined" ? window.localStorage.getItem("user") : null;
      if (!storedUser) {
        setIsAuthed(false);
      } else {
        try {
          const parsed = JSON.parse(storedUser);
          const valid = parsed && (parsed.id || parsed.email || parsed.username);
          if (valid) {
            setIsAuthed(true);
          } else {
            window.localStorage.removeItem("user");
            setIsAuthed(false);
          }
        } catch {
          window.localStorage.removeItem("user");
          setIsAuthed(false);
        }
      }
    } catch {
      setIsAuthed(false);
    } finally {
      setIsReady(true);
    }
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#3a3a3a] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // If not logged in, show a simple auth landing: login form plus signup below.
  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-[#3a3a3a]">
        <Suspense
          fallback={
            <div className="min-h-screen bg-[#3a3a3a] flex items-center justify-center">
              <div className="text-white text-xl">Loading...</div>
            </div>
          }
        >
          <Login />
          <div className="max-w-md mx-auto mt-8 px-4">
            <CreateAccount />
          </div>
        </Suspense>
      </div>
    );
  }

  // Logged in: show home page.
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#3a3a3a] flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      }
    >
      <Home />
    </Suspense>
  );
}
