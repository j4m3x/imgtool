import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

// Hardcoded API key for demo purposes
// In production, this would be stored securely in a database
const VALID_API_KEYS = ["demo-api-key-123", "test-api-key-456"]

// Rate limiting configuration
const RATE_LIMIT = 100 // requests per month
const rateLimitMap = new Map<string, number>()

export async function validateApiKey(request: NextRequest) {
  // Get the Authorization header
  const authHeader = request.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      success: false,
      status: 401,
      message: "Missing or invalid Authorization header. Format should be: 'Bearer YOUR_API_KEY'",
    }
  }

  // Extract the API key
  const apiKey = authHeader.split(" ")[1]

  if (!apiKey || !VALID_API_KEYS.includes(apiKey)) {
    return {
      success: false,
      status: 401,
      message: "Invalid API key",
    }
  }

  // Check rate limit
  const currentUsage = rateLimitMap.get(apiKey) || 0
  if (currentUsage >= RATE_LIMIT) {
    return {
      success: false,
      status: 429,
      message: "Rate limit exceeded. Please upgrade your plan for more requests.",
    }
  }

  // Increment usage counter
  rateLimitMap.set(apiKey, currentUsage + 1)

  return {
    success: true,
    apiKey,
    remainingRequests: RATE_LIMIT - (currentUsage + 1),
  }
}

export function errorResponse(status: number, message: string) {
  return NextResponse.json(
    {
      status: "error",
      message,
    },
    { status },
  )
}
