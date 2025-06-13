import type React from "react"
import {
  ArrowDownUp,
  Crop,
  FileIcon,
  FileImage,
  FileText,
  FilesIcon,
  ImageDown,
  Layers,
  Palette,
  PenTool,
  Scissors,
  SlidersHorizontal,
  Sparkles,
  Type,
} from "lucide-react"

export interface Tool {
  name: string
  slug: string
  description: string
  icon: React.ReactNode
  features?: string[]
  isNew?: boolean
  isPopular?: boolean
}

export interface ToolCategory {
  name: string
  icon: React.ReactNode
  tools: Tool[]
}

export const toolCategories: ToolCategory[] = [
  {
    name: "Core Editing",
    icon: <SlidersHorizontal className="h-5 w-5" />,
    tools: [
      {
        name: "Resize Image",
        slug: "resize",
        description: "Change the dimensions of your image",
        icon: <ArrowDownUp className="h-5 w-5" />,
        features: ["Maintain aspect ratio", "Custom dimensions", "Percentage scaling"],
        isPopular: true,
      },
      {
        name: "Crop Image",
        slug: "crop",
        description: "Crop your image to the desired area",
        icon: <Crop className="h-5 w-5" />,
        features: ["Custom crop area", "Preset aspect ratios", "Rotate while cropping"],
      },
      {
        name: "Compress Image",
        slug: "compress",
        description: "Reduce file size while maintaining quality",
        icon: <FileImage className="h-5 w-5" />,
        features: ["Adjust compression level", "Batch processing", "Size preview"],
        isPopular: true,
      },
      {
        name: "Convert Format",
        slug: "convert",
        description: "Convert between image formats",
        icon: <ImageDown className="h-5 w-5" />,
        features: ["JPG, PNG, WebP, and more", "Adjust quality", "Preserve metadata"],
        isPopular: true,
      },
    ],
  },
  {
    name: "Color & Style",
    icon: <Palette className="h-5 w-5" />,
    tools: [
      {
        name: "Adjust Brightness",
        slug: "brightness",
        description: "Increase or decrease image brightness",
        icon: <SlidersHorizontal className="h-5 w-5" />,
        features: ["Live preview", "Fine-tune controls", "Before/after comparison"],
      },
      {
        name: "Adjust Contrast",
        slug: "contrast",
        description: "Enhance or reduce image contrast",
        icon: <SlidersHorizontal className="h-5 w-5" />,
        features: ["Live preview", "Fine-tune controls", "Before/after comparison"],
      },
      {
        name: "Grayscale Filter",
        slug: "grayscale",
        description: "Convert image to black and white",
        icon: <Palette className="h-5 w-5" />,
        features: ["One-click conversion", "Before/after comparison", "Preserve details"],
      },
    ],
  },
  {
    name: "Canvas & Background",
    icon: <Layers className="h-5 w-5" />,
    tools: [
      {
        name: "Remove Background",
        slug: "remove-background",
        description: "Remove image background with AI",
        icon: <Scissors className="h-5 w-5" />,
        features: ["AI-powered", "Transparent background", "Download as PNG"],
        isNew: true,
      },
    ],
  },
  {
    name: "AI & Smart Tools",
    icon: <Sparkles className="h-5 w-5" />,
    tools: [
      {
        name: "AI Image Upscaler",
        slug: "upscale",
        description: "Enhance image resolution with AI",
        icon: <Sparkles className="h-5 w-5" />,
        features: ["2x, 4x upscaling", "Preserve details", "Reduce noise"],
        isNew: true,
      },
    ],
  },
  {
    name: "Text & Watermark",
    icon: <Type className="h-5 w-5" />,
    tools: [
      {
        name: "Add Text to Image",
        slug: "add-text",
        description: "Add custom text to your images",
        icon: <Type className="h-5 w-5" />,
        features: ["Multiple fonts", "Color options", "Drag to position"],
      },
      {
        name: "Add Watermark",
        slug: "watermark",
        description: "Add logo or text watermark to images",
        icon: <PenTool className="h-5 w-5" />,
        features: ["Text or image watermarks", "Adjustable opacity", "Position presets"],
      },
    ],
  },
  {
    name: "PDF Tools",
    icon: <FileIcon className="h-5 w-5" />,
    tools: [
      {
        name: "PDF to Image",
        slug: "pdf-to-image",
        description: "Convert PDF pages to image files",
        icon: <FileImage className="h-5 w-5" />,
        features: ["Convert all pages", "Choose image format", "Adjust quality"],
        isNew: true,
      },
      {
        name: "Image to PDF",
        slug: "image-to-pdf",
        description: "Convert images to PDF document",
        icon: <FileText className="h-5 w-5" />,
        features: ["Multiple images", "Arrange pages", "Set page size"],
        isNew: true,
      },
      {
        name: "Compress PDF",
        slug: "compress-pdf",
        description: "Reduce PDF file size",
        icon: <FileIcon className="h-5 w-5" />,
        features: ["Adjust compression level", "Preserve quality", "Fast processing"],
        isNew: true,
      },
      {
        name: "Merge PDFs",
        slug: "merge-pdf",
        description: "Combine multiple PDF files into one",
        icon: <FilesIcon className="h-5 w-5" />,
        features: ["Unlimited files", "Arrange order", "Fast processing"],
        isNew: true,
      },
      {
        name: "Split PDF",
        slug: "split-pdf",
        description: "Split PDF into multiple files",
        icon: <Scissors className="h-5 w-5" />,
        features: ["Split by page", "Extract pages", "Fast processing"],
        isNew: true,
      },
    ],
  },
]

export function getToolBySlug(slug: string): Tool | undefined {
  for (const category of toolCategories) {
    const tool = category.tools.find((t) => t.slug === slug)
    if (tool) return tool
  }
  return undefined
}
