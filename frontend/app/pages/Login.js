"use client";

import { useState } from "react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setIsSubmitting(true);

    if (!email.includes("@")) {
      setEmailError("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("Logging in:", { email, password });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      console.log("Login successful");
    } catch (error) {
      setPasswordError("Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#3a3a3a]">
      <SiteHeader />

      <main className="bg-white max-w-md mx-auto min-h-screen px-6 py-8">
        <div className="bg-[#d4d4d4] rounded-lg p-6">
          <h2 className="text-3xl font-bold text-[#2d2d2d] mb-6 text-center">Log In to Thyrd Spaces</h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-[#2d2d2d] mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Description Value"
                  className={`w-full px-4 py-2 border rounded bg-white ${
                    emailError ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {emailError && (
                  <div className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠</span>
                    <span>Error: {emailError}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#2d2d2d] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Description Value"
                  className={`w-full px-4 py-2 border rounded bg-white ${
                    passwordError ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {passwordError && (
                  <div className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠</span>
                    <span>Error: {passwordError}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleSignIn}
              disabled={isSubmitting}
              className="w-full bg-[#2d2d2d] text-white font-semibold py-3 rounded hover:bg-[#1a1a1a] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>

            <div className="text-center">
              <button className="text-sm text-[#4a4a4a] underline hover:no-underline">
                Forgot password?
              </button>
            </div>

            <div className="text-center text-sm text-[#4a4a4a] pt-2 border-t border-gray-300">
              Don't have an account?{" "}
              <button className="text-[#2d2d2d] font-semibold underline hover:no-underline">
                Sign up for Account
              </button>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}