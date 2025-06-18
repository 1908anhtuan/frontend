"use client"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth0 } from "@auth0/auth0-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { createPost } from "../api/postApi"
import type { CreatePostDto } from "../types/types"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, X, ImageIcon, Video, LinkIcon, Loader2, Eye } from "lucide-react"

const formSchema = z.object({
  title: z.string().min(3).max(300),
  content: z.string().min(1).max(10000),
  tags: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function CreatePostPage() {
  const { id: communityId } = useParams<{ id: string }>()
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0()
  const navigate = useNavigate()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [media, setMedia] = useState<{ url: string; type: "image" | "video" }[]>([])
  const [mediaInput, setMediaInput] = useState("")
  const [activeTab, setActiveTab] = useState("write")

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", content: "", tags: "" },
  })

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>You need to be logged in to create a post</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => loginWithRedirect()} className="w-full">
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const onSubmit = async (data: FormValues) => {
    if (!communityId) return
    setIsSubmitting(true)
    setError(null)

    try {
      const token = await getAccessTokenSilently({
        authorizationParams: { audience: "https://api.communitysphere.dev" },
      })

      const postData: CreatePostDto = {
        title: data.title,
        content: data.content,
        communityId: "173e6ba1-aa47-4aab-85b3-2715f7e43ddb",
        tags: tags.length > 0 ? tags : undefined,
        media: media.length > 0 ? media : undefined,
      }
console.log("Post data:", postData)

      const response = await createPost(postData, token)
      navigate(`/post/${response.data.id}`)
    } catch (err: any) {
      console.error("Failed to create post:", err)
      setError(err.response?.data?.message || "Failed to create post. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput) && tags.length < 5) {
      setTags([...tags, tagInput])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => setTags(tags.filter(t => t !== tag))

  const handleAddMedia = () => {
    if (mediaInput && media.length < 5) {
      const type = mediaInput.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? "image" : "video"
      setMedia([...media, { url: mediaInput, type }])
      setMediaInput("")
    }
  }

  const handleRemoveMedia = (i: number) => setMedia(media.filter((_, idx) => idx !== i))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create a Post</h1>
            <p className="text-muted-foreground">Share something with the community</p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title*</FormLabel>
                      <FormControl>
                        <Input placeholder="An interesting title..." {...field} />
                      </FormControl>
                      <FormDescription>{field.value?.length || 0}/300 characters</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content*</FormLabel>
                      <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="write">Write</TabsTrigger>
                          <TabsTrigger value="preview">
                            <Eye className="h-4 w-4 mr-1" /> Preview
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="write">
                          <FormControl>
                            <Textarea placeholder="What's on your mind?" className="min-h-[200px]" {...field} />
                          </FormControl>
                        </TabsContent>
                        <TabsContent value="preview">
                          <div className="min-h-[200px] p-4 border rounded-md bg-muted/30">
                            {field.value ? field.value.split("\n").map((line, i) => (
                              <p key={i}>{line}</p>
                            )) : (
                              <p className="text-muted-foreground italic">Nothing to preview yet...</p>
                            )}
                          </div>
                        </TabsContent>
                      </Tabs>
                      <FormDescription>{field.value?.length || 0}/10,000 characters</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel>Tags (optional)</FormLabel>
                  <div className="flex flex-wrap gap-2 mb-2 min-h-[36px]">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                      placeholder="Add a tag"
                      disabled={tags.length >= 5}
                    />
                    <Button type="button" variant="outline" onClick={handleAddTag} disabled={!tagInput || tags.length >= 5}>
                      Add
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Tags help categorize your post (max 5)</p>
                </div>

                <div>
                  <FormLabel>Media (optional)</FormLabel>
                  <div className="space-y-2 mb-2">
                    {media.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 border rounded">
                        {item.type === "image" ? <ImageIcon className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                        <span className="flex-1 text-sm truncate">{item.url}</span>
                        <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveMedia(i)}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={mediaInput}
                      onChange={(e) => setMediaInput(e.target.value)}
                      placeholder="Image or video URL"
                      disabled={media.length >= 5}
                    />
                    <Button type="button" variant="outline" onClick={handleAddMedia} disabled={!mediaInput || media.length >= 5}>
                      <LinkIcon className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Add images or videos to your post (max 5)</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</>) : ("Create Post")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
