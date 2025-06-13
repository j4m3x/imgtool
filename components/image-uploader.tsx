"use client"

import { useCallback, useState } from "react"
import { type FileRejection, useDropzone } from "react-dropzone"
import { UploadCloud, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ImageUploaderProps {
  onImageSelect: (file: File) => void
  maxSizeMB?: number
  acceptedFileTypes?: string[]
  className?: string
}

export function ImageUploader({
  onImageSelect,
  maxSizeMB = 10,
  acceptedFileTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  className,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const maxSize = maxSizeMB * 1024 * 1024 // Convert MB to bytes

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        const { code } = fileRejections[0].errors[0]
        if (code === "file-too-large") {
          setError(`File is too large. Max size is ${maxSizeMB}MB.`)
        } else if (code === "file-invalid-type") {
          setError("Invalid file type. Please upload an image.")
        } else {
          setError("Error uploading file. Please try again.")
        }
        return
      }

      setError(null)

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        onImageSelect(file)

        // Create preview
        const objectUrl = URL.createObjectURL(file)
        setPreview(objectUrl)

        // Clean up preview URL when component unmounts
        return () => URL.revokeObjectURL(objectUrl)
      }
    },
    [maxSizeMB, onImageSelect],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize,
    multiple: false,
  })

  const removeImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview)
    }
    setPreview(null)
    setError(null)
  }

  return (
    <div className={className}>
      {!preview ? (
        <div
          {...getRootProps()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-12 text-center transition-colors hover:border-muted-foreground/50",
            isDragActive && "border-primary bg-primary/5",
            error && "border-destructive bg-destructive/5",
          )}
        >
          <input {...getInputProps()} />
          <UploadCloud className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">Upload an image</h3>
          <p className="mb-4 text-sm text-muted-foreground">Drag & drop or click to select</p>
          <Button type="button" variant="secondary">
            Select Image
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">
            Supported formats: JPEG, PNG, WebP, GIF (max {maxSizeMB}MB)
          </p>
          {error && <p className="mt-2 text-sm font-medium text-destructive">{error}</p>}
        </div>
      ) : (
        <div className="relative rounded-lg border">
          <div className="absolute right-2 top-2 z-10">
            <Button
              type="button"
              size="icon"
              variant="destructive"
              onClick={removeImage}
              className="h-8 w-8 rounded-full"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove image</span>
            </Button>
          </div>
          <div className="flex items-center justify-center overflow-hidden rounded-lg">
            <img
              src={preview || "/placeholder.svg"}
              alt="Preview"
              className="h-auto max-h-[400px] w-auto max-w-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}
