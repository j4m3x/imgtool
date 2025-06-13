import type { MetadataRoute } from "next"
import { toolCategories } from "@/lib/tools"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://imagetools.example.com"

  // Get all tool slugs
  const toolSlugs = toolCategories.flatMap((category) => category.tools.map((tool) => tool.slug))

  // Create sitemap entries for tools
  const toolUrls = toolSlugs.map((slug) => ({
    url: `${baseUrl}/tools/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  // Add other pages
  const otherUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ]

  return [...otherUrls, ...toolUrls]
}
