
import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth0 } from "@auth0/auth0-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { createCommunity, initializeCustomSettings } from "../api/communityServceApi"
import type { CreateCommunityDto, CreateCommunitySettingsRequest } from "../types/types"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import {
  Info,
  X,
  AlertCircle,
  Loader2,
  Users,
  Settings,
  Palette,
  MessageSquare,
  Tag,
  Lock,
  Unlock,
  Eye,
  EyeOff,
} from "lucide-react"

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Community name must be at least 3 characters")
    .max(50, "Community name must be less than 50 characters")
    .regex(/^[a-zA-Z0-9\s]+$/, "Only alphanumeric characters and spaces are allowed"),
  description: z.string().max(500),
  isPrivate: z.boolean(),
  welcomeMessage: z.string().max(1000),
  primaryColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color"),
  theme: z.enum(["light", "dark", "system"]),
  isContentMature: z.boolean(),
  maxPostLength: z.number().min(100).max(10000),
})

export type FormValues = z.infer<typeof formSchema>

export default function CreateCommunityPage() {
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("basic")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [previewColor, setPreviewColor] = useState("#4f46e5")

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      isPrivate: false,
      welcomeMessage: "Welcome to our community! We're glad you're here.",
      primaryColor: "#4f46e5", // Default indigo color
      theme: "light",
      isContentMature: false,
      maxPostLength: 5000,
    },
  })

  // Watch for color changes to update preview
  const watchedColor = form.watch("primaryColor")
  if (watchedColor !== previewColor) {
    setPreviewColor(watchedColor || "#4f46e5")
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>You need to be logged in to create a community</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => loginWithRedirect()} className="w-full">
              Log In
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true)
      setError(null)

      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: "https://api.communitysphere.dev",
        },
      })

      // Prepare community data
      const communityData: CreateCommunityDto = {
        name: data.name,
        description: data.description || "",
        isPrivate: data.isPrivate,
        theme: {
          primaryColor: data.primaryColor || "#4f46e5",
        },
        welcomeMessage: data.welcomeMessage,
        tags: tags.length > 0 ? tags : undefined,
      }

      // Create community
      const response = await createCommunity(communityData, token)
      const communityId = response.data.id

      // Initialize community settings
      const settingsData: CreateCommunitySettingsRequest = {
        theme: data.theme,
        isContentMature: data.isContentMature,
        welcomeMessage: data.welcomeMessage,
        maxPostLength: data.maxPostLength,
      }

      await initializeCustomSettings(communityId, settingsData, token)

      // Redirect to the new community page
      navigate(`/community/${communityId}`)
    } catch (err: any) {
      console.error("Failed to create community:", err)
      setError(err.response?.data?.message || "Failed to create community. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle adding tags
  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput) && tags.length < 5) {
      setTags([...tags, tagInput])
      setTagInput("")
    }
  }

  // Handle removing tags
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  // Handle tag input keydown
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Create a Community</h1>
          <p className="text-muted-foreground">
            Set up a new community for people to join and discuss topics that matter to you.
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Basic Info</span>
                </TabsTrigger>
                <TabsTrigger value="appearance" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  <span>Appearance</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Community Details</CardTitle>
                    <CardDescription>Enter the basic information about your community</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Community Name*</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter community name" {...field} />
                          </FormControl>
                          <FormDescription>This will be the display name of your community</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe what your community is about"
                              className="min-h-[120px]"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormDescription>A brief description of your community's purpose</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <FormLabel className="mb-0">Tags (up to 5)</FormLabel>
                        <Tag className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2 min-h-[36px]">
                        {tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="flex items-center gap-1 px-3 py-1">
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
                        {tags.length === 0 && (
                          <span className="text-sm text-muted-foreground italic">No tags added yet</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleTagKeyDown}
                          placeholder="Add a tag"
                          disabled={tags.length >= 5}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleAddTag}
                          disabled={!tagInput || tags.length >= 5}
                        >
                          Add
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Tags help people find your community</p>
                    </div>

                    <FormField
                      control={form.control}
                      name="isPrivate"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <FormLabel className="text-base mb-0">
                                {field.value ? "Private Community" : "Public Community"}
                              </FormLabel>
                              {field.value ? (
                                <Lock className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Unlock className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                            <FormDescription>
                              {field.value
                                ? "Only approved members can view and participate"
                                : "Anyone can view and join this community"}
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Appearance Tab */}
              <TabsContent value="appearance" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Community Appearance</CardTitle>
                    <CardDescription>Customize how your community looks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="primaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Theme Color</FormLabel>
                          <div className="flex items-center gap-4">
                            <div
                              className="w-10 h-10 rounded-full border"
                              style={{ backgroundColor: field.value || "#4f46e5" }}
                            />
                            <FormControl>
                              <Input type="color" {...field} value={field.value || "#4f46e5"} />
                            </FormControl>
                          </div>
                          <FormDescription>Choose a primary color for your community</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="theme"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Theme</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a theme" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="light">Light</SelectItem>
                              <SelectItem value="dark">Dark</SelectItem>
                              <SelectItem value="system">System Default</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>Default theme for your community</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-4">Preview</h3>
                      <div className="border rounded-lg overflow-hidden">
                        <div className="h-16 w-full" style={{ backgroundColor: previewColor }}></div>
                        <div className="p-4 bg-card">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full" style={{ backgroundColor: previewColor }}></div>
                            <div>
                              <h4 className="font-medium">{form.getValues("name") || "Community Name"}</h4>
                              <p className="text-xs text-muted-foreground">
                                {form.getValues("isPrivate") ? "Private Community" : "Public Community"}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {form.getValues("description") || "Community description will appear here"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Community Settings</CardTitle>
                    <CardDescription>Configure how your community operates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="welcomeMessage"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2 mb-1">
                            <FormLabel className="mb-0">Welcome Message</FormLabel>
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <FormControl>
                            <Textarea
                              placeholder="Welcome to our community! We're glad you're here."
                              className="min-h-[120px]"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormDescription>This message will be shown to new members when they join</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isContentMature"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <FormLabel className="text-base mb-0">Mature Content</FormLabel>
                              {field.value ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                            <FormDescription>
                              {field.value
                                ? "This community contains mature content"
                                : "This community is suitable for all audiences"}
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxPostLength"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Post Length</FormLabel>
                          <div className="space-y-4">
                            <FormControl>
                              <Slider
                                min={100}
                                max={10000}
                                step={100}
                                defaultValue={[field.value]}
                                onValueChange={(value) => field.onChange(value[0])}
                              />
                            </FormControl>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">100 characters</span>
                              <span className="text-sm font-medium">{field.value} characters</span>
                              <span className="text-sm text-muted-foreground">10,000 characters</span>
                            </div>
                          </div>
                          <FormDescription>Set the maximum length for posts in your community</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <div className="bg-muted/30 rounded-lg p-4 flex items-start gap-3">
                  <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Additional community settings like rules, post approval requirements, and moderation tools can be
                    configured after creation from the community settings page.
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between pt-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>Your community creation progress will be lost.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Continue Editing</AlertDialogCancel>
                    <AlertDialogAction onClick={() => navigate("/")}>Discard Changes</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Community"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
