import { type NextRequest, NextResponse } from "next/server"
import { validateApiKey, errorResponse } from "@/lib/api-middleware"
import { saveUploadedImage, removeBackground } from "@/lib/process-image"
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
    const returnFormatParam = formData.get("return_format")
    const returnFormat = returnFormatParam ? returnFormatParam.toString().toLowerCase() : "png"

    const validFormats = ["png", "webp"]
    if (!validFormats.includes(returnFormat)) {
      return errorResponse(400, `Invalid return format. Supported formats: ${validFormats.join(", ")}`)
    }

    // Save uploaded image
    const filename = await saveUploadedImage(formData)

    // Process the image
    const result = await removeBackground(filename, returnFormat)

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
