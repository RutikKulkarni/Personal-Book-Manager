"use client";

import { FiEdit2, FiTrash2, FiTag } from "react-icons/fi";
import type { Book, BookStatus } from "@/types";

interface BookCardProps {
  book: Book;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: string) => void;
}

export default function BookCard({
  book,
  onEdit,
  onDelete,
  onStatusChange,
}: BookCardProps) {
  const getStatusColor = (status: BookStatus) => {
    switch (status) {
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "reading":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1 text-lg">
            {book.title}
          </h4>
          <p className="text-gray-600 text-sm">by {book.author}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            title="Edit Book"
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            title="Delete Book"
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <select
          value={book.status}
          title="Change Status"
          onChange={(e) => onStatusChange(e.target.value)}
          className={`text-xs font-medium px-3 py-2 rounded-full border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(
            book.status
          )}`}
        >
          <option value="want-to-read">Want to Read</option>
          <option value="reading">Reading</option>
          <option value="completed">Completed</option>
        </select>

        {book.tags && book.tags.length > 0 && (
          <div className="flex items-center flex-wrap gap-2">
            <FiTag className="w-4 h-4 text-gray-400 mr-1" />
            {book.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md border border-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {book.notes && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 line-clamp-2">{book.notes}</p>
        </div>
      )}
    </div>
  );
}
