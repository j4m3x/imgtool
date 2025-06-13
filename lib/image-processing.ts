// This file contains client-side image processing functions
// For production, you would want to move heavy processing to the server

export async function resizeImage(file: File, width: number, height: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        reject(new Error("Could not get canvas context"))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error("Could not create blob from canvas"))
          }
        },
        file.type,
        0.9,
      )
    }

    img.onerror = () => {
      reject(new Error("Failed to load image"))
    }

    img.src = URL.createObjectURL(file)
  })
}

export async function compressImage(file: File, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        reject(new Error("Could not get canvas context"))
        return
      }

      ctx.drawImage(img, 0, 0)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error("Could not create blob from canvas"))
          }
        },
        file.type,
        quality / 100,
      )
    }

    img.onerror = () => {
      reject(new Error("Failed to load image"))
    }

    img.src = URL.createObjectURL(file)
  })
}

export async function cropImage(
  image: HTMLImageElement,
  crop: { x: number; y: number; width: number; height: number },
  rotation = 0,
  format = "image/jpeg",
): Promise<Blob> {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    throw new Error("Could not get canvas context")
  }

  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height

  // Set canvas dimensions to the cropped size
  canvas.width = crop.width
  canvas.height = crop.height

  // Clear canvas
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Handle rotation if needed
  if (rotation !== 0) {
    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.translate(-canvas.width / 2, -canvas.height / 2)
  }

  // Draw the cropped image
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height,
  )

  if (rotation !== 0) {
    ctx.restore()
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error("Could not create blob from canvas"))
        }
      },
      format,
      0.9,
    )
  })
}

export async function convertImage(file: File, targetFormat: string, quality = 90): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        reject(new Error("Could not get canvas context"))
        return
      }

      ctx.drawImage(img, 0, 0)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error("Could not create blob from canvas"))
          }
        },
        targetFormat,
        quality / 100,
      )
    }

    img.onerror = () => {
      reject(new Error("Failed to load image"))
    }

    img.src = URL.createObjectURL(file)
  })
}

// New functions for color adjustments

export async function adjustBrightness(file: File, brightness: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        reject(new Error("Could not get canvas context"))
        return
      }

      ctx.drawImage(img, 0, 0)

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      // Adjust brightness
      const factor = 1 + brightness / 100

      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, data[i] * factor)) // Red
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] * factor)) // Green
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] * factor)) // Blue
      }

      // Put the modified data back
      ctx.putImageData(imageData, 0, 0)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error("Could not create blob from canvas"))
          }
        },
        file.type,
        0.9,
      )
    }

    img.onerror = () => {
      reject(new Error("Failed to load image"))
    }

    img.src = URL.createObjectURL(file)
  })
}

export async function adjustContrast(file: File, contrast: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        reject(new Error("Could not get canvas context"))
        return
      }

      ctx.drawImage(img, 0, 0)

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      // Adjust contrast
      const factor = (259 * (contrast + 255)) / (255 * (259 - contrast))

      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128)) // Red
        data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128)) // Green
        data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128)) // Blue
      }

      // Put the modified data back
      ctx.putImageData(imageData, 0, 0)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error("Could not create blob from canvas"))
          }
        },
        file.type,
        0.9,
      )
    }

    img.onerror = () => {
      reject(new Error("Failed to load image"))
    }

    img.src = URL.createObjectURL(file)
  })
}

export async function applyGrayscale(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        reject(new Error("Could not get canvas context"))
        return
      }

      ctx.drawImage(img, 0, 0)

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      // Convert to grayscale
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
        data[i] = avg // Red
        data[i + 1] = avg // Green
        data[i + 2] = avg // Blue
      }

      // Put the modified data back
      ctx.putImageData(imageData, 0, 0)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error("Could not create blob from canvas"))
          }
        },
        file.type,
        0.9,
      )
    }

    img.onerror = () => {
      reject(new Error("Failed to load image"))
    }

    img.src = URL.createObjectURL(file)
  })
}
