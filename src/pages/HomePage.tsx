import { useEffect, useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Rocket, Flame, Clock, Star, Filter } from "lucide-react"
import PostList from "@/features/community/post-list"
import Sidebar from "@/components/sidebar"
import { mockPosts } from "@/lib/mock-data"
import type { Post } from "@/types/types"

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("hot")

  useEffect(() => {
    // Simulate API fetch with a delay
    const fetchPosts = async () => {
      try {
        setIsLoading(true)
        // In a real app, this would be an API call
        // const response = await fetch('/api/posts')
        // const data = await response.json()

        // Using mock data for now
        setTimeout(() => {
          // Sort posts based on the selected filter
          const sortedPosts = [...mockPosts]

          if (sortBy === "hot") {
            sortedPosts.sort((a, b) => b.voteScore - a.voteScore)
          } else if (sortBy === "new") {
            sortedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          } else if (sortBy === "top") {
            sortedPosts.sort((a, b) => b.voteScore - a.voteScore)
          } else if (sortBy === "rising") {
            // This would normally use an algorithm combining recency and vote velocity
            // For now, we'll just use a simple combination of votes and recency
            sortedPosts.sort((a, b) => {
              const aScore = a.voteScore * (1 + 1 / (new Date().getTime() - new Date(a.createdAt).getTime()))
              const bScore = b.voteScore * (1 + 1 / (new Date().getTime() - new Date(b.createdAt).getTime()))
              return bScore - aScore
            })
          }

          setPosts(sortedPosts)
          setIsLoading(false)
        }, 1000)
      } catch (err) {
        setError("Failed to load posts")
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [sortBy])

  return (
    <div className="min-h-screen bg-[#f5f7f9]">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Sidebar - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-20">
              <Sidebar />
            </div>
          </div>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Feed Header */}
            <div className="bg-white rounded-lg shadow-sm mb-4 p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h1 className="text-xl font-bold">Your Feed</h1>

              {/* Sort/Filter Options */}
              <Tabs value={sortBy} onValueChange={setSortBy} className="w-full sm:w-auto">
                <TabsList className="grid grid-cols-4 w-full sm:w-auto">
                  <TabsTrigger value="hot" className="flex items-center gap-1.5">
                    <Flame className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Hot</span>
                  </TabsTrigger>
                  <TabsTrigger value="new" className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">New</span>
                  </TabsTrigger>
                  <TabsTrigger value="top" className="flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Top</span>
                  </TabsTrigger>
                  <TabsTrigger value="rising" className="flex items-center gap-1.5">
                    <Rocket className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Rising</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5" />
                Filter
              </Button>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              {isLoading ? (
                <div className="flex flex-col justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="text-muted-foreground mt-4">Loading the latest posts...</p>
                </div>
              ) : error ? (
                <div className="bg-destructive/10 text-destructive p-6 rounded-md">
                  <h3 className="font-medium mb-2">Error Loading Posts</h3>
                  <p>{error}</p>
                  <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                    Try Again
                  </Button>
                </div>
              ) : posts.length === 0 ? (
                <div className="bg-muted/30 p-8 rounded-lg text-center">
                  <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Rocket className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No posts yet</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Join communities or create your own post to get started!
                  </p>
                  <div className="mt-6">
                    <Button>Create Post</Button>
                  </div>
                </div>
              ) : (
                <PostList posts={posts} />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
