"use client";

import { useState } from "react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

const getApiBase = () => {
  const raw =
    (process.env.NEXT_PUBLIC_API_URL || "").trim() ||
    "https://third-space.onrender.com";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  return `https://${raw.replace(/^\/+/, "")}`;
};

export default function CreateAccount() {
  const API_BASE = getApiBase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async () => {
    setEmailError("");
    setPasswordError("");
    setUsernameError("");
    setSuccessMessage("");
    setIsSubmitting(true);

    let hasError = false;

    if (!email.includes("@")) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      hasError = true;
    }

    if (!username.trim()) {
      setUsernameError("Username is required");
      hasError = true;
    }

    if (hasError) {
      setIsSubmitting(false);
      return;
    }

    try {
      // problem hereeeee
      const response = await fetch(`${API_BASE}/user/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
          email: email.trim(),
          username: username.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Request failed with ${response.status}`);
      }

      const data = await response.json();
      console.log("Registration successful:", data);
      
      setSuccessMessage("Account created successfully! Redirecting to login...");
      
      setEmail("");
      setPassword("");
      setUsername("");

      setTimeout(() => {
        window.location.href = "/pages/login";
      }, 2000);

    } catch (error) {
      console.error("Registration failed:", error);
      
      if (error.message.includes("Failed to fetch")) {
        setEmailError("Could not reach the server. Please retry in a moment (Render may be waking).");
      } else if (error.message.includes("duplicate") || error.message.includes("already exists")) {
        setEmailError("This email is already registered. Please use a different email or log in.");
      } else {
        setEmailError(error.message || "Registration failed. Please try again.");
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
          <h2 className="text-2xl font-bold text-[#2d2d2d] mb-4 text-center">Create Account</h2>
          
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
              {successMessage}
            </div>
          )}

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
                  placeholder="Enter your email"
                  className={`w-full px-4 py-2 border rounded bg-white ${
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

            <div>
              <label className="block text-sm font-bold text-[#2d2d2d] mb-2">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className={`w-full px-4 py-2 border rounded bg-white ${
                    usernameError ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {usernameError && (
                  <div className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠</span>
                    <span>{usernameError}</span>
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
                  placeholder="Create a password"
                  className={`w-full px-4 py-2 border rounded bg-white ${
                    passwordError ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {passwordError && (
                  <div className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠</span>
                    <span>{passwordError}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleRegister}
              disabled={isSubmitting}
              className="w-full bg-[#2d2d2d] text-white font-semibold py-2.5 rounded hover:bg-[#1a1a1a] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating Account..." : "Register"}
            </button>

            <div className="text-center text-sm text-[#4a4a4a] mt-4">
              Already have an account?{" "}
              <a href="/pages/login" className="text-[#2d2d2d] font-semibold underline hover:no-underline">
                Log In
              </a>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}