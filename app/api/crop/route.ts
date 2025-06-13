import { type NextRequest, NextResponse } from "next/server"
import { validateApiKey, errorResponse } from "@/lib/api-middleware"
import { saveUploadedImage, cropImage } from "@/lib/process-image"
import { mkdir } from "fs/promises"
import { join } from "path"

export async function POST(request: NextRequest) {
  // Validate API key
  const auth = await validateApiKey(request)
  if (!auth.success) {
    return errorResponse(auth.status, auth.message)
  }

  try {
    // Ensure output directory exists
    await mkdir(join(process.cwd(), "public", "outputs"), { recursive: true })

    // Parse form data
    const formData = await request.formData()

    // Get parameters
    const xParam = formData.get("x")
    const yParam = formData.get("y")
    const widthParam = formData.get("width")
    const heightParam = formData.get("height")

    if (!xParam || !yParam || !widthParam || !heightParam) {
      return errorResponse(400, "x, y, width, and height parameters are required")
    }

    const x = Number.parseInt(xParam.toString(), 10)
    const y = Number.parseInt(yParam.toString(), 10)
    const width = Number.parseInt(widthParam.toString(), 10)
    const height = Number.parseInt(heightParam.toString(), 10)

    if (isNaN(x) || x < 0 || isNaN(y) || y < 0 || isNaN(width) || width < 1 || isNaN(height) || height < 1) {
      return errorResponse(
        400,
        "Invalid crop parameters. x and y must be non-negative, width and height must be positive",
      )
    }

    // Save uploaded image
    const filename = await saveUploadedImage(formData)

    // Process the image
    const result = await cropImage(filename, x, y, width, height)

    // Return response with rate limit headers
    const response = NextResponse.json({
      status: "success",
      output_url: `${request.nextUrl.origin}${result.outputUrl}`,
      metadata: result.metadata,
    })

    response.headers.set("X-RateLimit-Limit", "100")
    response.headers.set("X-RateLimit-Remaining", auth.remainingRequests.toString())

    return response
  } catch (error) {
    console.error("Error processing image:", error)
    return errorResponse(500, error instanceof Error ? error.message : "Unknown error occurred")
  }
}
