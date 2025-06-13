"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Download, RotateCcw } from "lucide-react"
import Link from "next/link"
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ImageUploader } from "@/components/image-uploader"
import { cropImage } from "@/lib/image-processing"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const aspectRatios = [
  { label: "Free", value: undefined },
  { label: "1:1 (Square)", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "16:9", value: 16 / 9 },
  { label: "3:2", value: 3 / 2 },
  { label: "2:3", value: 2 / 3 },
  { label: "5:4", value: 5 / 4 },
]

export default function CropImagePage() {
  const [originalImage, setOriginalImage] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined)
  const [rotation, setRotation] = useState(0)

  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (originalImage) {
      const url = URL.createObjectURL(originalImage)
      setImageUrl(url)
      setProcessedImageUrl(null)

      // Reset crop and rotation when new image is selected
      setCrop(undefined)
      setCompletedCrop(undefined)
      setRotation(0)

      return () => URL.revokeObjectURL(url)
    }
  }, [originalImage])

  const handleImageSelect = (file: File) => {
    setOriginalImage(file)
  }

  const handleCrop = async () => {
    if (!originalImage || !imgRef.current || !completedCrop) return

    setIsProcessing(true)
    try {
      const croppedImageBlob = await cropImage(imgRef.current, completedCrop, rotation, originalImage.type)
      const croppedImageUrl = URL.createObjectURL(croppedImageBlob)
      setProcessedImageUrl(croppedImageUrl)
    } catch (error) {
      console.error("Error cropping image:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!processedImageUrl || !originalImage) return

    const link = document.createElement("a")
    link.href = processedImageUrl
    const fileExtension = originalImage.name.split(".").pop()
    link.download = `cropped-image.${fileExtension}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tools
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Crop Image</h1>
        <p className="mt-2 text-muted-foreground">Crop your image to the desired area and aspect ratio</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Upload Image</h2>
              {!imageUrl ? (
                <ImageUploader onImageSelect={handleImageSelect} />
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
                      <Select
                        value={aspectRatio?.toString() || "undefined"}
                        onValueChange={(value) =>
                          setAspectRatio(value === "undefined" ? undefined : Number.parseFloat(value))
                        }
                      >
                        <SelectTrigger id="aspect-ratio" className="w-[180px]">
                          <SelectValue placeholder="Select aspect ratio" />
                        </SelectTrigger>
                        <SelectContent>
                          {aspectRatios.map((ratio) => (
                            <SelectItem key={ratio.label} value={ratio.value?.toString() || "undefined"}>
                              {ratio.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="outline" size="icon" onClick={handleRotate}>
                      <RotateCcw className="h-4 w-4" />
                      <span className="sr-only">Rotate</span>
                    </Button>
                  </div>

                  <div
                    className="overflow-auto rounded-lg border"
                    style={{
                      maxHeight: "500px",
                    }}
                  >
                    <ReactCrop
                      crop={crop}
                      onChange={(c) => setCrop(c)}
                      onComplete={(c) => setCompletedCrop(c)}
                      aspect={aspectRatio}
                      className="max-h-[500px]"
                    >
                      <img
                        ref={imgRef}
                        src={imageUrl || "/placeholder.svg"}
                        alt="Original"
                        style={{
                          transform: `rotate(${rotation}deg)`,
                          maxWidth: "100%",
                          maxHeight: "100%",
                        }}
                      />
                    </ReactCrop>
                  </div>

                  <Button onClick={handleCrop} disabled={isProcessing || !completedCrop} className="w-full">
                    {isProcessing ? "Processing..." : "Crop Image"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          {processedImageUrl && (
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Result</h2>
                <div className="mb-4 overflow-hidden rounded-lg border">
                  <img
                    src={processedImageUrl || "/placeholder.svg"}
                    alt="Cropped"
                    className="h-auto w-full object-contain"
                  />
                </div>
                <Button onClick={handleDownload} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Cropped Image
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
