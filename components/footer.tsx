import Link from "next/link"
import { ImageIcon } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t py-12">
      <div className="mx-auto w-full max-w-[calc(100%-200px)]">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold">
              <ImageIcon className="h-6 w-6" />
              <span className="text-xl">ImageTools</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Free online tools for image editing, compression, conversion, and more. No login required.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Core Tools</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tools/resize" className="text-muted-foreground hover:text-foreground">
                  Resize Image
                </Link>
              </li>
              <li>
                <Link href="/tools/crop" className="text-muted-foreground hover:text-foreground">
                  Crop Image
                </Link>
              </li>
              <li>
                <Link href="/tools/compress" className="text-muted-foreground hover:text-foreground">
                  Compress Image
                </Link>
              </li>
              <li>
                <Link href="/tools/convert" className="text-muted-foreground hover:text-foreground">
                  Convert Format
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Color Tools</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tools/brightness" className="text-muted-foreground hover:text-foreground">
                  Adjust Brightness
                </Link>
              </li>
              <li>
                <Link href="/tools/contrast" className="text-muted-foreground hover:text-foreground">
                  Adjust Contrast
                </Link>
              </li>
              <li>
                <Link href="/tools/grayscale" className="text-muted-foreground hover:text-foreground">
                  Grayscale Filter
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ImageTools. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
