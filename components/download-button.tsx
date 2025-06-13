"use client"

import type React from "react"

import { useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DownloadModal } from "@/components/download-modal"

interface DownloadButtonProps {
  onDownload: () => void
  className?: string
  disabled?: boolean
  children?: React.ReactNode
}

export function DownloadButton({ onDownload, className, disabled, children }: DownloadButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)} className={className} disabled={disabled}>
        {children || (
          <>
            <Download className="mr-2 h-4 w-4" />
            Download
          </>
        )}
      </Button>

      <DownloadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDownload={onDownload}
        title="Your Download is Ready"
      />
    </>
  )
}
