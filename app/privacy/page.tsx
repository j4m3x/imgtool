import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Privacy Policy - ImageTools",
  description: "Privacy policy for ImageTools - how we handle your data and protect your privacy.",
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto py-12">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="mt-2 text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none">
        <h2>Introduction</h2>
        <p>
          At ImageTools, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and
          safeguard your information when you use our website.
        </p>

        <h2>Information We Collect</h2>
        <p>
          <strong>Images:</strong> When you use our tools, you may upload images to our website. These images are
          processed in your browser and are not stored on our servers unless explicitly stated for a specific tool.
        </p>
        <p>
          <strong>Usage Data:</strong> We collect anonymous usage data such as which tools are used most frequently and
          general performance metrics to improve our service.
        </p>

        <h2>How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Develop new features and tools</li>
          <li>Monitor and analyze usage patterns</li>
          <li>Detect and prevent technical issues</li>
        </ul>

        <h2>Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your data. However, no method of
          transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
        </p>

        <h2>Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
          Privacy Policy on this page and updating the "Last updated" date.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us through our{" "}
          <Link href="/contact">Contact Page</Link>.
        </p>
      </div>
    </div>
  )
}
