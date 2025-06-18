import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth0 } from "@auth0/auth0-react"
import { getCommunityById, getCommunitySettings } from "../api/communityServceApi"
import type { Community, CommunitySettingsDto } from "../types/types"

import CommunityHeader from "../components/community/CommunityHeader"
import CommunityInfoSection from "../components/community/CommunityInfoSection"
import CommunitySidebar from "../components/community/CommunitySideBar"
import PostList from "../features/community/post-list"
import { mockPosts } from "../lib/mock-data"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { PenSquare, AlertCircle, ArrowLeft } from "lucide-react"

export default function CommunityDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated, getAccessTokenSilently, loginWithRedirect, isLoading: authLoading } = useAuth0()
  const navigate = useNavigate()

  const [community, setCommunity] = useState<Community | null>(null)
  const [settings, setSettings] = useState<CommunitySettingsDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("posts")
  const [isMember, setIsMember] = useState(false)

  // Fetch community data
  useEffect(() => {
    if (authLoading || !id) return

    const fetchCommunityData = async () => {
      console.log("Fetching data for community ID:", id)

      setLoading(true)
      setError(null)

      try {
        let token = ""
        if (isAuthenticated) {
          token = await getAccessTokenSilently({
            authorizationParams: {
              audience: "https://api.communitysphere.dev",
            },
          })
        }

        const communityResponse = await getCommunityById(id, token)
        setCommunity(communityResponse.data)

        const settingsResponse = await getCommunitySettings(id, token)
        setSettings(settingsResponse.data)

        setIsMember(false)
      } catch (err: any) {
        console.error("Error while loading community:", err)
        setError(err.response?.data?.message || "Failed to load community details")
      } finally {
        setLoading(false)
      }
    }

    fetchCommunityData()
  }, [id, isAuthenticated, authLoading, getAccessTokenSilently])

  const handleMembershipChange = (newStatus: boolean) => {
    setIsMember(newStatus)
  }

  // Render loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-48" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Skeleton className="h-40 w-full mb-6" />
            <Skeleton className="h-24 w-full mb-4" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-4">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    )
  }

  // Render error state
  if (error || !community) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || "Community not found"}</AlertDescription>
        </Alert>

        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left column - Main content */}
        <div className="lg:col-span-8">
          {/* Community header */}
          <CommunityHeader community={community} isMember={isMember} onMembershipChange={handleMembershipChange} />

          {/* Community info section */}
          <CommunityInfoSection community={community} settings={settings} />

          {/* Create post button */}
          <div className="mb-6">
            <Button
              className="w-full flex items-center gap-2"
              disabled={!isAuthenticated || !isMember}
              onClick={() => navigate(`/community/${id}/create-post`)}
            >
              <PenSquare className="h-4 w-4" />
              Create Post
            </Button>

            {!isAuthenticated && (
              <p className="text-sm text-muted-foreground mt-2 text-center">
                <Button variant="link" onClick={() => loginWithRedirect()} className="p-0 h-auto">
                  Log in
                </Button>{" "}
                to create posts in this community
              </p>
            )}

            {isAuthenticated && !isMember && (
              <p className="text-sm text-muted-foreground mt-2 text-center">Join this community to create posts</p>
            )}
          </div>

          {/* Tabs for different content types */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
            </TabsList>

            {/* Posts tab */}
            <TabsContent value="posts" className="pt-4">
              {mockPosts.length > 0 ? (
                <PostList posts={mockPosts.filter((post) => post.community?.id === id)} />
              ) : (
                <Card className="p-8 text-center">
                  <h3 className="text-xl font-medium mb-2">No posts yet</h3>
                  <p className="text-muted-foreground mb-4">Be the first to post in this community!</p>
                  <Button
                    disabled={!isAuthenticated || !isMember}
                    onClick={() => navigate(`/community/${id}/create-post`)}
                  >
                    Create Post
                  </Button>
                </Card>
              )}
            </TabsContent>

            {/* About tab */}
            <TabsContent value="about" className="pt-4">
              <Card className="p-6">
                <h3 className="text-xl font-medium mb-4">About this Community</h3>
                <p className="mb-4">{community.description || "No description provided."}</p>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">Created:</span>
                  <span className="text-sm text-muted-foreground">
                    {community.createdAt ? new Date(community.createdAt).toLocaleDateString() : "Unknown"}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-medium">Type:</span>
                  <span className="text-sm text-muted-foreground">
                    {community.isPublic !== false ? "Public" : "Private"} Community
                  </span>
                </div>

                <Separator className="my-4" />

                <h4 className="font-medium mb-2">Community Rules</h4>
                <p className="text-sm text-muted-foreground">This community doesn't have any rules yet.</p>
              </Card>
            </TabsContent>

            {/* Members tab */}
            <TabsContent value="members" className="pt-4">
              <Card className="p-6">
                <h3 className="text-xl font-medium mb-4">Members</h3>
                <p className="text-muted-foreground">This community has {community.memberCount || 0} members.</p>

                <Separator className="my-4" />

                <h4 className="font-medium mb-2">Moderators</h4>
                <p className="text-sm text-muted-foreground">Moderator information not available.</p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right column - Sidebar */}
        <div className="lg:col-span-4">
          <CommunitySidebar
            community={community}
            settings={settings}
            isMember={isMember}
            onMembershipChange={handleMembershipChange}
          />
        </div>
      </div>
    </div>
  )
}
