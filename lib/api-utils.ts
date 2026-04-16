import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

/**
 * Check if user is authenticated
 * Returns userId if authenticated, otherwise returns error response
 */
export async function checkAuth() {
  const { userId } = await auth();
  
  if (!userId) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      ),
    };
  }
  
  return {
    authorized: true,
    userId,
  };
}

/**
 * Generic error handler for API routes
 */
export function handleError(
  error: unknown,
  message: string,
  status: number = 500
) {
  console.error(`[API] ${message}:`, error);
  
  if (error instanceof Error) {
    return NextResponse.json(
      { error: message, details: error.message },
      { status }
    );
  }
  
  return NextResponse.json(
    { error: message },
    { status }
  );
}

/**
 * Validate required fields in request body
 */
export async function validateBody(
  request: Request,
  requiredFields: string[]
) {
  try {
    const body = await request.json();
    
    const missing = requiredFields.filter(field => !body[field]);
    
    if (missing.length > 0) {
      return {
        valid: false,
        response: NextResponse.json(
          { error: `Missing required fields: ${missing.join(', ')}` },
          { status: 400 }
        ),
      };
    }
    
    return {
      valid: true,
      body,
    };
  } catch (error) {
    return {
      valid: false,
      response: NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      ),
    };
  }
}

/**
 * Parse dynamic route parameters
 */
export function getRouteParam(
  pathname: string,
  index: number
): string | null {
  const parts = pathname.split('/');
  return parts[index] || null;
}

/**
 * Calculate days between two dates
 */
export function daysBetween(startDate: Date, endDate: Date): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Safely parse JSON
 */
export function safeParseJSON<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}
