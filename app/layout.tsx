import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ImageTools - Free Online Image Editing Tools",
  description: "Free online tools for image editing, compression, conversion, and more. No login required.",
  keywords: "image tools, image editor, compress image, resize image, crop image, convert image format",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://imagetools.example.com",
    title: "ImageTools - Free Online Image Editing Tools",
    description: "Free online tools for image editing, compression, conversion, and more. No login required.",
    siteName: "ImageTools",
  },
  twitter: {
    card: "summary_large_image",
    title: "ImageTools - Free Online Image Editing Tools",
    description: "Free online tools for image editing, compression, conversion, and more. No login required.",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 mx-auto w-full max-w-[calc(100%-200px)]">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
