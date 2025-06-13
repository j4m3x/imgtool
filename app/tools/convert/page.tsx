"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Download } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ImageUploader } from "@/components/image-uploader"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { convertImage } from "@/lib/image-processing"

const formatOptions = [
  { value: "image/jpeg", label: "JPG", extension: "jpg" },
  { value: "image/png", label: "PNG", extension: "png" },
  { value: "image/webp", label: "WebP", extension: "webp" },
]

export default function ConvertImagePage() {
  const [originalImage, setOriginalImage] = useState<File | null>(null)
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [targetFormat, setTargetFormat] = useState("image/jpeg")
  const [quality, setQuality] = useState<number>(90)
  const [originalSize, setOriginalSize] = useState<number>(0)
  const [previewSize, setPreviewSize] = useState<number>(0)
  const [convertedSize, setConvertedSize] = useState<number>(0)
  const [previewFormat, setPreviewFormat] = useState<string>("image/jpeg")
  const [previewQuality, setPreviewQuality] = useState<number>(90)

  const handleImageSelect = (file: File) => {
    setOriginalImage(file)
    const url = URL.createObjectURL(file)
    setOriginalImageUrl(url)
    setProcessedImageUrl(null)
    setOriginalSize(file.size)
    setConvertedSize(0)

    // Set a different default format than the current one
    const currentFormat = file.type
    let newFormat = "image/jpeg"

    if (currentFormat === "image/jpeg") {
      newFormat = "image/png"
    } else if (currentFormat === "image/png") {
      newFormat = "image/webp"
    }

    setTargetFormat(newFormat)
    updatePreview(file, newFormat, quality)
  }

  const updatePreview = async (file: File, format: string, qualityValue: number) => {
    try {
      // Only update preview if format or quality changed significantly
      if (format === previewFormat && Math.abs(qualityValue - previewQuality) < 5 && previewImageUrl) {
        return
      }

      setPreviewFormat(format)
      setPreviewQuality(qualityValue)

      const convertedImageBlob = await convertImage(file, format, qualityValue)

      // Clean up previous preview URL
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl)
      }

      const convertedImageUrl = URL.createObjectURL(convertedImageBlob)
      setPreviewImageUrl(convertedImageUrl)
      setPreviewSize(convertedImageBlob.size)
    } catch (error) {
      console.error("Error generating preview:", error)
    }
  }

  const handleFormatChange = (newFormat: string) => {
    setTargetFormat(newFormat)
    if (originalImage) {
      updatePreview(originalImage, newFormat, quality)
    }
  }

  const handleQualityChange = (newQuality: number) => {
    setQuality(newQuality)
    if (originalImage) {
      updatePreview(originalImage, targetFormat, newQuality)
    }
  }

  const handleConvert = async () => {
    if (!originalImage) return

    setIsProcessing(true)
    try {
      const convertedImageBlob = await convertImage(originalImage, targetFormat, quality)
      const convertedImageUrl = URL.createObjectURL(convertedImageBlob)
      setProcessedImageUrl(convertedImageUrl)
      setConvertedSize(convertedImageBlob.size)
    } catch (error) {
      console.error("Error converting image:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!processedImageUrl || !originalImage) return

    const link = document.createElement("a")
    link.href = processedImageUrl
    const extension = formatOptions.find((f) => f.value === targetFormat)?.extension || "jpg"
    const fileName = originalImage.name.split(".")[0] || "converted"
    link.download = `${fileName}.${extension}`
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

  const showQualitySlider = targetFormat === "image/jpeg" || targetFormat === "image/webp"

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
        <h1 className="text-3xl font-bold">Convert Image Format</h1>
        <p className="mt-2 text-muted-foreground">Convert your image to different formats (JPG, PNG, WebP)</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Upload Image</h2>
              <ImageUploader
                onImageSelect={handleImageSelect}
                acceptedFileTypes={["image/jpeg", "image/png", "image/webp", "image/gif"]}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          {originalImage && (
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Conversion Options</h2>

                <div className="mb-6 space-y-4">
                  <div className="space-y-2">
                    <Label>Target Format</Label>
                    <RadioGroup
                      value={targetFormat}
                      onValueChange={handleFormatChange}
                      className="flex flex-wrap gap-4"
                    >
                      {formatOptions.map((format) => (
                        <div key={format.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={format.value} id={format.value} />
                          <Label htmlFor={format.value}>{format.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {showQualitySlider && (
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
                  )}
                </div>

                <div className="mb-6 rounded-lg bg-muted p-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Original format:</div>
                    <div className="text-right font-medium">{originalImage.type.split("/")[1].toUpperCase()}</div>

                    <div>Original size:</div>
                    <div className="text-right font-medium">{formatFileSize(originalSize)}</div>

                    {previewSize > 0 && (
                      <>
                        <div>Estimated size:</div>
                        <div className="text-right font-medium">{formatFileSize(previewSize)}</div>
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
                        <p className="mb-1 text-center text-xs text-muted-foreground">
                          Converted ({targetFormat.split("/")[1].toUpperCase()})
                        </p>
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
                  {isProcessing ? "Processing..." : "Convert Image"}
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
                    alt="Converted"
                    className="h-auto w-full object-contain"
                  />
                </div>
                <div className="mb-4 rounded-lg bg-muted p-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Original format:</div>
                    <div className="text-right font-medium">{originalImage.type.split("/")[1].toUpperCase()}</div>

                    <div>Converted format:</div>
                    <div className="text-right font-medium">{targetFormat.split("/")[1].toUpperCase()}</div>

                    <div>Original size:</div>
                    <div className="text-right font-medium">{formatFileSize(originalSize)}</div>

                    <div>Converted size:</div>
                    <div className="text-right font-medium">{formatFileSize(convertedSize)}</div>
                  </div>
                </div>
                <Button onClick={handleDownload} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Converted Image
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
