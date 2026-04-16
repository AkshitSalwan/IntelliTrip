/**
 * IntelliTrip Configuration
 * Central place for app constants and configuration
 */

// Travel Styles
export const TRAVEL_STYLES = [
  'Adventure',
  'Relaxation',
  'Culture',
  'Food',
  'Family',
  'Luxury',
  'Budget',
  'Business',
] as const;

export type TravelStyle = typeof TRAVEL_STYLES[number];

// Common Interests
export const INTERESTS = [
  'Hiking',
  'Beaches',
  'Mountains',
  'Cities',
  'Museums',
  'Nightlife',
  'Shopping',
  'Photography',
  'Local Food',
  'Historical Sites',
  'Art',
  'Nature',
  'Adventure Sports',
  'Wellness',
  'Festivals',
] as const;

export type Interest = typeof INTERESTS[number];

// Expense Categories
export const EXPENSE_CATEGORIES = [
  'Accommodation',
  'Food & Dining',
  'Transport',
  'Activities',
  'Shopping',
  'Entertainment',
  'Health & Wellness',
  'Other',
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];

// Trip Status
export const TRIP_STATUSES = [
  'planning',
  'ongoing',
  'completed',
  'cancelled',
] as const;

export type TripStatus = typeof TRIP_STATUSES[number];

// Budget Periods
export const BUDGET_PERIODS = {
  daily: 'Per Day',
  total: 'Total',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  TRIPS: '/api/trips',
  EXPENSES: (tripId: string) => `/api/trips/${tripId}/expenses`,
  ITINERARY: (tripId: string) => `/api/trips/${tripId}/itinerary`,
  MEMORIES: (tripId: string) => `/api/trips/${tripId}/memories`,
  CHAT: (tripId: string) => `/api/trips/${tripId}/chat`,
} as const;

// UI Constants
export const UI = {
  SIDEBAR_WIDTH: 280,
  HEADER_HEIGHT: 80,
  TOAST_DURATION: 3000,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE_MB: 10,
  MAX_SIZE_BYTES: 10 * 1024 * 1024,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
} as const;

// Date Format
export const DATE_FORMAT = 'yyyy-MM-dd' as const;
export const DISPLAY_DATE_FORMAT = 'MMM dd, yyyy' as const;

// Messages
export const MESSAGES = {
  TRIP_CREATED: 'Trip created successfully!',
  TRIP_UPDATED: 'Trip updated successfully!',
  TRIP_DELETED: 'Trip deleted successfully!',
  EXPENSE_ADDED: 'Expense added!',
  EXPENSE_DELETED: 'Expense deleted!',
  MEMORY_UPLOADED: 'Memory uploaded!',
  MEMORY_DELETED: 'Memory deleted!',
  ITINERARY_GENERATED: 'Itinerary generated!',
  ERROR_GENERIC: 'Something went wrong. Please try again.',
  ERROR_UNAUTHORIZED: 'You are not authorized to perform this action.',
  ERROR_NOT_FOUND: 'Resource not found.',
} as const;

// Limits
export const LIMITS = {
  MIN_TRIP_BUDGET: 0,
  MAX_TRIP_BUDGET: 1000000,
  MIN_TRIP_TITLE_LENGTH: 3,
  MAX_TRIP_TITLE_LENGTH: 100,
  MIN_DAYS: 1,
  MAX_DAYS: 365,
  MAX_EXPENSES_PER_TRIP: 10000,
  MAX_MEMORIES_PER_TRIP: 1000,
} as const;

// Theme Colors (matching globals.css)
export const THEME_COLORS = {
  light: {
    primary: '#0066CC', // Ocean Blue
    secondary: '#E6B800', // Warm Sand
    accent: '#00AA99', // Teal
    background: '#FFFFFF',
    foreground: '#1A1A1A',
  },
  dark: {
    primary: '#3D8AFF', // Lighter Blue
    secondary: '#F0C04D', // Lighter Gold
    accent: '#4DD9CC', // Lighter Teal
    background: '#1A1F2E', // Dark Blue
    foreground: '#F7F8FA',
  },
} as const;

export default {
  TRAVEL_STYLES,
  INTERESTS,
  EXPENSE_CATEGORIES,
  TRIP_STATUSES,
  API_ENDPOINTS,
  UI,
  FILE_UPLOAD,
  MESSAGES,
  LIMITS,
  THEME_COLORS,
};
