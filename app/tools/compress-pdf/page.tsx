import type { Metadata } from "next"
import CompressPdfClient from "./CompressPdfClient"

export const metadata: Metadata = {
  title: "Compress PDF - ImageTools",
  description: "Reduce PDF file size while maintaining reasonable quality for easier sharing and storage.",
  keywords: "compress pdf, reduce pdf size, optimize pdf, pdf compressor, shrink pdf",
}

export default function CompressPdfPage() {
  return <CompressPdfClient />
}
