import type { Metadata } from "next"
import ApiDocsClientPage from "./ApiDocsClientPage"

export const metadata: Metadata = {
  title: "API Documentation - ImageTools",
  description: "Use ImageTools programmatically with our REST API. Process images at scale with simple API calls.",
}

export default function ApiDocsPage() {
  return <ApiDocsClientPage />
}
