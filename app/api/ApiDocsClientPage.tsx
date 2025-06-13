"use client"
import Link from "next/link"
import { ArrowRight, Copy, Key } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ApiKeyDialog } from "@/components/api-key-dialog"

const apiEndpoints = [
  {
    name: "Compress",
    endpoint: "/api/compress",
    description: "Reduce image file size while maintaining quality",
    parameters: [
      { name: "image", type: "file", required: true, description: "The image file to compress" },
      { name: "quality", type: "number", required: false, description: "Compression quality (1-100, default: 80)" },
    ],
  },
  {
    name: "Resize",
    endpoint: "/api/resize",
    description: "Change image dimensions",
    parameters: [
      { name: "image", type: "file", required: true, description: "The image file to resize" },
      { name: "width", type: "number", required: true, description: "Target width in pixels" },
      { name: "height", type: "number", required: true, description: "Target height in pixels" },
      {
        name: "maintain_aspect_ratio",
        type: "boolean",
        required: false,
        description: "Whether to maintain aspect ratio (default: true)",
      },
    ],
  },
  {
    name: "Crop",
    endpoint: "/api/crop",
    description: "Crop image to specific dimensions",
    parameters: [
      { name: "image", type: "file", required: true, description: "The image file to crop" },
      { name: "x", type: "number", required: true, description: "X coordinate of top-left corner" },
      { name: "y", type: "number", required: true, description: "Y coordinate of top-left corner" },
      { name: "width", type: "number", required: true, description: "Width of crop area" },
      { name: "height", type: "number", required: true, description: "Height of crop area" },
    ],
  },
  {
    name: "Convert",
    endpoint: "/api/convert",
    description: "Convert image to different format",
    parameters: [
      { name: "image", type: "file", required: true, description: "The image file to convert" },
      {
        name: "format",
        type: "string",
        required: true,
        description: "Target format (jpeg, png, webp)",
      },
      {
        name: "quality",
        type: "number",
        required: false,
        description: "Output quality for lossy formats (1-100, default: 80)",
      },
    ],
  },
  {
    name: "Remove Background",
    endpoint: "/api/remove-bg",
    description: "Remove image background",
    parameters: [
      { name: "image", type: "file", required: true, description: "The image file to process" },
      {
        name: "return_format",
        type: "string",
        required: false,
        description: "Output format (png, webp, default: png)",
      },
    ],
  },
]

export default function ApiDocsClientPage() {
  return (
    <div className="mx-auto py-12">
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl">ImageTools API</h1>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
          Process images programmatically with our simple REST API
        </p>
        <div className="flex justify-center gap-4">
          <ApiKeyDialog>
            <Button size="lg">
              <Key className="mr-2 h-4 w-4" />
              Get Your API Key
            </Button>
          </ApiKeyDialog>
          <Button variant="outline" size="lg" asChild>
            <Link href="#endpoints">
              View Endpoints <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="mb-12 rounded-lg border bg-card p-8">
        <h2 className="mb-4 text-2xl font-bold">Quick Start</h2>
        <div className="mb-6 space-y-4">
          <p>
            Our API allows you to process images programmatically. All API requests require authentication using an API
            key.
          </p>
          <div className="rounded-md bg-muted p-4">
            <p className="font-mono text-sm">
              Authorization: Bearer <span className="text-primary">YOUR_API_KEY</span>
            </p>
          </div>
        </div>

        <h3 className="mb-2 text-xl font-semibold">Example Request</h3>
        <Tabs defaultValue="curl">
          <TabsList className="mb-4">
            <TabsTrigger value="curl">cURL</TabsTrigger>
            <TabsTrigger value="js">JavaScript</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
          </TabsList>
          <TabsContent value="curl" className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => {
                navigator.clipboard.writeText(`curl -X POST \\
  https://imagetools.example.com/api/compress \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "image=@/path/to/image.jpg" \\
  -F "quality=80"`)
              }}
            >
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy code</span>
            </Button>
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
              {`curl -X POST \\
  https://imagetools.example.com/api/compress \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "image=@/path/to/image.jpg" \\
  -F "quality=80"`}
            </pre>
          </TabsContent>
          <TabsContent value="js" className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => {
                navigator.clipboard.writeText(`const formData = new FormData();
formData.append('image', imageFile);
formData.append('quality', '80');

fetch('https://imagetools.example.com/api/compress', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: formData
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`)
              }}
            >
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy code</span>
            </Button>
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
              {`const formData = new FormData();
formData.append('image', imageFile);
formData.append('quality', '80');

fetch('https://imagetools.example.com/api/compress', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: formData
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`}
            </pre>
          </TabsContent>
          <TabsContent value="python" className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => {
                navigator.clipboard.writeText(`import requests

url = 'https://imagetools.example.com/api/compress'
headers = {
    'Authorization': 'Bearer YOUR_API_KEY'
}
files = {
    'image': open('/path/to/image.jpg', 'rb')
}
data = {
    'quality': '80'
}

response = requests.post(url, headers=headers, files=files, data=data)
print(response.json())`)
              }}
            >
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy code</span>
            </Button>
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
              {`import requests

url = 'https://imagetools.example.com/api/compress'
headers = {
    'Authorization': 'Bearer YOUR_API_KEY'
}
files = {
    'image': open('/path/to/image.jpg', 'rb')
}
data = {
    'quality': '80'
}

response = requests.post(url, headers=headers, files=files, data=data)
print(response.json())`}
            </pre>
          </TabsContent>
        </Tabs>

        <h3 className="mb-2 mt-6 text-xl font-semibold">Example Response</h3>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={() => {
              navigator.clipboard.writeText(`{
  "status": "success",
  "output_url": "https://imagetools.example.com/outputs/compressed_image_123456.jpg",
  "metadata": {
    "original_size": 1024000,
    "compressed_size": 204800,
    "savings_percentage": 80
  }
}`)
            }}
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy code</span>
          </Button>
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
            {`{
  "status": "success",
  "output_url": "https://imagetools.example.com/outputs/compressed_image_123456.jpg",
  "metadata": {
    "original_size": 1024000,
    "compressed_size": 204800,
    "savings_percentage": 80
  }
}`}
          </pre>
        </div>
      </div>

      <div className="mb-12">
        <h2 id="endpoints" className="mb-6 text-2xl font-bold">
          API Endpoints
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {apiEndpoints.map((endpoint) => (
            <Card key={endpoint.endpoint} className="flex h-full flex-col">
              <CardHeader>
                <CardTitle>{endpoint.name}</CardTitle>
                <CardDescription>{endpoint.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-4">
                  <Badge variant="outline" className="font-mono">
                    POST {endpoint.endpoint}
                  </Badge>
                </div>
                <h4 className="mb-2 text-sm font-medium">Parameters:</h4>
                <ul className="space-y-2 text-sm">
                  {endpoint.parameters.map((param) => (
                    <li key={param.name} className="flex items-start gap-2">
                      <div>
                        <span className="font-mono font-medium">{param.name}</span>
                        <span className="ml-1 text-xs text-muted-foreground">({param.type})</span>
                        {param.required && <span className="ml-1 text-xs text-destructive">*</span>}
                      </div>
                      <span className="text-xs text-muted-foreground">{param.description}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mb-12 rounded-lg border bg-card p-8">
        <h2 className="mb-4 text-2xl font-bold">Rate Limits</h2>
        <p className="mb-4">
          API usage is subject to rate limits based on your subscription plan. The default limits are:
        </p>
        <ul className="mb-6 list-inside list-disc space-y-2">
          <li>Free tier: 100 requests/month</li>
          <li>Basic tier: 1,000 requests/month</li>
          <li>Pro tier: 10,000 requests/month</li>
          <li>Enterprise tier: Custom limits</li>
        </ul>
        <p>
          Rate limit information is included in the response headers:
          <code className="ml-2 rounded bg-muted px-1 py-0.5 font-mono text-sm">X-RateLimit-Remaining</code>
        </p>
      </div>

      <div className="rounded-lg border bg-muted/30 p-8 text-center">
        <p className="text-sm text-muted-foreground">Advertisement Placeholder</p>
        <div className="mx-auto my-4 h-24 max-w-2xl rounded-lg border-2 border-dashed border-muted bg-muted/20 flex items-center justify-center">
          <p className="text-muted-foreground">AdSense Banner (728x90)</p>
        </div>
      </div>
    </div>
  )
}
