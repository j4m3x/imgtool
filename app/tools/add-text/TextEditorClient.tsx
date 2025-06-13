"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Download, Type, Move, Palette } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ImageUploader } from "@/components/image-uploader"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ColorPicker } from "@/components/color-picker"

export default function TextEditorClient() {
  const [originalImage, setOriginalImage] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [text, setText] = useState("Your Text Here")
  const [fontSize, setFontSize] = useState(40)
  const [textColor, setTextColor] = useState("#ffffff")
  const [textOutlineColor, setTextOutlineColor] = useState("#000000")
  const [textOutlineWidth, setTextOutlineWidth] = useState(0)
  const [textX, setTextX] = useState(50) // percentage
  const [textY, setTextY] = useState(50) // percentage
  const [fontFamily, setFontFamily] = useState("Arial")
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragStartY, setDragStartY] = useState(0)
  const [activeTab, setActiveTab] = useState("text")

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)

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

    // Draw text
    ctx.save()

    // Set font properties
    ctx.font = `${fontSize}px ${fontFamily}`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Calculate position
    const x = (textX / 100) * canvas.width
    const y = (textY / 100) * canvas.height

    // Draw text outline if needed
    if (textOutlineWidth > 0) {
      ctx.strokeStyle = textOutlineColor
      ctx.lineWidth = textOutlineWidth
      ctx.strokeText(text, x, y)
    }

    // Draw text
    ctx.fillStyle = textColor
    ctx.fillText(text, x, y)

    ctx.restore()
  }

  useEffect(() => {
    renderCanvas()
  }, [text, fontSize, textColor, textOutlineColor, textOutlineWidth, textX, textY, fontFamily])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    const mouseX = (e.clientX - rect.left) * scaleX
    const mouseY = (e.clientY - rect.top) * scaleY

    // Calculate position as percentage
    const x = (textX / 100) * canvas.width
    const y = (textY / 100) * canvas.height

    // Check if click is near text
    const textWidth = fontSize * text.length * 0.6 // Rough estimate
    const textHeight = fontSize

    if (
      mouseX > x - textWidth / 2 &&
      mouseX < x + textWidth / 2 &&
      mouseY > y - textHeight / 2 &&
      mouseY < y + textHeight / 2
    ) {
      setIsDragging(true)
      setDragStartX(mouseX)
      setDragStartY(mouseY)
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
    const newX = Math.max(0, Math.min(100, textX + (deltaX / canvas.width) * 100))
    const newY = Math.max(0, Math.min(100, textY + (deltaY / canvas.height) * 100))

    setTextX(newX)
    setTextY(newY)
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
      link.download = `text-added-${originalImage.name}`
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
        <h1 className="text-3xl font-bold">Add Text to Image</h1>
        <p className="mt-2 text-muted-foreground">Add custom text to your images with various styling options</p>
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
                    Drag text to reposition
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
                <h2 className="mb-4 text-xl font-semibold">Text Options</h2>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="text" className="flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      Text
                    </TabsTrigger>
                    <TabsTrigger value="style" className="flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Style
                    </TabsTrigger>
                    <TabsTrigger value="position" className="flex items-center gap-2">
                      <Move className="h-4 w-4" />
                      Position
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="text" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="text">Text</Label>
                      <Input
                        id="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter your text"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="font-family">Font</Label>
                      <select
                        id="font-family"
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="Arial">Arial</option>
                        <option value="Verdana">Verdana</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Courier New">Courier New</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Impact">Impact</option>
                      </select>
                    </div>
                  </TabsContent>

                  <TabsContent value="style" className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="font-size">Font Size: {fontSize}px</Label>
                      </div>
                      <Slider
                        id="font-size"
                        min={10}
                        max={200}
                        step={1}
                        value={[fontSize]}
                        onValueChange={(value) => setFontSize(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="text-color">Text Color</Label>
                      <ColorPicker color={textColor} onChange={setTextColor} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="outline-color">Outline Color</Label>
                      <ColorPicker color={textOutlineColor} onChange={setTextOutlineColor} />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="outline-width">Outline Width: {textOutlineWidth}px</Label>
                      </div>
                      <Slider
                        id="outline-width"
                        min={0}
                        max={10}
                        step={0.5}
                        value={[textOutlineWidth]}
                        onValueChange={(value) => setTextOutlineWidth(value[0])}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="position" className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="position-x">Horizontal Position: {textX.toFixed(0)}%</Label>
                      </div>
                      <Slider
                        id="position-x"
                        min={0}
                        max={100}
                        step={1}
                        value={[textX]}
                        onValueChange={(value) => setTextX(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="position-y">Vertical Position: {textY.toFixed(0)}%</Label>
                      </div>
                      <Slider
                        id="position-y"
                        min={0}
                        max={100}
                        step={1}
                        value={[textY]}
                        onValueChange={(value) => setTextY(value[0])}
                      />
                    </div>

                    <div className="mt-4 p-3 bg-muted rounded-md">
                      <p className="text-sm text-muted-foreground">
                        Tip: You can also drag the text directly on the image to position it.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                <Button onClick={handleDownload} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Image with Text
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
