import './api.types';
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

function shouldUseGlobalLoading(config?: { skipGlobalLoading?: boolean }): boolean {
  return !config?.skipGlobalLoading;
}

// Global loading state management
let loadingCount = 0;
let loadingCallbacks: Set<(loading: boolean) => void> = new Set();

export const setGlobalLoadingCallback = (callback: (loading: boolean) => void) => {
  loadingCallbacks.add(callback);
  return () => {
    loadingCallbacks.delete(callback);
  };
};

const notifyLoadingChange = (isLoading: boolean) => {
  loadingCallbacks.forEach((callback) => callback(isLoading));
};

const incrementLoading = () => {
  loadingCount++;
  if (loadingCount === 1) {
    notifyLoadingChange(true);
  }
};

const decrementLoading = () => {
  loadingCount = Math.max(0, loadingCount - 1);
  if (loadingCount === 0) {
    notifyLoadingChange(false);
  }
};

// API Response types
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  message?: string;
  success?: boolean;
}

export interface ApiError {
  message: string;
  error?: string;
  errors?: Record<string, string[]>;
  status: number;
  statusText?: string;
}

class ApiClient {
  private client: AxiosInstance;
  private authTokenKey: string;

  constructor() {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://api.theadswap.com';
    this.authTokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token';

    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - attach auth token and show loading
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (typeof window !== 'undefined') {
          const token = this.getAuthToken();
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          if (shouldUseGlobalLoading(config)) {
            incrementLoading();
          }
        }
        return config;
      },
      (error) => {
        if (typeof window !== 'undefined' && shouldUseGlobalLoading(error.config)) {
          decrementLoading();
        }
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle global errors and hide loading
    this.client.interceptors.response.use(
      (response) => {
        if (typeof window !== 'undefined' && shouldUseGlobalLoading(response.config)) {
          decrementLoading();
        }
        return response;
      },
      (error: AxiosError<ApiError>) => {
        if (typeof window !== 'undefined' && shouldUseGlobalLoading(error.config)) {
          decrementLoading();
        }
        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  private handleError(error: AxiosError<ApiError>): void {
    if (typeof window === 'undefined') return;

    const status = error.response?.status;
    const errorData = error.response?.data;

    // Ensure error data includes status code
    if (errorData && status) {
      errorData.status = status;
      errorData.statusText = error.response?.statusText;
    }

    switch (status) {
      case 401:
        // Unauthorized - redirect to login
        this.clearAuthToken();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        break;

      case 403:
        // Forbidden - show access denied UI
        // This will be handled by components using the error state
        break;

      case 500:
      case 502:
      case 503:
      case 504:
        // Server errors - show fallback UI
        // This will be handled by components using the error state
        break;

      default:
        // Other errors handled by components
        break;
    }
  }

  // Auth token management
  public getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.authTokenKey);
  }

  public setAuthToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.authTokenKey, token);
  }

  public clearAuthToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.authTokenKey);
  }

  // HTTP methods
  public async get<T = any>(url: string, config?: any): Promise<ApiResponse<T>> {
    const response = await this.client.get<T>(url, config);
    // Handle both nested data structure and direct data
    const responseData = (response.data as any)?.data || response.data;
    return {
      data: responseData as T,
      status: response.status,
      statusText: response.statusText,
      message: (response.data as any)?.message,
      success: (response.data as any)?.success,
    };
  }

  public async post<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    const response = await this.client.post<T>(url, data, config);
    // Handle both nested data structure and direct data
    const responseData = (response.data as any)?.data || response.data;
    return {
      data: responseData as T,
      status: response.status,
      statusText: response.statusText,
      message: (response.data as any)?.message,
      success: (response.data as any)?.success,
    };
  }

  public async put<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    const response = await this.client.put<T>(url, data, config);
    // Handle both nested data structure and direct data
    const responseData = (response.data as any)?.data || response.data;
    return {
      data: responseData as T,
      status: response.status,
      statusText: response.statusText,
      message: (response.data as any)?.message,
      success: (response.data as any)?.success,
    };
  }

  public async patch<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    const response = await this.client.patch<T>(url, data, config);
    // Handle both nested data structure and direct data
    const responseData = (response.data as any)?.data || response.data;
    return {
      data: responseData as T,
      status: response.status,
      statusText: response.statusText,
      message: (response.data as any)?.message,
      success: (response.data as any)?.success,
    };
  }

  public async delete<T = any>(url: string, config?: any): Promise<ApiResponse<T>> {
    const response = await this.client.delete<T>(url, config);
    // Handle both nested data structure and direct data
    const responseData = (response.data as any)?.data || response.data;
    return {
      data: responseData as T,
      status: response.status,
      statusText: response.statusText,
      message: (response.data as any)?.message,
      success: (response.data as any)?.success,
    };
  }

  public async postMultipart<T = any>(url: string, formData: FormData, config?: any): Promise<ApiResponse<T>> {
    const response = await this.client.post<T>(url, formData, {
      ...config,
      skipGlobalLoading: config?.skipGlobalLoading ?? false,
      headers: {
        ...config?.headers,
        'Content-Type': undefined,
      },
    });
    const responseData = (response.data as any)?.data ?? response.data;
    return {
      data: responseData as T,
      status: response.status,
      statusText: response.statusText,
      message: (response.data as any)?.message,
      success: (response.data as any)?.success,
    };
  }
}

// Export singleton instance
const api = new ApiClient();
export default api;

