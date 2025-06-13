import { type NextRequest, NextResponse } from "next/server"
import { validateApiKey, errorResponse } from "@/lib/api-middleware"
import { saveUploadedImage, convertImage } from "@/lib/process-image"
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
    const formatParam = formData.get("format")
    const qualityParam = formData.get("quality")

    if (!formatParam) {
      return errorResponse(400, "Format parameter is required")
    }

    const format = formatParam.toString().toLowerCase()
    const quality = qualityParam ? Number.parseInt(qualityParam.toString(), 10) : 80

    const validFormats = ["jpeg", "jpg", "png", "webp"]
    if (!validFormats.includes(format)) {
      return errorResponse(400, `Invalid format. Supported formats: ${validFormats.join(", ")}`)
    }

    if (isNaN(quality) || quality < 1 || quality > 100) {
      return errorResponse(400, "Quality must be a number between 1 and 100")
    }

    // Save uploaded image
    const filename = await saveUploadedImage(formData)

    // Process the image
    const result = await convertImage(filename, format, quality)

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
