import type { Metadata } from "next"
import TextEditorClient from "./TextEditorClient"

export const metadata: Metadata = {
  title: "Add Text to Image - ImageTools",
  description: "Add custom text to your images with various styling options like font, size, color, and position.",
  keywords: "add text to image, text on photo, image text editor, photo text, text overlay",
}

export default function AddTextPage() {
  return <TextEditorClient />
}
