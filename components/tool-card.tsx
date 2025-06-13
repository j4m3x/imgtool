import Link from "next/link"
import { ArrowRight } from "lucide-react"

import type { Tool } from "@/lib/tools"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ToolCardProps {
  tool: Tool
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {tool.icon}
        </div>
        <CardTitle>{tool.name}</CardTitle>
        <CardDescription>{tool.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {tool.features && (
          <ul className="ml-5 list-disc text-sm text-muted-foreground">
            {tool.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/tools/${tool.slug}`}>
            Use Tool <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
