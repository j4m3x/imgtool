"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Search } from "lucide-react"

import { ToolCard } from "@/components/tool-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toolCategories } from "@/lib/tools"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter tools based on search query
  const filteredCategories = toolCategories
    .map((category) => {
      const filteredTools = category.tools.filter(
        (tool) =>
          tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      return {
        ...category,
        tools: filteredTools,
      }
    })
    .filter((category) => category.tools.length > 0)

  return (
    <div className="mx-auto py-12">
      <section className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl">All-in-One Image Tools</h1>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
          Free online tools for image editing, compression, conversion, and more. No login required.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="#tools">
              Explore Tools <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="mb-12 max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for tools..."
            className="pl-10 h-12 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      <section id="tools" className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold">All Tools</h2>

        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <div key={category.name} className="mb-12">
              <h3 className="mb-6 flex items-center text-2xl font-semibold">
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </h3>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {category.tools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No tools found matching your search.</p>
            <Button variant="link" onClick={() => setSearchQuery("")}>
              Clear search
            </Button>
          </div>
        )}
      </section>

      <section className="rounded-lg bg-muted p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold">Why Choose Our Tools?</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="flex flex-col items-center">
            <div className="mb-2 rounded-full bg-primary p-3 text-primary-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                <path d="M13 2v7h7" />
              </svg>
            </div>
            <h3 className="mb-1 text-lg font-medium">No Login Required</h3>
            <p className="text-muted-foreground">Use all tools without creating an account</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-2 rounded-full bg-primary p-3 text-primary-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M12 2v4" />
                <path d="M12 18v4" />
                <path d="m4.93 4.93 2.83 2.83" />
                <path d="m16.24 16.24 2.83 2.83" />
                <path d="M2 12h4" />
                <path d="M18 12h4" />
                <path d="m4.93 19.07 2.83-2.83" />
                <path d="m16.24 7.76 2.83-2.83" />
              </svg>
            </div>
            <h3 className="mb-1 text-lg font-medium">Lightning Fast</h3>
            <p className="text-muted-foreground">Process images quickly with our optimized tools</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-2 rounded-full bg-primary p-3 text-primary-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h3 className="mb-1 text-lg font-medium">Privacy First</h3>
            <p className="text-muted-foreground">Your images are processed locally when possible</p>
          </div>
        </div>
      </section>
    </div>
  )
}
