import type { Metadata } from "next"
import PdfToImageClient from "./PdfToImageClient"

export const metadata: Metadata = {
  title: "Convert PDF to Images - ImageTools",
  description: "Convert PDF pages to high-quality image files in JPG, PNG, or WebP format.",
  keywords: "pdf to image, pdf converter, extract images from pdf, pdf to jpg, pdf to png",
}

export default function PdfToImagePage() {
  return <PdfToImageClient />
}
