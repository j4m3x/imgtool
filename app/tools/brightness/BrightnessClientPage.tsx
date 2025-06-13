"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Download } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ImageUploader } from "@/components/image-uploader"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { adjustBrightness } from "@/lib/image-processing"

export default function BrightnessClientPage() {
  const [originalImage, setOriginalImage] = useState<File | null>(null)
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [brightness, setBrightness] = useState<number>(0)
  const [previewBrightness, setPreviewBrightness] = useState<number>(0)

  const handleImageSelect = (file: File) => {
    setOriginalImage(file)
    const url = URL.createObjectURL(file)
    setOriginalImageUrl(url)
    setProcessedImageUrl(null)
    updatePreview(file, brightness)
  }

  const updatePreview = async (file: File, brightnessValue: number) => {
    try {
      // Only update preview if brightness changed significantly
      if (Math.abs(brightnessValue - previewBrightness) < 5 && previewImageUrl) {
        return
      }

      setPreviewBrightness(brightnessValue)
      const adjustedImageBlob = await adjustBrightness(file, brightnessValue)

      // Clean up previous preview URL
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl)
      }

      const adjustedImageUrl = URL.createObjectURL(adjustedImageBlob)
      setPreviewImageUrl(adjustedImageUrl)
    } catch (error) {
      console.error("Error generating preview:", error)
    }
  }

  const handleBrightnessChange = (newBrightness: number) => {
    setBrightness(newBrightness)
    if (originalImage) {
      updatePreview(originalImage, newBrightness)
    }
  }

  const handleAdjust = async () => {
    if (!originalImage) return

    setIsProcessing(true)
    try {
      const adjustedImageBlob = await adjustBrightness(originalImage, brightness)
      const adjustedImageUrl = URL.createObjectURL(adjustedImageBlob)
      setProcessedImageUrl(adjustedImageUrl)
    } catch (error) {
      console.error("Error adjusting brightness:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!processedImageUrl || !originalImage) return

    const link = document.createElement("a")
    link.href = processedImageUrl
    const fileExtension = originalImage.name.split(".").pop()
    link.download = `brightness-adjusted.${fileExtension}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Clean up URLs on unmount
  useEffect(() => {
    return () => {
      if (originalImageUrl) URL.revokeObjectURL(originalImageUrl)
      if (previewImageUrl) URL.revokeObjectURL(previewImageUrl)
      if (processedImageUrl) URL.revokeObjectURL(processedImageUrl)
    }
  }, [originalImageUrl, previewImageUrl, processedImageUrl])

  return (
    <div className="mx-auto py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tools
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Adjust Brightness</h1>
        <p className="mt-2 text-muted-foreground">Increase or decrease the brightness of your image</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Upload Image</h2>
              <ImageUploader onImageSelect={handleImageSelect} />
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          {originalImage && (
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Brightness Options</h2>

                <div className="mb-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="brightness">Brightness: {brightness > 0 ? `+${brightness}` : brightness}</Label>
                    </div>
                    <Slider
                      id="brightness"
                      min={-100}
                      max={100}
                      step={1}
                      value={[brightness]}
                      onValueChange={(value) => handleBrightnessChange(value[0])}
                    />
                    <p className="text-sm text-muted-foreground">
                      Move the slider to adjust brightness. Negative values darken the image, positive values brighten
                      it.
                    </p>
                  </div>
                </div>

                {/* Preview Section */}
                {previewImageUrl && (
                  <div className="mb-6">
                    <h3 className="mb-2 text-sm font-medium">Preview</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="mb-1 text-center text-xs text-muted-foreground">Original</p>
                        <div className="overflow-hidden rounded-lg border">
                          <img
                            src={originalImageUrl || "/placeholder.svg"}
                            alt="Original"
                            className="h-auto w-full object-contain"
                          />
                        </div>
                      </div>
                      <div>
                        <p className="mb-1 text-center text-xs text-muted-foreground">Adjusted</p>
                        <div className="overflow-hidden rounded-lg border">
                          <img
                            src={previewImageUrl || "/placeholder.svg"}
                            alt="Preview"
                            className="h-auto w-full object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <Button onClick={handleAdjust} disabled={isProcessing || !originalImage} className="w-full">
                  {isProcessing ? "Processing..." : "Apply Brightness"}
                </Button>
              </CardContent>
            </Card>
          )}

          {processedImageUrl && (
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Result</h2>
                <div className="mb-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="mb-2 text-center text-sm font-medium">Original</p>
                    <div className="overflow-hidden rounded-lg border">
                      <img
                        src={originalImageUrl || "/placeholder.svg"}
                        alt="Original"
                        className="h-auto w-full object-contain"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-center text-sm font-medium">Adjusted</p>
                    <div className="overflow-hidden rounded-lg border">
                      <img
                        src={processedImageUrl || "/placeholder.svg"}
                        alt="Brightness Adjusted"
                        className="h-auto w-full object-contain"
                      />
                    </div>
                  </div>
                </div>
                <Button onClick={handleDownload} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Adjusted Image
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
