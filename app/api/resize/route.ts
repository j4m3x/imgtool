import { type NextRequest, NextResponse } from "next/server"
import { validateApiKey, errorResponse } from "@/lib/api-middleware"
import { saveUploadedImage, resizeImage } from "@/lib/process-image"
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
    const widthParam = formData.get("width")
    const heightParam = formData.get("height")
    const maintainAspectRatioParam = formData.get("maintain_aspect_ratio")

    if (!widthParam || !heightParam) {
      return errorResponse(400, "Width and height parameters are required")
    }

    const width = Number.parseInt(widthParam.toString(), 10)
    const height = Number.parseInt(heightParam.toString(), 10)
    const maintainAspectRatio = maintainAspectRatioParam !== "false"

    if (isNaN(width) || width < 1 || isNaN(height) || height < 1) {
      return errorResponse(400, "Width and height must be positive numbers")
    }

    // Save uploaded image
    const filename = await saveUploadedImage(formData)

    // Process the image
    const result = await resizeImage(filename, width, height, maintainAspectRatio)

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
