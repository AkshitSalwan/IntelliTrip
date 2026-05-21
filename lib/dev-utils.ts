// Development helper for test user in development mode
export function getUserId(clerkUserId: string | null): string | null {
  // In development, use test user ID when Clerk ID is not available
  if (process.env.NODE_ENV === 'development' && !clerkUserId) {
    return 'user_test_123'
  }
  return clerkUserId
}
