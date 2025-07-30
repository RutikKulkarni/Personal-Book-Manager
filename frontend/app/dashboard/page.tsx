"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import BookList from "@/components/BookList";
import BookForm from "@/components/BookForm";
import { FiClock } from "react-icons/fi";
import type { Book, DashboardStats, BookFilters, BookFormData } from "@/types";

export default function DashboardPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBookForm, setShowBookForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showDelayMessage, setShowDelayMessage] = useState(false);
  const [filters, setFilters] = useState<BookFilters>({
    status: "all",
    search: "",
    tag: "",
  });
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchData();
  }, [user, router, filters]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      timer = setTimeout(() => {
        setShowDelayMessage(true);
      }, 8000);
    } else {
      setShowDelayMessage(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  const fetchData = async () => {
    try {
      const [booksResponse, statsResponse] = await Promise.all([
        api.getBooks(filters),
        api.getStats(),
      ]);
      setBooks(booksResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (bookData: BookFormData) => {
    try {
      await api.createBook(bookData);
      toast.success("Book added successfully!");
      setShowBookForm(false);
      fetchData();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add book"
      );
    }
  };

  const handleUpdateBook = async (bookData: BookFormData) => {
    if (!editingBook) return;

    try {
      await api.updateBook(editingBook._id, bookData);
      toast.success("Book updated successfully!");
      setEditingBook(null);
      fetchData();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update book"
      );
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    try {
      await api.deleteBook(bookId);
      toast.success("Book deleted successfully!");
      fetchData();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete book"
      );
    }
  };

  const handleStatusChange = async (bookId: string, newStatus: string) => {
    try {
      const book = books.find((b) => b._id === bookId);
      if (!book) return;

      await api.updateBook(bookId, {
        ...book,
        status: newStatus as Book["status"],
      });
      toast.success("Status updated!");
      fetchData();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          <p className="text-gray-600">Loading your books...</p>
          {showDelayMessage && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
              <div className="flex items-center space-x-2">
                <FiClock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Taking longer than usual?
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Our backend is hosted on Render&apos;s free tier and may
                    take 2-3 minutes to wake up. Please wait...
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Dashboard stats={stats} onAddBook={() => setShowBookForm(true)} />

        <BookList
          books={books}
          filters={filters}
          onFiltersChange={setFilters}
          onEditBook={setEditingBook}
          onDeleteBook={handleDeleteBook}
          onStatusChange={handleStatusChange}
        />
      </main>

      {showBookForm && (
        <BookForm
          onSubmit={handleAddBook}
          onClose={() => setShowBookForm(false)}
        />
      )}

      {editingBook && (
        <BookForm
          book={editingBook}
          onSubmit={handleUpdateBook}
          onClose={() => setEditingBook(null)}
        />
      )}
    </div>
  );
}
