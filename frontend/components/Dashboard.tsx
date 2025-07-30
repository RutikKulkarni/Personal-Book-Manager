"use client";

import { FiPlus } from "react-icons/fi";
import type { DashboardStats } from "@/types";

interface DashboardProps {
  stats: DashboardStats | null;
  onAddBook: () => void;
}

export default function Dashboard({ stats, onAddBook }: DashboardProps) {
  const statCards = [
    {
      title: "Total Books",
      value: stats?.stats?.total || 0,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-100",
    },
    {
      title: "Want to Read",
      value: stats?.stats?.["want-to-read"] || 0,
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      borderColor: "border-yellow-100",
    },
    {
      title: "Currently Reading",
      value: stats?.stats?.reading || 0,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      borderColor: "border-green-100",
    },
    {
      title: "Completed",
      value: stats?.stats?.completed || 0,
      bgColor: "bg-gray-50",
      iconColor: "text-gray-600",
      borderColor: "border-gray-100",
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600">Overview of your reading collection</p>
        </div>
        <button
          onClick={onAddBook}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <FiPlus className="w-5 h-5" />
          <span>Add Book</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`bg-white p-6 rounded-xl shadow-sm border ${stat.borderColor}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {stats?.recentBooks && stats.recentBooks.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Books
          </h3>
          <div className="space-y-3">
            {stats.recentBooks.map((book) => (
              <div
                key={book._id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
              >
                <div>
                  <p className="font-medium text-gray-900">{book.title}</p>
                  <p className="text-sm text-gray-600">by {book.author}</p>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    book.status === "completed"
                      ? "bg-gray-100 text-gray-800"
                      : book.status === "reading"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {book.status === "want-to-read"
                    ? "Want to Read"
                    : book.status === "reading"
                    ? "Reading"
                    : "Completed"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
