import type { Metadata } from "next"
import ImageToPdfClient from "./ImageToPdfClient"

export const metadata: Metadata = {
  title: "Convert Images to PDF - ImageTools",
  description: "Combine multiple images into a single PDF document with customizable options.",
  keywords: "image to pdf, convert images to pdf, jpg to pdf, png to pdf, create pdf from images",
}

export default function ImageToPdfPage() {
  return <ImageToPdfClient />
}
