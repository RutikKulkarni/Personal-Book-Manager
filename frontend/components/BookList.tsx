"use client";

import { useState } from "react";
import { FiSearch, FiFilter } from "react-icons/fi";
import BookCard from "./BookCard";
import type { Book, BookFilters } from "@/types";

interface BookListProps {
  books: Book[];
  filters: BookFilters;
  onFiltersChange: (
    filters: BookFilters | ((prev: BookFilters) => BookFilters)
  ) => void;
  onEditBook: (book: Book) => void;
  onDeleteBook: (bookId: string) => void;
  onStatusChange: (bookId: string, status: string) => void;
}

export default function BookList({
  books,
  filters,
  onFiltersChange,
  onEditBook,
  onDeleteBook,
  onStatusChange,
}: BookListProps) {
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key: keyof BookFilters, value: string) => {
    onFiltersChange((prev) => ({ ...prev, [key]: value }));
  };

  const statusOptions = [
    { value: "all", label: "All Books" },
    { value: "want-to-read", label: "Want to Read" },
    { value: "reading", label: "Reading" },
    { value: "completed", label: "Completed" },
  ];

  const uniqueTags = [...new Set(books.flatMap((book) => book.tags || []))];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Your Books ({books.length})
        </h3>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-white hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded-lg border border-gray-300 transition-colors duration-200 flex items-center space-x-2"
        >
          <FiFilter className="w-4 h-4" />
          <span>Filters</span>
        </button>
      </div>

      {showFilters && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-black"
                  placeholder="Search books..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                title="Filter by Status"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tag
              </label>
              <select
                value={filters.tag}
                onChange={(e) => handleFilterChange("tag", e.target.value)}
                title="Filter by Tag"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black"
              >
                <option value="">All Tags</option>
                {uniqueTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {books.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <FiSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium mb-2">
            No books found
          </p>
          <p className="text-gray-400">Add your first book to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onEdit={() => onEditBook(book)}
              onDelete={() => onDeleteBook(book._id)}
              onStatusChange={(status) => onStatusChange(book._id, status)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
