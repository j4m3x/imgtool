"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Download } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ImageUploader } from "@/components/image-uploader"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { adjustContrast } from "@/lib/image-processing"

export default function ContrastClientPage() {
  const [originalImage, setOriginalImage] = useState<File | null>(null)
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [contrast, setContrast] = useState<number>(0)
  const [previewContrast, setPreviewContrast] = useState<number>(0)

  const handleImageSelect = (file: File) => {
    setOriginalImage(file)
    const url = URL.createObjectURL(file)
    setOriginalImageUrl(url)
    setProcessedImageUrl(null)
    updatePreview(file, contrast)
  }

  const updatePreview = async (file: File, contrastValue: number) => {
    try {
      // Only update preview if contrast changed significantly
      if (Math.abs(contrastValue - previewContrast) < 5 && previewImageUrl) {
        return
      }

      setPreviewContrast(contrastValue)
      const adjustedImageBlob = await adjustContrast(file, contrastValue)

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

  const handleContrastChange = (newContrast: number) => {
    setContrast(newContrast)
    if (originalImage) {
      updatePreview(originalImage, newContrast)
    }
  }

  const handleAdjust = async () => {
    if (!originalImage) return

    setIsProcessing(true)
    try {
      const adjustedImageBlob = await adjustContrast(originalImage, contrast)
      const adjustedImageUrl = URL.createObjectURL(adjustedImageBlob)
      setProcessedImageUrl(adjustedImageUrl)
    } catch (error) {
      console.error("Error adjusting contrast:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!processedImageUrl || !originalImage) return

    const link = document.createElement("a")
    link.href = processedImageUrl
    const fileExtension = originalImage.name.split(".").pop()
    link.download = `contrast-adjusted.${fileExtension}`
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
        <h1 className="text-3xl font-bold">Adjust Contrast</h1>
        <p className="mt-2 text-muted-foreground">Increase or decrease the contrast of your image</p>
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
                <h2 className="mb-4 text-xl font-semibold">Contrast Options</h2>

                <div className="mb-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="contrast">Contrast: {contrast > 0 ? `+${contrast}` : contrast}</Label>
                    </div>
                    <Slider
                      id="contrast"
                      min={-100}
                      max={100}
                      step={1}
                      value={[contrast]}
                      onValueChange={(value) => handleContrastChange(value[0])}
                    />
                    <p className="text-sm text-muted-foreground">
                      Move the slider to adjust contrast. Negative values decrease contrast, positive values increase
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
                  {isProcessing ? "Processing..." : "Apply Contrast"}
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
                        alt="Contrast Adjusted"
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
