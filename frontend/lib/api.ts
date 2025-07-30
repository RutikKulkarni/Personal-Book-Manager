import type {
  User,
  Book,
  BookFormData,
  DashboardStats,
  BookFilters,
  AuthResponse,
  ApiResponse,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_URL;
  }

  setAuthToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      ...options,
    };

    if (config.body && typeof config.body === "object") {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: { email, password },
    });
  }

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: { name, email, password },
    });
  }

  async getMe(): Promise<User> {
    return this.request<User>("/auth/me");
  }

  async getBooks(
    filters: BookFilters = { status: "all", search: "", tag: "" }
  ): Promise<ApiResponse<Book[]>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all") {
        params.append(key, value);
      }
    });

    const queryString = params.toString();
    return this.request<ApiResponse<Book[]>>(
      `/books${queryString ? `?${queryString}` : ""}`
    );
  }

  async getBook(id: string): Promise<ApiResponse<Book>> {
    return this.request<ApiResponse<Book>>(`/books/${id}`);
  }

  async createBook(bookData: BookFormData): Promise<ApiResponse<Book>> {
    return this.request<ApiResponse<Book>>("/books", {
      method: "POST",
      body: bookData,
    });
  }

  async updateBook(
    id: string,
    bookData: Partial<BookFormData>
  ): Promise<ApiResponse<Book>> {
    return this.request<ApiResponse<Book>>(`/books/${id}`, {
      method: "PUT",
      body: bookData,
    });
  }

  async deleteBook(id: string): Promise<ApiResponse<null>> {
    return this.request<ApiResponse<null>>(`/books/${id}`, {
      method: "DELETE",
    });
  }

  async getStats(): Promise<ApiResponse<DashboardStats>> {
    return this.request<ApiResponse<DashboardStats>>("/books/stats");
  }
}

export const api = new ApiClient();
