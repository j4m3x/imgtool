import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Terms of Service - ImageTools",
  description: "Terms of service for ImageTools - rules and guidelines for using our platform.",
}

export default function TermsPage() {
  return (
    <div className="mx-auto py-12">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Terms of Service</h1>
        <p className="mt-2 text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none">
        <h2>Introduction</h2>
        <p>
          These Terms of Service govern your use of the ImageTools website and the tools provided therein. By using our
          website, you accept these terms in full.
        </p>

        <h2>Use License</h2>
        <p>
          ImageTools grants you a personal, non-exclusive, non-transferable license to use our tools for personal or
          commercial purposes. You may not:
        </p>
        <ul>
          <li>Modify or copy the materials except as provided by our tools</li>
          <li>Use the materials for any commercial purpose not explicitly permitted by ImageTools</li>
          <li>Attempt to decompile or reverse engineer any software contained on the ImageTools website</li>
          <li>Remove any copyright or other proprietary notations from the materials</li>
          <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
        </ul>

        <h2>Disclaimer</h2>
        <p>
          The materials on the ImageTools website are provided on an 'as is' basis. ImageTools makes no warranties,
          expressed or implied, and hereby disclaims and negates all other warranties including, without limitation,
          implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of
          intellectual property or other violation of rights.
        </p>

        <h2>Limitations</h2>
        <p>
          In no event shall ImageTools or its suppliers be liable for any damages (including, without limitation,
          damages for loss of data or profit, or due to business interruption) arising out of the use or inability to
          use the materials on ImageTools' website, even if ImageTools or an authorized representative has been notified
          orally or in writing of the possibility of such damage.
        </p>

        <h2>Governing Law</h2>
        <p>
          These terms and conditions are governed by and construed in accordance with the laws and any dispute relating
          to these terms and conditions shall be subject to the exclusive jurisdiction of the courts.
        </p>

        <h2>Changes to Terms</h2>
        <p>
          ImageTools may revise these terms of service at any time without notice. By using this website you are
          agreeing to be bound by the then current version of these terms of service.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us through our{" "}
          <Link href="/contact">Contact Page</Link>.
        </p>
      </div>
    </div>
  )
}
