"use client";

import { useState } from "react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export default function CreateAccount() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e) => {
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
      console.log("Registering:", { email, password });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      console.log("Registration successful");
    } catch (error) {
      setEmailError("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#3a3a3a]">
      <SiteHeader />
      {/* <header className="bg-[#c8d5b9] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#2d2d2d]">Thyrd Spaces</h1>
          
          <nav className="flex items-center gap-6">
            <button className="text-[#2d2d2d] font-medium hover:underline">Home</button>
            <button className="text-[#2d2d2d] font-medium hover:underline">About</button>
            <button className="text-[#2d2d2d] font-medium hover:underline">Thyrd Spaces</button>
            <button className="text-[#2d2d2d] font-medium hover:underline">Profile</button>
          </nav>
        </div>
      </header> */}

      <main className="bg-white max-w-md mx-auto min-h-screen px-6 py-8">
        <div className="bg-[#d4d4d4] rounded-lg p-6">
          <h2 className="text-3xl font-bold text-[#2d2d2d] mb-6 text-center">Create Account</h2>
          
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

            <div>
              <label className="block text-sm font-bold text-[#2d2d2d] mb-2">
                Label
              </label>
              <input
                type="text"
                placeholder="Description"
                className="w-full px-4 py-2 border border-gray-300 rounded bg-white"
              />
            </div>

            <button
              onClick={handleRegister}
              disabled={isSubmitting}
              className="w-full bg-[#2d2d2d] text-white font-semibold py-3 rounded hover:bg-[#1a1a1a] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating Account..." : "Register"}
            </button>

            <div className="text-center text-sm text-[#4a4a4a] mt-4">
              Already have an account?{" "}
              <button className="text-[#2d2d2d] font-semibold underline hover:no-underline">
                Log In
              </button>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
      {/* <footer className="bg-[#2d2d2d] text-white">
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
      </footer> */}
    </div>
  );
}