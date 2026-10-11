import {
  AvailabilityResponse,
  CreateAppointmentDto,
  PublicAppointmentResponse,
  LoginDto,
  LoginResponse,
  AdminProfile,
  AdminAppointment,
  CancelAppointmentResponse,
  ApiErrorResponse,
} from '@/types/api';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || 'http://localhost:3001';

export class ApiError extends Error {
  statusCode: number;
  messages: string[];

  constructor(statusCode: number, message: string, messages: string[] = []) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.messages = messages.length > 0 ? messages : [message];
  }
}

/**
 * Low-level typed fetch wrapper with error handling and credentials support.
 */
async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  const config: RequestInit = {
    ...options,
    headers,
    // Always include credentials so NestJS HTTP-only admin_token cookie works across origins
    credentials: 'include',
  };

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network request failed';
    throw new ApiError(0, `Connection error: ${message}`);
  }

  if (!response.ok) {
    let errorData: ApiErrorResponse | null = null;
    let fallbackText = '';
    try {
      const parsed = await response.json();
      errorData = parsed;
    } catch {
      try {
        fallbackText = await response.text();
      } catch {
        fallbackText = response.statusText;
      }
    }

    let parsedMessages: string[] = [];
    let mainMessage = `Request failed with status ${response.status}`;

    if (errorData?.message) {
      if (Array.isArray(errorData.message)) {
        parsedMessages = errorData.message;
        mainMessage = parsedMessages.join('. ');
      } else {
        mainMessage = errorData.message;
        parsedMessages = [errorData.message];
      }
    } else if (fallbackText) {
      mainMessage = fallbackText;
      parsedMessages = [fallbackText];
    }

    throw new ApiError(response.status, mainMessage, parsedMessages);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

// ============================================================================
// Public API Methods
// ============================================================================

/**
 * Fetch calendar availability for a given month (YYYY-MM format).
 */
export async function getAvailability(month: string): Promise<AvailabilityResponse> {
  const query = encodeURIComponent(month);
  return request<AvailabilityResponse>(`/appointments/availability?month=${query}`, {
    method: 'GET',
    cache: 'no-store',
  });
}

/**
 * Submit guest customer appointment booking.
 */
export async function createAppointment(
  dto: CreateAppointmentDto,
): Promise<PublicAppointmentResponse> {
  return request<PublicAppointmentResponse>('/appointments', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

// ============================================================================
// Administrator Authentication API Methods
// ============================================================================

/**
 * Administrator login with email & password. Sets HTTP-only cookie in backend.
 */
export async function login(dto: LoginDto): Promise<LoginResponse> {
  return request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

/**
 * Administrator logout. Clears session cookie on the backend.
 */
export async function logout(): Promise<{ message: string }> {
  return request<{ message: string }>('/auth/logout', {
    method: 'POST',
  });
}

/**
 * Verify current administrator session and fetch admin profile.
 */
export async function getMe(): Promise<AdminProfile> {
  return request<AdminProfile>('/auth/me', {
    method: 'GET',
    cache: 'no-store',
  });
}

// ============================================================================
// Administrator Appointment Management API Methods
// ============================================================================

/**
 * List all appointments for the requested month with customer contact details.
 */
export async function getAdminAppointments(month: string): Promise<AdminAppointment[]> {
  const query = encodeURIComponent(month);
  return request<AdminAppointment[]>(`/appointments?month=${query}`, {
    method: 'GET',
    cache: 'no-store',
  });
}

/**
 * Fetch single appointment details by UUID.
 */
export async function getAppointmentById(id: string): Promise<AdminAppointment> {
  const encodedId = encodeURIComponent(id);
  return request<AdminAppointment>(`/appointments/${encodedId}`, {
    method: 'GET',
    cache: 'no-store',
  });
}

/**
 * Cancel an appointment. Frees calendar date for customer bookings.
 */
export async function cancelAppointment(id: string): Promise<CancelAppointmentResponse> {
  const encodedId = encodeURIComponent(id);
  return request<CancelAppointmentResponse>(`/appointments/${encodedId}/cancel`, {
    method: 'PATCH',
  });
}
