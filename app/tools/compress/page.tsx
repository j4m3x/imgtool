"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Download } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ImageUploader } from "@/components/image-uploader"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { compressImage } from "@/lib/image-processing"
import { DownloadButton } from "@/components/download-button"

export default function CompressImagePage() {
  const [originalImage, setOriginalImage] = useState<File | null>(null)
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [quality, setQuality] = useState<number>(80)
  const [originalSize, setOriginalSize] = useState<number>(0)
  const [previewSize, setPreviewSize] = useState<number>(0)
  const [compressedSize, setCompressedSize] = useState<number>(0)
  const [previewQuality, setPreviewQuality] = useState<number>(80)

  const handleImageSelect = (file: File) => {
    setOriginalImage(file)
    const url = URL.createObjectURL(file)
    setOriginalImageUrl(url)
    setProcessedImageUrl(null)
    setOriginalSize(file.size)
    setCompressedSize(0)
    updatePreview(file, quality)
  }

  const updatePreview = async (file: File, qualityValue: number) => {
    try {
      // Only update preview every 5% change to avoid too many re-renders
      if (Math.abs(qualityValue - previewQuality) < 5 && previewImageUrl) {
        return
      }

      setPreviewQuality(qualityValue)
      const compressedImageBlob = await compressImage(file, qualityValue)

      // Clean up previous preview URL
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl)
      }

      const compressedImageUrl = URL.createObjectURL(compressedImageBlob)
      setPreviewImageUrl(compressedImageUrl)
      setPreviewSize(compressedImageBlob.size)
    } catch (error) {
      console.error("Error generating preview:", error)
    }
  }

  const handleQualityChange = (newQuality: number) => {
    setQuality(newQuality)
    if (originalImage) {
      updatePreview(originalImage, newQuality)
    }
  }

  const handleCompress = async () => {
    if (!originalImage) return

    setIsProcessing(true)
    try {
      const compressedImageBlob = await compressImage(originalImage, quality)
      const compressedImageUrl = URL.createObjectURL(compressedImageBlob)
      setProcessedImageUrl(compressedImageUrl)
      setCompressedSize(compressedImageBlob.size)
    } catch (error) {
      console.error("Error compressing image:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!processedImageUrl || !originalImage) return

    const link = document.createElement("a")
    link.href = processedImageUrl
    link.download = `compressed-${originalImage.name}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const calculateSavings = (original: number, compressed: number): string => {
    if (original === 0 || compressed === 0) return "0%"
    const savings = ((original - compressed) / original) * 100
    return `${savings.toFixed(1)}%`
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
        <h1 className="text-3xl font-bold">Compress Image</h1>
        <p className="mt-2 text-muted-foreground">Reduce file size while maintaining image quality</p>
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
                <h2 className="mb-4 text-xl font-semibold">Compression Options</h2>

                <div className="mb-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="quality">Quality: {quality}%</Label>
                    </div>
                    <Slider
                      id="quality"
                      min={1}
                      max={100}
                      step={1}
                      value={[quality]}
                      onValueChange={(value) => handleQualityChange(value[0])}
                    />
                    <p className="text-sm text-muted-foreground">Lower quality = smaller file size</p>
                  </div>
                </div>

                <div className="mb-6 rounded-lg bg-muted p-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Original size:</div>
                    <div className="text-right font-medium">{formatFileSize(originalSize)}</div>

                    {previewSize > 0 && (
                      <>
                        <div>Estimated size:</div>
                        <div className="text-right font-medium">{formatFileSize(previewSize)}</div>

                        <div>Estimated savings:</div>
                        <div className="text-right font-medium text-green-500">
                          {calculateSavings(originalSize, previewSize)}
                        </div>
                      </>
                    )}
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
                        <p className="mb-1 text-center text-xs text-muted-foreground">Compressed</p>
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

                <Button onClick={handleCompress} disabled={isProcessing || !originalImage} className="w-full">
                  {isProcessing ? "Processing..." : "Compress Image"}
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
                    alt="Compressed"
                    className="h-auto w-full object-contain"
                  />
                </div>
                <div className="mb-4 rounded-lg bg-muted p-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Original size:</div>
                    <div className="text-right font-medium">{formatFileSize(originalSize)}</div>

                    <div>Compressed size:</div>
                    <div className="text-right font-medium">{formatFileSize(compressedSize)}</div>

                    <div>Savings:</div>
                    <div className="text-right font-medium text-green-500">
                      {calculateSavings(originalSize, compressedSize)}
                    </div>
                  </div>
                </div>

                {/* Replace the original download button with our new component */}
                <DownloadButton onDownload={handleDownload} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Compressed Image
                </DownloadButton>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
