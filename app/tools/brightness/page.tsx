import type { Metadata } from "next"
import BrightnessClientPage from "./BrightnessClientPage"

export const metadata: Metadata = {
  title: "Adjust Image Brightness - ImageTools",
  description: "Easily increase or decrease the brightness of your images online for free.",
}

export default function BrightnessPage() {
  return <BrightnessClientPage />
}
