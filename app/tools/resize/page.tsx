"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Download } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ImageUploader } from "@/components/image-uploader"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { resizeImage } from "@/lib/image-processing"
import { DownloadButton } from "@/components/download-button"

export default function ResizeImagePage() {
  const [originalImage, setOriginalImage] = useState<File | null>(null)
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [width, setWidth] = useState<number>(800)
  const [height, setHeight] = useState<number>(600)
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true)
  const [scalePercentage, setScalePercentage] = useState<number>(100)
  const [resizeMethod, setResizeMethod] = useState<"dimensions" | "percentage">("dimensions")
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null)
  const [previewDimensions, setPreviewDimensions] = useState<{ width: number; height: number } | null>(null)

  const handleImageSelect = (file: File) => {
    setOriginalImage(file)
    const url = URL.createObjectURL(file)
    setOriginalImageUrl(url)
    setProcessedImageUrl(null)

    // Get image dimensions to set as default
    const img = new Image()
    img.onload = () => {
      setOriginalDimensions({ width: img.width, height: img.height })
      setWidth(img.width)
      setHeight(img.height)
      updatePreview(img.width, img.height, file)
    }
    img.src = url
  }

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth)
    if (maintainAspectRatio && originalDimensions) {
      const aspectRatio = originalDimensions.width / originalDimensions.height
      const newHeight = Math.round(newWidth / aspectRatio)
      setHeight(newHeight)
      updatePreview(newWidth, newHeight)
    } else {
      updatePreview(newWidth, height)
    }
  }

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight)
    if (maintainAspectRatio && originalDimensions) {
      const aspectRatio = originalDimensions.width / originalDimensions.height
      const newWidth = Math.round(newHeight * aspectRatio)
      setWidth(newWidth)
      updatePreview(newWidth, newHeight)
    } else {
      updatePreview(width, newHeight)
    }
  }

  const handleAspectRatioChange = (checked: boolean) => {
    setMaintainAspectRatio(checked)
    if (checked && originalDimensions) {
      const aspectRatio = originalDimensions.width / originalDimensions.height
      const newHeight = Math.round(width / aspectRatio)
      setHeight(newHeight)
      updatePreview(width, newHeight)
    }
  }

  const handleScaleChange = (newScale: number) => {
    setScalePercentage(newScale)
    if (originalDimensions) {
      const newWidth = Math.round((originalDimensions.width * newScale) / 100)
      const newHeight = Math.round((originalDimensions.height * newScale) / 100)
      updatePreview(newWidth, newHeight)
    }
  }

  const updatePreview = async (previewWidth: number, previewHeight: number, imageFile?: File) => {
    if (!originalImage && !imageFile) return

    try {
      const targetFile = imageFile || originalImage
      if (!targetFile) return

      setPreviewDimensions({ width: previewWidth, height: previewHeight })

      // Only generate preview if dimensions are reasonable (to avoid browser hanging)
      if (previewWidth > 0 && previewHeight > 0 && previewWidth < 3000 && previewHeight < 3000) {
        const resizedImageBlob = await resizeImage(targetFile, previewWidth, previewHeight)
        const resizedImageUrl = URL.createObjectURL(resizedImageBlob)

        // Clean up previous preview URL
        if (previewImageUrl) {
          URL.revokeObjectURL(previewImageUrl)
        }

        setPreviewImageUrl(resizedImageUrl)
      }
    } catch (error) {
      console.error("Error generating preview:", error)
    }
  }

  const handleResize = async () => {
    if (!originalImage) return

    setIsProcessing(true)
    try {
      let targetWidth: number
      let targetHeight: number

      if (resizeMethod === "dimensions") {
        targetWidth = width
        targetHeight = height
      } else {
        // Calculate dimensions based on percentage
        if (!originalDimensions) return
        targetWidth = Math.round((originalDimensions.width * scalePercentage) / 100)
        targetHeight = Math.round((originalDimensions.height * scalePercentage) / 100)
      }

      const resizedImageBlob = await resizeImage(originalImage, targetWidth, targetHeight)
      const resizedImageUrl = URL.createObjectURL(resizedImageBlob)
      setProcessedImageUrl(resizedImageUrl)
    } catch (error) {
      console.error("Error resizing image:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!processedImageUrl || !originalImage) return

    const link = document.createElement("a")
    link.href = processedImageUrl
    const fileExtension = originalImage.name.split(".").pop()
    link.download = `resized-image.${fileExtension}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Update preview when resize method changes
  useEffect(() => {
    if (resizeMethod === "percentage" && originalDimensions) {
      const newWidth = Math.round((originalDimensions.width * scalePercentage) / 100)
      const newHeight = Math.round((originalDimensions.height * scalePercentage) / 100)
      updatePreview(newWidth, newHeight)
    }
  }, [resizeMethod])

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
        <h1 className="text-3xl font-bold">Resize Image</h1>
        <p className="mt-2 text-muted-foreground">Change the dimensions of your image while maintaining quality</p>
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
                <h2 className="mb-4 text-xl font-semibold">Resize Options</h2>

                <Tabs
                  value={resizeMethod}
                  onValueChange={(v) => setResizeMethod(v as "dimensions" | "percentage")}
                  className="mb-6"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="dimensions">Custom Dimensions</TabsTrigger>
                    <TabsTrigger value="percentage">Percentage</TabsTrigger>
                  </TabsList>
                  <TabsContent value="dimensions" className="mt-4 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="width">Width (px)</Label>
                        <Input
                          id="width"
                          type="number"
                          min="1"
                          value={width}
                          onChange={(e) => handleWidthChange(Number.parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="height">Height (px)</Label>
                        <Input
                          id="height"
                          type="number"
                          min="1"
                          value={height}
                          onChange={(e) => handleHeightChange(Number.parseInt(e.target.value) || 1)}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="aspectRatio"
                        checked={maintainAspectRatio}
                        onCheckedChange={(checked) => handleAspectRatioChange(!!checked)}
                      />
                      <Label htmlFor="aspectRatio">Maintain aspect ratio</Label>
                    </div>
                  </TabsContent>
                  <TabsContent value="percentage" className="mt-4 space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="percentage">Scale: {scalePercentage}%</Label>
                        </div>
                        <Slider
                          id="percentage"
                          min={1}
                          max={200}
                          step={1}
                          value={[scalePercentage]}
                          onValueChange={(value) => handleScaleChange(value[0])}
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

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
                          {originalDimensions && (
                            <p className="bg-muted px-2 py-1 text-center text-xs text-muted-foreground">
                              {originalDimensions.width} × {originalDimensions.height}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="mb-1 text-center text-xs text-muted-foreground">Resized</p>
                        <div className="overflow-hidden rounded-lg border">
                          <img
                            src={previewImageUrl || "/placeholder.svg"}
                            alt="Preview"
                            className="h-auto w-full object-contain"
                          />
                          {previewDimensions && (
                            <p className="bg-muted px-2 py-1 text-center text-xs text-muted-foreground">
                              {previewDimensions.width} × {previewDimensions.height}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <Button onClick={handleResize} disabled={isProcessing || !originalImage} className="w-full">
                  {isProcessing ? "Processing..." : "Resize Image"}
                </Button>
              </CardContent>
            </Card>
          )}

          {processedImageUrl && (
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Result</h2>
                <div className="mb-4 overflow-hidden rounded-lg border">
                  <img
                    src={processedImageUrl || "/placeholder.svg"}
                    alt="Resized"
                    className="h-auto w-full object-contain"
                  />
                  {previewDimensions && (
                    <p className="bg-muted px-2 py-1 text-center text-xs text-muted-foreground">
                      {previewDimensions.width} × {previewDimensions.height}
                    </p>
                  )}
                </div>

                {/* Replace the original download button with our new component */}
                <DownloadButton onDownload={handleDownload} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Resized Image
                </DownloadButton>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
