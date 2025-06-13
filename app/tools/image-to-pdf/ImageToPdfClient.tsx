"use client"

import type React from "react"

import { useState, useRef } from "react"
import { ArrowLeft, Download, Plus, Trash2, MoveUp, MoveDown, FileText } from "lucide-react"
import Link from "next/link"
import { jsPDF } from "jspdf"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { DownloadButton } from "@/components/download-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ImageItem {
  id: string
  file: File
  url: string
}

export default function ImageToPdfClient() {
  const [images, setImages] = useState<ImageItem[]>([])
  const [pageSize, setPageSize] = useState<string>("a4")
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait")
  const [margin, setMargin] = useState<number>(10)
  const [quality, setQuality] = useState<number>(90)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const newImages: ImageItem[] = []

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return

      const id = `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      const url = URL.createObjectURL(file)
      newImages.push({ id, file, url })
    })

    setImages((prev) => [...prev, ...newImages])

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeImage = (id: string) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id)
      return filtered
    })
  }

  const moveImage = (id: string, direction: "up" | "down") => {
    setImages((prev) => {
      const index = prev.findIndex((img) => img.id === id)
      if ((direction === "up" && index === 0) || (direction === "down" && index === prev.length - 1) || index === -1) {
        return prev
      }

      const newImages = [...prev]
      const targetIndex = direction === "up" ? index - 1 : index + 1
      const temp = newImages[index]
      newImages[index] = newImages[targetIndex]
      newImages[targetIndex] = temp

      return newImages
    })
  }

  const generatePdf = async () => {
    if (images.length === 0) return

    setIsGenerating(true)
    setPdfUrl(null)

    try {
      // Create a new PDF document
      const doc = new jsPDF({
        orientation,
        unit: "mm",
        format: pageSize,
      })

      // Get page dimensions
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const marginMm = margin

      // Add each image to the PDF
      for (let i = 0; i < images.length; i++) {
        if (i > 0) {
          doc.addPage()
        }

        const img = images[i]
        const imgElement = new Image()
        imgElement.src = img.url

        await new Promise<void>((resolve) => {
          imgElement.onload = () => {
            // Calculate dimensions to fit within margins while preserving aspect ratio
            const imgWidth = imgElement.width
            const imgHeight = imgElement.height
            const availableWidth = pageWidth - 2 * marginMm
            const availableHeight = pageHeight - 2 * marginMm

            let finalWidth, finalHeight

            if (imgWidth / imgHeight > availableWidth / availableHeight) {
              // Image is wider than the available space (relative to height)
              finalWidth = availableWidth
              finalHeight = (imgHeight * availableWidth) / imgWidth
            } else {
              // Image is taller than the available space (relative to width)
              finalHeight = availableHeight
              finalWidth = (imgWidth * availableHeight) / imgHeight
            }

            // Center the image on the page
            const x = marginMm + (availableWidth - finalWidth) / 2
            const y = marginMm + (availableHeight - finalHeight) / 2

            // Add the image to the PDF
            doc.addImage(imgElement, "JPEG", x, y, finalWidth, finalHeight, undefined, "FAST", 0)
            resolve()
          }
        })
      }

      // Generate the PDF as a data URL
      const pdfDataUrl = doc.output("datauristring")
      setPdfUrl(pdfDataUrl)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!pdfUrl) return

    const link = document.createElement("a")
    link.href = pdfUrl
    link.download = "images-to-pdf.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
        <h1 className="text-3xl font-bold">Convert Images to PDF</h1>
        <p className="mt-2 text-muted-foreground">Combine multiple images into a single PDF document</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Upload Images</h2>
              <div className="mb-6">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="image-upload"
                />
                <Label htmlFor="image-upload">
                  <div className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-12 text-center transition-colors hover:border-muted-foreground/50">
                    <Plus className="mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="mb-2 text-lg font-semibold">Add Images</h3>
                    <p className="mb-4 text-sm text-muted-foreground">Upload multiple images to combine into a PDF</p>
                    <Button type="button" variant="secondary">
                      Select Images
                    </Button>
                  </div>
                </Label>
              </div>

              {images.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Images ({images.length})</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setImages([])
                        setPdfUrl(null)
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear All
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {images.map((img, index) => (
                      <div key={img.id} className="flex items-center gap-3 rounded-lg border p-3">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                          <img
                            src={img.url || "/placeholder.svg"}
                            alt={img.file.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-medium">{img.file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Page {index + 1} • {(img.file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <div className="flex flex-shrink-0 gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => moveImage(img.id, "up")}
                            disabled={index === 0}
                            className="h-8 w-8"
                          >
                            <MoveUp className="h-4 w-4" />
                            <span className="sr-only">Move up</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => moveImage(img.id, "down")}
                            disabled={index === images.length - 1}
                            className="h-8 w-8"
                          >
                            <MoveDown className="h-4 w-4" />
                            <span className="sr-only">Move down</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeImage(img.id)}
                            className="h-8 w-8 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold">PDF Options</h2>

              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="page-size">Page Size</Label>
                    <Select value={pageSize} onValueChange={setPageSize}>
                      <SelectTrigger id="page-size">
                        <SelectValue placeholder="Select page size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="a4">A4</SelectItem>
                        <SelectItem value="a5">A5</SelectItem>
                        <SelectItem value="letter">Letter</SelectItem>
                        <SelectItem value="legal">Legal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Orientation</Label>
                    <RadioGroup
                      value={orientation}
                      onValueChange={(value) => setOrientation(value as "portrait" | "landscape")}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="portrait" id="orientation-portrait" />
                        <Label htmlFor="orientation-portrait">Portrait</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="landscape" id="orientation-landscape" />
                        <Label htmlFor="orientation-landscape">Landscape</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="margin">Margin: {margin} mm</Label>
                  </div>
                  <Slider
                    id="margin"
                    min={0}
                    max={50}
                    step={5}
                    value={[margin]}
                    onValueChange={(value) => setMargin(value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="quality">Image Quality: {quality}%</Label>
                  </div>
                  <Slider
                    id="quality"
                    min={10}
                    max={100}
                    step={10}
                    value={[quality]}
                    onValueChange={(value) => setQuality(value[0])}
                  />
                  <p className="text-sm text-muted-foreground">Higher quality results in larger PDF file size</p>
                </div>

                <Button onClick={generatePdf} disabled={isGenerating || images.length === 0} className="w-full">
                  {isGenerating ? "Generating PDF..." : "Generate PDF"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {pdfUrl && (
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Generated PDF</h2>
                <div className="mb-4 overflow-hidden rounded-lg border">
                  <div className="flex h-64 items-center justify-center bg-muted/30">
                    <FileText className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <div className="bg-muted p-3 text-center">
                    <p className="text-sm font-medium">
                      PDF with {images.length} {images.length === 1 ? "page" : "pages"} generated successfully
                    </p>
                  </div>
                </div>

                <DownloadButton onDownload={handleDownload} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </DownloadButton>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
