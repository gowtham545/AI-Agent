/**
 * CircularFlow AI — Backend API Client Utility
 * 
 * Provides resilient, typed client helpers to communicate with the FastAPI backend.
 * Features graceful fallbacks so frontend remains 100% functional even if the backend is offline.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface HealthStatus {
  status: string;
  service: string;
  version: string;
  environment: string;
}

export interface BackendCircular {
  id: string;
  ref_no: string;
  title: string;
  department: string;
  category: string;
  status: string;
  priority: string;
  published_date: string;
  effective_date: string;
  expiry_date?: string;
  version: string;
  author: string;
  signatory: string;
  summary: string;
  body: string;
  supersedes_id?: string;
  supersedes_ref?: string;
  superseded_by_id?: string;
  superseded_by_ref?: string;
  target_audience: string[];
  tags: string[];
  required_actions: string[];
  acknowledgement_rate: number;
  total_recipients: number;
  acknowledged_recipients: number;
  file_attachment?: string;
}

export interface BackendCircularListResponse {
  items: BackendCircular[];
  total: number;
  active_count: number;
  departments: string[];
  page: number;
  page_size: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  isBackendOnline: boolean;
}

/**
 * Check connectivity and status of the FastAPI backend.
 */
export async function checkBackendHealth(): Promise<ApiResponse<HealthStatus>> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3-second timeout

    const res = await fetch(`${API_BASE_URL}/api/v1/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return {
        success: false,
        error: `Backend returned HTTP ${res.status}: ${res.statusText}`,
        isBackendOnline: false,
      };
    }

    const data: HealthStatus = await res.json();
    return {
      success: true,
      data,
      isBackendOnline: true,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.name === 'AbortError' ? 'Backend health check timed out' : (err.message || 'Cannot reach FastAPI backend'),
      isBackendOnline: false,
    };
  }
}

/**
 * Fetch catalogued circulars from FastAPI backend with optional filtering.
 */
export async function fetchCircularsFromBackend(params?: {
  department?: string;
  status?: string;
  category?: string;
  search?: string;
  page?: number;
}): Promise<ApiResponse<BackendCircularListResponse>> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.department && params.department !== 'All Departments') {
      queryParams.append('department', params.department);
    }
    if (params?.status && params.status !== 'All') {
      queryParams.append('status', params.status);
    }
    if (params?.category && params.category !== 'All') {
      queryParams.append('category', params.category);
    }
    if (params?.search) {
      queryParams.append('search', params.search);
    }
    if (params?.page) {
      queryParams.append('page', String(params.page));
    }

    const url = `${API_BASE_URL}/api/v1/circulars${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorText = await res.text();
      return {
        success: false,
        error: `HTTP ${res.status}: ${errorText || res.statusText}`,
        isBackendOnline: false,
      };
    }

    const data: BackendCircularListResponse = await res.json();
    return {
      success: true,
      data,
      isBackendOnline: true,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Failed to connect to backend circulars endpoint',
      isBackendOnline: false,
    };
  }
}

/**
 * Fetch a single circular by ID or Reference Number from FastAPI backend.
 */
export async function fetchCircularByIdFromBackend(circularId: string): Promise<ApiResponse<BackendCircular>> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${API_BASE_URL}/api/v1/circulars/${encodeURIComponent(circularId)}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.status === 404) {
      return {
        success: false,
        error: `Circular '${circularId}' not found in backend.`,
        isBackendOnline: true,
      };
    }

    if (!res.ok) {
      return {
        success: false,
        error: `Backend error (HTTP ${res.status})`,
        isBackendOnline: false,
      };
    }

    const data: BackendCircular = await res.json();
    return {
      success: true,
      data,
      isBackendOnline: true,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Failed to connect to backend endpoint',
      isBackendOnline: false,
    };
  }
}
