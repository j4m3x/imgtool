"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Download } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ImageUploader } from "@/components/image-uploader"
import { applyGrayscale } from "@/lib/image-processing"

export default function GrayscalePageClient() {
  const [originalImage, setOriginalImage] = useState<File | null>(null)
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleImageSelect = (file: File) => {
    setOriginalImage(file)
    const url = URL.createObjectURL(file)
    setOriginalImageUrl(url)
    setProcessedImageUrl(null)
    updatePreview(file)
  }

  const updatePreview = async (file: File) => {
    try {
      const grayscaleImageBlob = await applyGrayscale(file)
      
      // Clean up previous preview URL
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl)
      }
      
      const grayscaleImageUrl = URL.createObjectURL(grayscaleImageBlob)
      setPreviewImageUrl(grayscaleImageUrl)
    } catch (error) {
      console.error("Error generating preview:", error)
    }
  }

  const handleConvert = async () => {
    if (!originalImage) return

    setIsProcessing(true)
    try {
      const grayscaleImageBlob = await applyGrayscale(originalImage)
      const grayscaleImageUrl = URL.createObjectURL(grayscaleImageBlob)
      setProcessedImageUrl(grayscaleImageUrl)
    } catch (error) {
      console.error("Error converting to grayscale:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!processedImageUrl || !originalImage) return

    const link = document.createElement("a")
    link.href = processedImageUrl
    const fileExtension = originalImage.name.split(".").pop()
    link.download = `grayscale.${fileExtension}`
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
        <h1 className="text-3xl font-bold">Grayscale Filter</h1>
        <p className="mt-2 text-muted-foreground">Convert your image to black and white</p>
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
                <h2 className="mb-4 text-xl font-semibold">Convert to Grayscale</h2>
                <p className="mb-6 text-muted-foreground">
                  This tool will convert your color image to black and white (grayscale). Perfect for creating a
                  classic, timeless look.
                </p>

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
                        <p className="mb-1 text-center text-xs text-muted-foreground">Grayscale</p>
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

                <Button onClick={handleConvert} disabled={isProcessing || !originalImage} className="w-full">
                  {isProcessing ? "Processing..." : "Convert to Grayscale"}
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
                    <p className="mb-2 text-center text-sm font-medium">Grayscale</p>
                    <div className="overflow-hidden rounded-lg border">
                      <img
                        src={processedImageUrl || "/placeholder.svg"}
                        alt="Grayscale"
                        className="h-auto w-full object-contain"
                      />
                    </div>
                  </div>
                </div>
                <Button onClick={handleDownload} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Grayscale\
