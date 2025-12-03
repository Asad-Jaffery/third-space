"use client";

import { useState } from "react";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

const getApiBase = () => {
  const raw =
    (process.env.NEXT_PUBLIC_API_URL || "").trim() ||
    "https://third-space.onrender.com";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  return `https://${raw.replace(/^\/+/, "")}`;
};

export default function LogIn() {
  const API_BASE = getApiBase();
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const isSupabase = API_BASE.includes("supabase.co");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const handleSignIn = async () => {
    setEmailError("");
    setGeneralError("");
    setIsSubmitting(true);

    let hasError = false;

    if (!email.includes("@")) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    }

    if (hasError) {
      setIsSubmitting(false);
      return;
    }

    try {
      const trimmedEmail = email.trim();
      let userRecord = null;

      if (isSupabase) {
        if (!SUPABASE_KEY) {
          throw new Error("Supabase anon key is missing (set NEXT_PUBLIC_SUPABASE_ANON_KEY).");
        }
        const url = `${API_BASE}/rest/v1/users?email=eq.${encodeURIComponent(
          trimmedEmail
        )}&select=id,email,username&limit=1`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          const errText = await response.text();
          throw new Error(errText || `Login failed with ${response.status}`);
        }
        const data = await response.json();
        userRecord = Array.isArray(data) ? data[0] : null;
        if (!userRecord) {
          throw new Error("No account found with this email");
        }
      } else {
        const response = await fetch(`${API_BASE}/user/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
          body: JSON.stringify({
            email: trimmedEmail,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          
          if (response.status === 404) {
            throw new Error("No account found with this email");
          }
          
          throw new Error(errorData.detail || `Login failed with ${response.status}`);
        }

        const data = await response.json();
        userRecord = data.user;
      }

      console.log("Login successful:", userRecord);

      if (userRecord) {
        localStorage.setItem("user", JSON.stringify(userRecord));
        localStorage.setItem("userId", userRecord.id);
        localStorage.setItem("userEmail", userRecord.email);
        localStorage.setItem("username", userRecord.username);
      }

      window.location.href = "/pages";

    } catch (error) {
      console.error("Login failed:", error);
      
      if (error.message.includes("Failed to fetch")) {
        setGeneralError("Could not reach the server. Please retry in a moment (Render may be waking).");
      } else if (error.message.includes("No account found")) {
        setGeneralError("No account found with this email. Please sign up first.");
      } else {
        setGeneralError(error.message || "Login failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#3a3a3a]">
      <SiteHeader />

      <main className="bg-white max-w-sm mx-auto min-h-screen px-4 py-6">
        <div className="bg-[#d4d4d4] rounded-lg p-5">
          <h2 className="text-2xl font-bold text-[#2d2d2d] mb-4 text-center">
            Log In to Thyrd Spaces
          </h2>

          {generalError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {generalError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#2d2d2d] mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSignIn()}
                  placeholder="Enter your email"
                  className={`w-full px-4 py-2 border rounded bg-white text-[#2d2d2d] ${
                    emailError ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {emailError && (
                  <div className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠</span>
                    <span>{emailError}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleSignIn}
              disabled={isSubmitting}
              className="w-full bg-[#2d2d2d] text-white font-semibold py-2.5 rounded hover:bg-[#1a1a1a] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>

            <div className="text-center text-sm text-[#4a4a4a] pt-2 border-t border-gray-300">
              Don't have an account?{" "}
              <Link
                href="/pages/createaccount"
                className="text-[#2d2d2d] font-semibold underline hover:no-underline"
              >
                Sign up for Account
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
