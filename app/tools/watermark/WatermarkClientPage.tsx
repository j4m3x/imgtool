"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Download, ImageIcon, Type, Move, InfoIcon as Transparency } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ImageUploader } from "@/components/image-uploader"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ColorPicker } from "@/components/color-picker"

export default function WatermarkClientPage() {
  const [originalImage, setOriginalImage] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [watermarkType, setWatermarkType] = useState<"text" | "image">("text")
  const [watermarkText, setWatermarkText] = useState("Watermark")
  const [watermarkImage, setWatermarkImage] = useState<File | null>(null)
  const [watermarkImageUrl, setWatermarkImageUrl] = useState<string | null>(null)
  const [fontSize, setFontSize] = useState(30)
  const [textColor, setTextColor] = useState("#ffffff")
  const [opacity, setOpacity] = useState(50)
  const [position, setPosition] = useState<
    "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center" | "custom"
  >("bottom-right")
  const [watermarkX, setWatermarkX] = useState(80) // percentage
  const [watermarkY, setWatermarkY] = useState(80) // percentage
  const [watermarkSize, setWatermarkSize] = useState(30) // percentage of image width
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragStartY, setDragStartY] = useState(0)
  const [activeTab, setActiveTab] = useState("content")

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const watermarkImageRef = useRef<HTMLImageElement | null>(null)

  const handleImageSelect = (file: File) => {
    setOriginalImage(file)
    const url = URL.createObjectURL(file)
    setImageUrl(url)

    // Create an image element to get dimensions
    const img = new Image()
    img.onload = () => {
      imageRef.current = img
      renderCanvas()
    }
    img.src = url
  }

  const handleWatermarkImageSelect = (file: File) => {
    setWatermarkImage(file)
    const url = URL.createObjectURL(file)
    setWatermarkImageUrl(url)

    // Create an image element to get dimensions
    const img = new Image()
    img.onload = () => {
      watermarkImageRef.current = img
      renderCanvas()
    }
    img.src = url
  }

  const updatePositionFromPreset = (pos: typeof position) => {
    setPosition(pos)

    switch (pos) {
      case "top-left":
        setWatermarkX(10)
        setWatermarkY(10)
        break
      case "top-right":
        setWatermarkX(90)
        setWatermarkY(10)
        break
      case "bottom-left":
        setWatermarkX(10)
        setWatermarkY(90)
        break
      case "bottom-right":
        setWatermarkX(90)
        setWatermarkY(90)
        break
      case "center":
        setWatermarkX(50)
        setWatermarkY(50)
        break
    }
  }

  const renderCanvas = () => {
    if (!canvasRef.current || !imageRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = imageRef.current

    // Set canvas dimensions to match image
    canvas.width = img.width
    canvas.height = img.height

    // Draw image
    ctx.drawImage(img, 0, 0)

    // Apply watermark
    ctx.save()

    // Set global alpha for transparency
    ctx.globalAlpha = opacity / 100

    // Calculate position
    const x = (watermarkX / 100) * canvas.width
    const y = (watermarkY / 100) * canvas.height

    if (watermarkType === "text") {
      // Draw text watermark
      const fontSize2 = (fontSize / 100) * canvas.width
      ctx.font = `${fontSize2}px Arial`
      ctx.fillStyle = textColor
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(watermarkText, x, y)
    } else if (watermarkType === "image" && watermarkImageRef.current) {
      // Draw image watermark
      const watermarkImg = watermarkImageRef.current
      const watermarkWidth = (watermarkSize / 100) * canvas.width
      const aspectRatio = watermarkImg.height / watermarkImg.width
      const watermarkHeight = watermarkWidth * aspectRatio

      ctx.drawImage(watermarkImg, x - watermarkWidth / 2, y - watermarkHeight / 2, watermarkWidth, watermarkHeight)
    }

    ctx.restore()
  }

  useEffect(() => {
    renderCanvas()
  }, [
    watermarkType,
    watermarkText,
    fontSize,
    textColor,
    opacity,
    watermarkX,
    watermarkY,
    watermarkSize,
    watermarkImageUrl,
  ])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    const mouseX = (e.clientX - rect.left) * scaleX
    const mouseY = (e.clientY - rect.top) * scaleY

    // Calculate position
    const x = (watermarkX / 100) * canvas.width
    const y = (watermarkY / 100) * canvas.height

    // Check if click is near watermark
    let hitArea = false

    if (watermarkType === "text") {
      const textWidth = fontSize * watermarkText.length * 0.6 // Rough estimate
      const textHeight = fontSize

      hitArea =
        mouseX > x - textWidth / 2 &&
        mouseX < x + textWidth / 2 &&
        mouseY > y - textHeight / 2 &&
        mouseY < y + textHeight / 2
    } else if (watermarkType === "image" && watermarkImageRef.current) {
      const watermarkImg = watermarkImageRef.current
      const watermarkWidth = (watermarkSize / 100) * canvas.width
      const aspectRatio = watermarkImg.height / watermarkImg.width
      const watermarkHeight = watermarkWidth * aspectRatio

      hitArea =
        mouseX > x - watermarkWidth / 2 &&
        mouseX < x + watermarkWidth / 2 &&
        mouseY > y - watermarkHeight / 2 &&
        mouseY < y + watermarkHeight / 2
    }

    if (hitArea) {
      setIsDragging(true)
      setDragStartX(mouseX)
      setDragStartY(mouseY)
      setPosition("custom")
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !canvasRef.current) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    const mouseX = (e.clientX - rect.left) * scaleX
    const mouseY = (e.clientY - rect.top) * scaleY

    const deltaX = mouseX - dragStartX
    const deltaY = mouseY - dragStartY

    // Update position as percentage
    const newX = Math.max(0, Math.min(100, watermarkX + (deltaX / canvas.width) * 100))
    const newY = Math.max(0, Math.min(100, watermarkY + (deltaY / canvas.height) * 100))

    setWatermarkX(newX)
    setWatermarkY(newY)
    setDragStartX(mouseX)
    setDragStartY(mouseY)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleDownload = () => {
    if (!canvasRef.current || !originalImage) return

    const canvas = canvasRef.current

    canvas.toBlob((blob) => {
      if (!blob) return

      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `watermarked-${originalImage.name}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    })
  }

  return (
    <div className="mx-auto py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tools
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Add Watermark</h1>
        <p className="mt-2 text-muted-foreground">Add text or image watermarks to your images</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Upload Image</h2>
              {!imageUrl ? (
                <ImageUploader onImageSelect={handleImageSelect} />
              ) : (
                <div className="relative rounded-lg border overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-auto cursor-move"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  />
                  <div className="absolute bottom-2 right-2 bg-background/80 text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                    Drag watermark to reposition
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          {imageUrl && (
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Watermark Options</h2>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="content" className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Content
                    </TabsTrigger>
                    <TabsTrigger value="style" className="flex items-center gap-2">
                      <Transparency className="h-4 w-4" />
                      Style
                    </TabsTrigger>
                    <TabsTrigger value="position" className="flex items-center gap-2">
                      <Move className="h-4 w-4" />
                      Position
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Watermark Type</Label>
                      <RadioGroup
                        value={watermarkType}
                        onValueChange={(value) => setWatermarkType(value as "text" | "image")}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="text" id="watermark-text" />
                          <Label htmlFor="watermark-text" className="flex items-center gap-2">
                            <Type className="h-4 w-4" /> Text
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="image" id="watermark-image" />
                          <Label htmlFor="watermark-image" className="flex items-center gap-2">
                            <ImageIcon className="h-4 w-4" /> Image
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {watermarkType === "text" ? (
                      <div className="space-y-2">
                        <Label htmlFor="watermark-text-input">Watermark Text</Label>
                        <Input
                          id="watermark-text-input"
                          value={watermarkText}
                          onChange={(e) => setWatermarkText(e.target.value)}
                          placeholder="Enter watermark text"
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label>Watermark Image</Label>
                        <ImageUploader onImageSelect={handleWatermarkImageSelect} maxSizeMB={2} className="h-auto" />
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="style" className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="opacity">Opacity: {opacity}%</Label>
                      </div>
                      <Slider
                        id="opacity"
                        min={10}
                        max={100}
                        step={1}
                        value={[opacity]}
                        onValueChange={(value) => setOpacity(value[0])}
                      />
                    </div>

                    {watermarkType === "text" ? (
                      <>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="font-size">Font Size: {fontSize}%</Label>
                          </div>
                          <Slider
                            id="font-size"
                            min={1}
                            max={50}
                            step={1}
                            value={[fontSize]}
                            onValueChange={(value) => setFontSize(value[0])}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="text-color">Text Color</Label>
                          <ColorPicker color={textColor} onChange={setTextColor} />
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="watermark-size">Size: {watermarkSize}%</Label>
                        </div>
                        <Slider
                          id="watermark-size"
                          min={5}
                          max={50}
                          step={1}
                          value={[watermarkSize]}
                          onValueChange={(value) => setWatermarkSize(value[0])}
                        />
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="position" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Preset Positions</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant={position === "top-left" ? "default" : "outline"}
                          size="sm"
                          onClick={() => updatePositionFromPreset("top-left")}
                        >
                          Top Left
                        </Button>
                        <Button
                          variant={position === "top-right" ? "default" : "outline"}
                          size="sm"
                          onClick={() => updatePositionFromPreset("top-right")}
                        >
                          Top Right
                        </Button>
                        <Button
                          variant={position === "center" ? "default" : "outline"}
                          size="sm"
                          onClick={() => updatePositionFromPreset("center")}
                        >
                          Center
                        </Button>
                        <Button
                          variant={position === "bottom-left" ? "default" : "outline"}
                          size="sm"
                          onClick={() => updatePositionFromPreset("bottom-left")}
                        >
                          Bottom Left
                        </Button>
                        <Button
                          variant={position === "bottom-right" ? "default" : "outline"}
                          size="sm"
                          onClick={() => updatePositionFromPreset("bottom-right")}
                        >
                          Bottom Right
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="position-x">Horizontal Position: {watermarkX.toFixed(0)}%</Label>
                      </div>
                      <Slider
                        id="position-x"
                        min={0}
                        max={100}
                        step={1}
                        value={[watermarkX]}
                        onValueChange={(value) => {
                          setWatermarkX(value[0])
                          setPosition("custom")
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="position-y">Vertical Position: {watermarkY.toFixed(0)}%</Label>
                      </div>
                      <Slider
                        id="position-y"
                        min={0}
                        max={100}
                        step={1}
                        value={[watermarkY]}
                        onValueChange={(value) => {
                          setWatermarkY(value[0])
                          setPosition("custom")
                        }}
                      />
                    </div>

                    <div className="mt-4 p-3 bg-muted rounded-md">
                      <p className="text-sm text-muted-foreground">
                        Tip: You can also drag the watermark directly on the image to position it.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                <Button onClick={handleDownload} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Watermarked Image
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
