/**
 * Beauty Salon Appointment Booking System - API Contract Types
 * Strictly separates public guest contracts from admin-only management contracts.
 */

// --- Public Availability & Booking Types ---

export interface DayAvailability {
  date: string; // YYYY-MM-DD format
  available: boolean;
}

export interface AvailabilityResponse {
  month: string; // YYYY-MM format
  days: DayAvailability[];
}

export interface CreateAppointmentDto {
  customerName: string;
  email: string;
  phone?: string | null;
  date: string; // YYYY-MM-DD format
}

export interface PublicAppointmentResponse {
  id: string;
  customerName: string;
  email: string;
  date: string;
  status: 'CONFIRMED' | 'CANCELLED' | string;
  createdAt: string;
}

// --- Admin Authentication Types ---

export interface LoginDto {
  email: string;
  password: string;
}

export interface AdminUser {
  id: string;
  email: string;
  createdAt?: string;
}

export interface LoginResponse {
  message: string;
  admin: AdminUser;
  token: string;
}

export interface AdminProfile {
  id: string;
  email: string;
  createdAt: string;
}

// --- Admin Appointment Management Types ---

export interface AdminAppointment {
  id: string;
  customerName: string;
  email: string;
  phone: string | null;
  date: string; // YYYY-MM-DD format
  status: 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface CancelAppointmentResponse {
  message: string;
  appointment: AdminAppointment;
}

// --- Standardized Backend Error Structure ---

export interface ApiErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string | string[];
}
