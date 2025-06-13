import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Mail, MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ContactForm } from "@/components/contact-form"

export const metadata: Metadata = {
  title: "Contact Us - ImageTools",
  description: "Get in touch with the ImageTools team for questions, feedback, or support.",
}

export default function ContactPage() {
  return (
    <div className="mx-auto py-12">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tools
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Contact Us</h1>
        <p className="mt-2 text-muted-foreground">Have questions or feedback? We'd love to hear from you.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-4">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-muted-foreground">support@imagetools.example.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Live Chat</h3>
                  <p className="text-muted-foreground">Available Monday-Friday, 9am-5pm EST</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>FAQ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Are all tools free to use?</h3>
                <p className="text-muted-foreground">
                  Yes, all our tools are completely free to use with no hidden fees.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Do you store uploaded images?</h3>
                <p className="text-muted-foreground">
                  No, we process images in your browser and don't store them on our servers.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Is there a file size limit?</h3>
                <p className="text-muted-foreground">Most tools have a 10MB limit, but this may vary by tool.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
