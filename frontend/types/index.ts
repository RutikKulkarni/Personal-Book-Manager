export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  tags: string[];
  status: BookStatus;
  notes?: string;
  user: string;
  dateAdded: string;
  dateCompleted?: string;
  createdAt: string;
  updatedAt: string;
}

export type BookStatus = "want-to-read" | "reading" | "completed";

export interface BookStats {
  total: number;
  "want-to-read": number;
  reading: number;
  completed: number;
}

export interface RecentBook {
  _id: string;
  title: string;
  author: string;
  status: BookStatus;
  createdAt: string;
}

export interface DashboardStats {
  stats: BookStats;
  recentBooks: RecentBook[];
}

export interface BookFilters {
  status: string;
  search: string;
  tag: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
}

export interface BookFormData {
  title: string;
  author: string;
  status: BookStatus;
  tags: string[];
  notes: string;
}
