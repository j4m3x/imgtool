import type { Metadata } from "next"
import WatermarkClientPage from "./WatermarkClientPage"

export const metadata: Metadata = {
  title: "Add Watermark to Image - ImageTools",
  description: "Add text or image watermarks to your photos with customizable opacity, position, and size.",
  keywords: "watermark image, add watermark, photo watermark, logo watermark, copyright image",
}

export default function WatermarkPage() {
  return <WatermarkClientPage />
}
