"use client"
import Link from "next/link"
import { ImageIcon } from "lucide-react"

import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { MegaMenu } from "@/components/mega-menu"

export function Header() {
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="mx-auto w-full max-w-[calc(100%-200px)] flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <ImageIcon className="h-6 w-6" />
            <span className="text-xl">ImageTools</span>
          </Link>
          <MegaMenu />
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/contact">Contact</Link>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
