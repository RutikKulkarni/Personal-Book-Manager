"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FiBook, FiUser, FiArrowRight } from "react-icons/fi";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-100 rounded-full">
              <FiBook className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Personal Book Manager
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            A simple and elegant way to manage your reading collection. Track
            your books, reflect on your habits, and rediscover your favorite
            authors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/signup")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-lg cursor-pointer"
            >
              Get Started
              <FiArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => router.push("/login")}
              className="bg-white hover:bg-gray-50 text-gray-700 font-medium px-8 py-3 rounded-lg border border-gray-300 transition-colors duration-200 flex items-center justify-center gap-2 text-lg cursor-pointer"
            >
              <FiUser className="w-5 h-5" />
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
