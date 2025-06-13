import { writeFile } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"
import sharp from "sharp"

export interface ProcessedImage {
  filePath: string
  outputUrl: string
  metadata?: Record<string, any>
}

export async function saveUploadedImage(formData: FormData): Promise<string> {
  const file = formData.get("image") as File

  if (!file) {
    throw new Error("No image file provided")
  }

  // Validate file type
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
  if (!validTypes.includes(file.type)) {
    throw new Error("Invalid file type. Supported formats: JPEG, PNG, WebP, GIF")
  }

  // Validate file size (10MB max)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    throw new Error("File too large. Maximum size is 10MB")
  }

  // Create a buffer from the file
  const buffer = Buffer.from(await file.arrayBuffer())

  // Generate a unique filename
  const filename = `${uuidv4()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`

  // Ensure the output directory exists
  const outputDir = join(process.cwd(), "public", "outputs")

  // Save the file
  const filePath = join(outputDir, filename)
  await writeFile(filePath, buffer)

  return filename
}

export async function compressImage(filename: string, quality = 80): Promise<ProcessedImage> {
  const inputPath = join(process.cwd(), "public", "outputs", filename)
  const outputFilename = `compressed-${uuidv4()}.jpg`
  const outputPath = join(process.cwd(), "public", "outputs", outputFilename)

  // Get original file info
  const originalInfo = await sharp(inputPath).metadata()
  const originalSize = (await sharp(inputPath).toBuffer()).length

  // Compress the image
  await sharp(inputPath).jpeg({ quality }).toFile(outputPath)

  // Get compressed file info
  const compressedSize = (await sharp(outputPath).toBuffer()).length
  const savingsPercentage = Math.round(((originalSize - compressedSize) / originalSize) * 100)

  return {
    filePath: outputPath,
    outputUrl: `/outputs/${outputFilename}`,
    metadata: {
      original_size: originalSize,
      compressed_size: compressedSize,
      savings_percentage: savingsPercentage,
      quality,
    },
  }
}

export async function resizeImage(
  filename: string,
  width: number,
  height: number,
  maintainAspectRatio = true,
): Promise<ProcessedImage> {
  const inputPath = join(process.cwd(), "public", "outputs", filename)
  const outputFilename = `resized-${uuidv4()}.jpg`
  const outputPath = join(process.cwd(), "public", "outputs", outputFilename)

  // Get original dimensions
  const metadata = await sharp(inputPath).metadata()
  const originalWidth = metadata.width || 0
  const originalHeight = metadata.height || 0

  // Resize options
  const resizeOptions: sharp.ResizeOptions = {
    width,
    height,
    fit: maintainAspectRatio ? "inside" : "fill",
  }

  // Resize the image
  await sharp(inputPath).resize(resizeOptions).toFile(outputPath)

  return {
    filePath: outputPath,
    outputUrl: `/outputs/${outputFilename}`,
    metadata: {
      original_width: originalWidth,
      original_height: originalHeight,
      new_width: width,
      new_height: height,
      maintain_aspect_ratio: maintainAspectRatio,
    },
  }
}

export async function cropImage(
  filename: string,
  x: number,
  y: number,
  width: number,
  height: number,
): Promise<ProcessedImage> {
  const inputPath = join(process.cwd(), "public", "outputs", filename)
  const outputFilename = `cropped-${uuidv4()}.jpg`
  const outputPath = join(process.cwd(), "public", "outputs", outputFilename)

  // Get original dimensions
  const metadata = await sharp(inputPath).metadata()
  const originalWidth = metadata.width || 0
  const originalHeight = metadata.height || 0

  // Crop the image
  await sharp(inputPath).extract({ left: x, top: y, width, height }).toFile(outputPath)

  return {
    filePath: outputPath,
    outputUrl: `/outputs/${outputFilename}`,
    metadata: {
      original_width: originalWidth,
      original_height: originalHeight,
      crop_x: x,
      crop_y: y,
      crop_width: width,
      crop_height: height,
    },
  }
}

export async function convertImage(filename: string, format: string, quality = 80): Promise<ProcessedImage> {
  const inputPath = join(process.cwd(), "public", "outputs", filename)
  const outputFilename = `converted-${uuidv4()}.${format}`
  const outputPath = join(process.cwd(), "public", "outputs", outputFilename)

  // Get original file info
  const originalInfo = await sharp(inputPath).metadata()
  const originalSize = (await sharp(inputPath).toBuffer()).length

  // Convert the image
  const sharpInstance = sharp(inputPath)

  switch (format) {
    case "jpeg":
    case "jpg":
      await sharpInstance.jpeg({ quality }).toFile(outputPath)
      break
    case "png":
      await sharpInstance.png().toFile(outputPath)
      break
    case "webp":
      await sharpInstance.webp({ quality }).toFile(outputPath)
      break
    default:
      throw new Error(`Unsupported format: ${format}`)
  }

  // Get converted file info
  const convertedSize = (await sharp(outputPath).toBuffer()).length

  return {
    filePath: outputPath,
    outputUrl: `/outputs/${outputFilename}`,
    metadata: {
      original_format: originalInfo.format,
      original_size: originalSize,
      converted_format: format,
      converted_size: convertedSize,
      quality: format === "png" ? undefined : quality,
    },
  }
}

export async function removeBackground(filename: string, returnFormat = "png"): Promise<ProcessedImage> {
  const inputPath = join(process.cwd(), "public", "outputs", filename)
  const outputFilename = `nobg-${uuidv4()}.${returnFormat}`
  const outputPath = join(process.cwd(), "public", "outputs", outputFilename)

  // This is a simplified version that just creates a transparent background
  // In a real implementation, you would use a proper background removal library or API

  // Create a transparent version of the image
  await sharp(inputPath)
    .ensureAlpha()
    .toFormat(returnFormat as any)
    .toFile(outputPath)

  return {
    filePath: outputPath,
    outputUrl: `/outputs/${outputFilename}`,
    metadata: {
      format: returnFormat,
    },
  }
}
