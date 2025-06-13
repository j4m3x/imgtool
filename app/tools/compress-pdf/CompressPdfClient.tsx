"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Download, File, Trash2 } from "lucide-react"
import Link from "next/link"
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import "react-pdf/dist/esm/Page/TextLayer.css"
import { jsPDF } from "jspdf"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { DownloadButton } from "@/components/download-button"

// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

export default function CompressPdfClient() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [numPages, setNumPages] = useState<number | null>(null)
  const [compressionLevel, setCompressionLevel] = useState<"low" | "medium" | "high">("medium")
  const [imageQuality, setImageQuality] = useState<number>(50)
  const [compressedPdfUrl, setCompressedPdfUrl] = useState<string | null>(null)
  const [isCompressing, setIsCompressing] = useState<boolean>(false)
  const [originalSize, setOriginalSize] = useState<number>(0)
  const [compressedSize, setCompressedSize] = useState<number>(0)
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
      setOriginalSize(file.size)
      setCompressedPdfUrl(null)
      setCompressedSize(0)
    }
  }

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
  }

  const compressPdf = async () => {
    if (!pdfUrl || !pdfFile) return

    setIsCompressing(true)
    setCompressedPdfUrl(null)

    try {
      // Load the PDF document
      const pdf = await pdfjs.getDocument(pdfUrl).promise
      const numPages = pdf.numPages

      // Create a new PDF document
      const newPdf = new jsPDF()

      // Set compression quality based on level
      let quality = 0.7 // medium (default)
      if (compressionLevel === "low") quality = 0.9
      if (compressionLevel === "high") quality = 0.5

      // Adjust quality based on slider
      quality = quality * (imageQuality / 100)

      // Process each page
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: 1.5 }) // Higher scale for better quality

        // Create a canvas to render the page
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")
        if (!context) throw new Error("Could not get canvas context")

        canvas.height = viewport.height
        canvas.width = viewport.width

        // Render the page to the canvas
        await page.render({
          canvasContext: context,
          viewport,
        }).promise

        // Convert the canvas to an image
        const imgData = canvas.toDataURL("image/jpeg", quality)

        // Add a new page to the PDF (except for the first page)
        if (i > 1) {
          newPdf.addPage()
        }

        // Add the image to the PDF
        const pdfWidth = newPdf.internal.pageSize.getWidth()
        const pdfHeight = newPdf.internal.pageSize.getHeight()

        // Calculate dimensions to fit the page while preserving aspect ratio
        const imgWidth = canvas.width
        const imgHeight = canvas.height
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
        const imgX = (pdfWidth - imgWidth * ratio) / 2
        const imgY = (pdfHeight - imgHeight * ratio) / 2

        newPdf.addImage(imgData, "JPEG", imgX, imgY, imgWidth * ratio, imgHeight * ratio, undefined, "FAST", 0)
      }

      // Generate the compressed PDF
      const compressedPdfBlob = newPdf.output("blob")
      const compressedUrl = URL.createObjectURL(compressedPdfBlob)
      setCompressedPdfUrl(compressedUrl)
      setCompressedSize(compressedPdfBlob.size)
    } catch (error) {
      console.error("Error compressing PDF:", error)
      alert("Error compressing PDF. Please try again.")
    } finally {
      setIsCompressing(false)
    }
  }

  const handleDownload = () => {
    if (!compressedPdfUrl || !pdfFile) return

    const link = document.createElement("a")
    link.href = compressedPdfUrl
    const fileName = pdfFile.name.replace(".pdf", "-compressed.pdf")
    link.download = fileName
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

  return (
    <div className="mx-auto py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tools
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Compress PDF</h1>
        <p className="mt-2 text-muted-foreground">Reduce PDF file size while maintaining reasonable quality</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Upload PDF</h2>
              <div className="mb-6">
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                />
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
                        setCompressedPdfUrl(null)
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

                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm">
                      Original size: <span className="font-medium">{formatFileSize(originalSize)}</span>
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          {pdfUrl && (
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Compression Options</h2>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Compression Level</Label>
                    <RadioGroup
                      value={compressionLevel}
                      onValueChange={(value) => setCompressionLevel(value as "low" | "medium" | "high")}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="low" id="compression-low" />
                        <Label htmlFor="compression-low">Low (Better Quality, Larger Size)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="compression-medium" />
                        <Label htmlFor="compression-medium">Medium (Balanced)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="high" id="compression-high" />
                        <Label htmlFor="compression-high">High (Smaller Size, Lower Quality)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="image-quality">Image Quality: {imageQuality}%</Label>
                    </div>
                    <Slider
                      id="image-quality"
                      min={10}
                      max={100}
                      step={5}
                      value={[imageQuality]}
                      onValueChange={(value) => setImageQuality(value[0])}
                    />
                    <p className="text-sm text-muted-foreground">
                      Lower quality results in smaller file size but may affect image clarity
                    </p>
                  </div>

                  <Button onClick={compressPdf} disabled={isCompressing || !pdfFile} className="w-full">
                    {isCompressing ? "Compressing..." : "Compress PDF"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {compressedPdfUrl && (
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Compressed PDF</h2>
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

                <DownloadButton onDownload={handleDownload} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Compressed PDF
                </DownloadButton>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
