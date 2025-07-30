"use client";

import { useAuth } from "@/context/AuthContext";
import { FiLogOut, FiUser } from "react-icons/fi";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Book Manager</h1>
              <p className="text-sm text-gray-600">Personal Collection</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
              <FiUser className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700 font-medium">{user?.name}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 text-gray-600 px-3 py-2 rounded-lg cursor-pointer"
            >
              <FiLogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
