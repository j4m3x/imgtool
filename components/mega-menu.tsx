"use client"
import Link from "next/link"
import { ImageIcon, FileIcon, Layers, Palette, PenTool, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const imageTools = [
  {
    title: "Core Editing",
    items: [
      { title: "Resize Image", href: "/tools/resize", description: "Change the dimensions of your image" },
      { title: "Crop Image", href: "/tools/crop", description: "Crop your image to the desired area" },
      { title: "Compress Image", href: "/tools/compress", description: "Reduce file size while maintaining quality" },
      { title: "Convert Format", href: "/tools/convert", description: "Convert between image formats" },
    ],
    icon: <ImageIcon className="h-5 w-5" />,
  },
  {
    title: "Color & Style",
    items: [
      { title: "Adjust Brightness", href: "/tools/brightness", description: "Increase or decrease image brightness" },
      { title: "Adjust Contrast", href: "/tools/contrast", description: "Enhance or reduce image contrast" },
      { title: "Grayscale Filter", href: "/tools/grayscale", description: "Convert image to black and white" },
    ],
    icon: <Palette className="h-5 w-5" />,
  },
  {
    title: "Canvas & Background",
    items: [
      { title: "Remove Background", href: "/tools/remove-background", description: "Remove image background with AI" },
    ],
    icon: <Layers className="h-5 w-5" />,
  },
  {
    title: "Text & Watermark",
    items: [
      { title: "Add Text to Image", href: "/tools/add-text", description: "Add custom text to your images" },
      { title: "Add Watermark", href: "/tools/watermark", description: "Add logo or text watermark to images" },
    ],
    icon: <PenTool className="h-5 w-5" />,
  },
]

const pdfTools = [
  {
    title: "PDF Conversion",
    items: [
      { title: "PDF to Image", href: "/tools/pdf-to-image", description: "Convert PDF pages to image files" },
      { title: "Image to PDF", href: "/tools/image-to-pdf", description: "Convert images to PDF document" },
      { title: "PDF to Text", href: "/tools/pdf-to-text", description: "Extract text from PDF files" },
    ],
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "PDF Editing",
    items: [
      { title: "Compress PDF", href: "/tools/compress-pdf", description: "Reduce PDF file size" },
      { title: "Merge PDFs", href: "/tools/merge-pdf", description: "Combine multiple PDF files into one" },
      { title: "Split PDF", href: "/tools/split-pdf", description: "Split PDF into multiple files" },
      { title: "Rotate PDF", href: "/tools/rotate-pdf", description: "Rotate PDF pages" },
    ],
    icon: <FileIcon className="h-5 w-5" />,
  },
]

export function MegaMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Image Tools</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[800px] grid-cols-2 gap-3 p-4">
              {imageTools.map((category) => (
                <div key={category.title} className="space-y-3">
                  <div className="flex items-center gap-2 font-medium">
                    {category.icon}
                    <h3>{category.title}</h3>
                  </div>
                  <ul className="grid gap-2">
                    {category.items.map((item) => (
                      <ListItem key={item.title} title={item.title} href={item.href}>
                        {item.description}
                      </ListItem>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>PDF Tools</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[600px] grid-cols-2 gap-3 p-4">
              {pdfTools.map((category) => (
                <div key={category.title} className="space-y-3">
                  <div className="flex items-center gap-2 font-medium">
                    {category.icon}
                    <h3>{category.title}</h3>
                  </div>
                  <ul className="grid gap-2">
                    {category.items.map((item) => (
                      <ListItem key={item.title} title={item.title} href={item.href}>
                        {item.description}
                      </ListItem>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/api" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>API</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = ({ className, title, children, href, ...props }: any) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}
