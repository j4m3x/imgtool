"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Download, File, Trash2 } from "lucide-react"
import Link from "next/link"
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import "react-pdf/dist/esm/Page/TextLayer.css"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DownloadButton } from "@/components/download-button"

// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

export default function PdfToImageClient() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [numPages, setNumPages] = useState<number | null>(null)
  const [selectedPages, setSelectedPages] = useState<number[]>([])
  const [format, setFormat] = useState<"jpeg" | "png" | "webp">("jpeg")
  const [quality, setQuality] = useState<number>(80)
  const [scale, setScale] = useState<number>(2)
  const [convertedImages, setConvertedImages] = useState<{ url: string; pageNumber: number }[]>([])
  const [isConverting, setIsConverting] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const file = files[0]
      if (file.type !== "application/pdf") {
        alert("Please upload a PDF file")
        return
      }

      setPdfFile(file)
      const fileUrl = URL.createObjectURL(file)
      setPdfUrl(fileUrl)
      setSelectedPages([])
      setConvertedImages([])
    }
  }

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    // By default, select all pages
    setSelectedPages(Array.from({ length: numPages }, (_, i) => i + 1))
  }

  const togglePageSelection = (pageNumber: number) => {
    setSelectedPages((prev) =>
      prev.includes(pageNumber) ? prev.filter((p) => p !== pageNumber) : [...prev, pageNumber].sort((a, b) => a - b),
    )
  }

  const selectAllPages = () => {
    if (numPages) {
      setSelectedPages(Array.from({ length: numPages }, (_, i) => i + 1))
    }
  }

  const deselectAllPages = () => {
    setSelectedPages([])
  }

  const convertToImages = async () => {
    if (!pdfUrl || selectedPages.length === 0) return

    setIsConverting(true)
    setConvertedImages([])

    try {
      const pdf = await pdfjs.getDocument(pdfUrl).promise
      const convertedImgs = []

      for (const pageNumber of selectedPages) {
        const page = await pdf.getPage(pageNumber)
        const viewport = page.getViewport({ scale })
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")

        if (!context) {
          throw new Error("Could not get canvas context")
        }

        canvas.height = viewport.height
        canvas.width = viewport.width

        await page.render({
          canvasContext: context,
          viewport,
        }).promise

        // Convert canvas to image
        const imageUrl = canvas.toDataURL(`image/${format}`, quality / 100)
        convertedImgs.push({ url: imageUrl, pageNumber })
      }

      setConvertedImages(convertedImgs)
    } catch (error) {
      console.error("Error converting PDF to images:", error)
      alert("Error converting PDF to images. Please try again.")
    } finally {
      setIsConverting(false)
    }
  }

  const handleDownload = (imageUrl: string, pageNumber: number) => {
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = `page_${pageNumber}.${format}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDownloadAll = () => {
    // Create a zip file with all images
    // For simplicity, we'll just download them one by one
    convertedImages.forEach((img) => {
      handleDownload(img.url, img.pageNumber)
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
        <h1 className="text-3xl font-bold">Convert PDF to Images</h1>
        <p className="mt-2 text-muted-foreground">
          Convert PDF pages to high-quality image files in JPG, PNG, or WebP format
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Upload PDF</h2>
              <div className="mb-6">
                <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" id="pdf-upload" />
                <Label htmlFor="pdf-upload">
                  <div className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-12 text-center transition-colors hover:border-muted-foreground/50">
                    <File className="mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="mb-2 text-lg font-semibold">Upload a PDF file</h3>
                    <p className="mb-4 text-sm text-muted-foreground">Drag & drop or click to select</p>
                    <Button type="button" variant="secondary">
                      Select PDF
                    </Button>
                  </div>
                </Label>
              </div>

              {pdfUrl && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">
                      {pdfFile?.name} ({numPages} pages)
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setPdfFile(null)
                        setPdfUrl(null)
                        setNumPages(null)
                        setSelectedPages([])
                        setConvertedImages([])
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="rounded-lg border">
                    <Document file={pdfUrl} onLoadSuccess={handleDocumentLoadSuccess} className="flex justify-center">
                      <Page
                        pageNumber={currentPage}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        scale={0.5}
                      />
                    </Document>
                    {numPages && numPages > 1 && (
                      <div className="flex items-center justify-between border-t p-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage <= 1}
                        >
                          Previous
                        </Button>
                        <span className="text-sm">
                          Page {currentPage} of {numPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, numPages || 1))}
                          disabled={currentPage >= (numPages || 1)}
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          {pdfUrl && numPages && (
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Conversion Options</h2>

                <Tabs defaultValue="pages" className="mb-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="pages">Pages</TabsTrigger>
                    <TabsTrigger value="format">Format</TabsTrigger>
                    <TabsTrigger value="quality">Quality</TabsTrigger>
                  </TabsList>

                  <TabsContent value="pages" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Select Pages</h3>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm" onClick={selectAllPages}>
                          Select All
                        </Button>
                        <Button variant="outline" size="sm" onClick={deselectAllPages}>
                          Deselect All
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                      {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNumber) => (
                        <Button
                          key={pageNumber}
                          variant={selectedPages.includes(pageNumber) ? "default" : "outline"}
                          size="sm"
                          onClick={() => togglePageSelection(pageNumber)}
                          className="h-10 w-10 p-0"
                        >
                          {pageNumber}
                        </Button>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="format" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Image Format</Label>
                      <RadioGroup
                        value={format}
                        onValueChange={(value) => setFormat(value as "jpeg" | "png" | "webp")}
                        className="flex flex-wrap gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="jpeg" id="format-jpeg" />
                          <Label htmlFor="format-jpeg">JPEG</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="png" id="format-png" />
                          <Label htmlFor="format-png">PNG</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="webp" id="format-webp" />
                          <Label htmlFor="format-webp">WebP</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </TabsContent>

                  <TabsContent value="quality" className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="quality">Quality: {quality}%</Label>
                      </div>
                      <Slider
                        id="quality"
                        min={10}
                        max={100}
                        step={5}
                        value={[quality]}
                        onValueChange={(value) => setQuality(value[0])}
                      />
                      <p className="text-sm text-muted-foreground">
                        Higher quality results in larger file sizes (PNG is always lossless)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="scale">Resolution Scale: {scale}x</Label>
                      </div>
                      <Slider
                        id="scale"
                        min={1}
                        max={4}
                        step={0.5}
                        value={[scale]}
                        onValueChange={(value) => setScale(value[0])}
                      />
                      <p className="text-sm text-muted-foreground">
                        Higher scale results in larger images with more detail
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                <Button
                  onClick={convertToImages}
                  disabled={isConverting || selectedPages.length === 0}
                  className="w-full"
                >
                  {isConverting ? "Converting..." : "Convert to Images"}
                </Button>
              </CardContent>
            </Card>
          )}

          {convertedImages.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Converted Images</h2>
                  <DownloadButton onDownload={handleDownloadAll}>
                    <Download className="mr-2 h-4 w-4" />
                    Download All
                  </DownloadButton>
                </div>

                <div className="grid gap-4">
                  {convertedImages.map((image) => (
                    <div key={image.pageNumber} className="rounded-lg border p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-medium">Page {image.pageNumber}</h3>
                        <DownloadButton
                          onDownload={() => handleDownload(image.url, image.pageNumber)}
                          className="h-8 w-8 p-0"
                        >
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </DownloadButton>
                      </div>
                      <div className="overflow-hidden rounded-md border">
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={`Page ${image.pageNumber}`}
                          className="h-auto w-full object-contain"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
