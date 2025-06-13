"use client"

import type React from "react"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface ApiKeyDialogProps {
  children: React.ReactNode
}

export function ApiKeyDialog({ children }: ApiKeyDialogProps) {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API key generation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate a random API key
    const generatedKey = Array(32)
      .fill(0)
      .map(() => Math.random().toString(36).charAt(2))
      .join("")

    setApiKey(generatedKey)
    setIsLoading(false)
  }

  const handleCopy = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey)
      setCopied(true)
      toast({
        title: "API key copied to clipboard",
        description: "Your API key has been copied to your clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Get your API key</DialogTitle>
          <DialogDescription>
            Fill out the form below to generate an API key for accessing the ImageTools API.
          </DialogDescription>
        </DialogHeader>
        {!apiKey ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <DialogFooter className="sm:justify-start">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Generating..." : "Generate API Key"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">Your API Key</Label>
              <div className="flex items-center space-x-2">
                <Input id="api-key" value={apiKey} readOnly className="font-mono text-xs" />
                <Button size="icon" variant="outline" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span className="sr-only">Copy API key</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Keep this key secure. Do not share it publicly or commit it to version control.
              </p>
            </div>
            <div className="rounded-md bg-muted p-3">
              <h4 className="mb-2 text-sm font-medium">Usage Example</h4>
              <pre className="overflow-x-auto text-xs">
                {`curl -X POST \\
  https://imagetools.example.com/api/compress \\
  -H "Authorization: Bearer ${apiKey}" \\
  -F "image=@/path/to/image.jpg"`}
              </pre>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
