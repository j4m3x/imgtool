"use client"

import { useState, useEffect } from "react"
import { Download } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DownloadModalProps {
  isOpen: boolean
  onClose: () => void
  onDownload: () => void
  title?: string
}

export function DownloadModal({ isOpen, onClose, onDownload, title = "Your Download" }: DownloadModalProps) {
  const [countdown, setCountdown] = useState(5)
  const [downloadTriggered, setDownloadTriggered] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isOpen && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    }

    if (isOpen && countdown === 0 && !downloadTriggered) {
      setDownloadTriggered(true)
      onDownload()

      // Close the modal after a short delay to ensure download starts
      setTimeout(() => {
        onClose()
        // Reset for next time
        setCountdown(5)
        setDownloadTriggered(false)
      }, 500)
    }

    return () => {
      clearTimeout(timer)
    }
  }, [isOpen, countdown, downloadTriggered, onDownload, onClose])

  // If modal is closed, reset the state
  useEffect(() => {
    if (!isOpen) {
      setCountdown(5)
      setDownloadTriggered(false)
    }
  }, [isOpen])

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Your download will start in <span className="font-bold">{countdown}</span> seconds...
          </DialogDescription>
        </DialogHeader>

        <div className="my-6">
          {/* Ad placeholder */}
          <div className="relative overflow-hidden rounded-lg border-2 border-dashed border-muted bg-muted/20">
            <div className="absolute top-2 right-2 z-10 rounded-sm bg-background/80 px-2 py-1 text-xs backdrop-blur-sm">
              Advertisement
            </div>
            <div className="flex h-60 w-full items-center justify-center">
              <img
                src="/placeholder.svg?height=250&width=400"
                alt="Advertisement"
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onClose} disabled={downloadTriggered}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setDownloadTriggered(true)
              onDownload()
              onClose()
            }}
            disabled={downloadTriggered}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Now ({countdown})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
