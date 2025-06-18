"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth0 } from "@auth0/auth0-react"
import { getPostsByCommunity } from "../api/postApi"
import { getCommunityById } from "../api/communityServceApi"
import { getBatchVotes } from "../api/VoteApi"
import type { Post, Community } from "../types/types"

import PostCard from "../features/community/post-card"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PenSquare, ArrowLeft, Flame, Clock, Star, TrendingUp } from "lucide-react"
import Sidebar from "@/components/sidebar" // ✅ add this at the top

export default function CommunityPostsPage() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()
  const navigate = useNavigate()

  const [community, setCommunity] = useState<Community | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [userVotes, setUserVotes] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("hot")

  useEffect(() => {
  const fetchData = async () => {
    if (!id || !isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          },
        });


      const [communityResponse, postsResponse] = await Promise.all([
        getCommunityById(id, token),
        getPostsByCommunity(id, token),
      ]);


      setCommunity(communityResponse.data);
      setPosts(sortPosts(postsResponse.data, sortBy));

      if (postsResponse.data.length > 0) {
        console.log("Posts data from backend:", postsResponse.data);

        const postIds = postsResponse.data.map(p => p.id);
        console.log("Calling getBatchVotes with:", {
    postIds: postsResponse.data.map(p => p.id),
    commentIds: [],
    token,
  });
        const votesResponse = await getBatchVotes(postIds, [], token);
        console.log("Votes response:ddd", votesResponse);

        setUserVotes(votesResponse.data.postVotes);
      }

    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load community posts");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [id, isAuthenticated, getAccessTokenSilently, sortBy]);


  const sortPosts = (posts: Post[], sortType: string) => {
    const sorted = [...posts]

    switch (sortType) {
      case "hot":
        return sorted.sort((a, b) => b.voteScore - a.voteScore)
      case "new":
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      case "top":
        return sorted.sort((a, b) => b.voteScore - a.voteScore)
      case "rising":
        // Simple rising algorithm based on vote score and recency
        return sorted.sort((a, b) => {
          const aScore = a.voteScore * (1 + 1 / (Date.now() - new Date(a.createdAt).getTime()))
          const bScore = b.voteScore * (1 + 1 / (Date.now() - new Date(b.createdAt).getTime()))
          return bScore - aScore
        })
      default:
        return sorted
    }
  }

  const handleVoteUpdate = (postId: string, newScore: number, userVote: number) => {
    setPosts((prev) => prev.map((post) => (post.id === postId ? { ...post, voteScore: newScore } : post)))
    setUserVotes((prev) => ({ ...prev, [postId]: userVote }))
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !community) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error || "Community not found"}</AlertDescription>
        </Alert>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    )
  }

  return (
  <div className="min-h-screen bg-[#f5f7f9]">
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-20">
            <Sidebar />
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{community.name}</h1>
                <p className="text-muted-foreground">{posts.length} posts</p>
              </div>
            </div>

            <Button onClick={() => navigate(`/community/${id}/create-post`)}>
              <PenSquare className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </div>

          {/* Sort Tabs */}
          <Tabs value={sortBy} onValueChange={setSortBy} className="mb-6">
            <TabsList className="grid w-full grid-cols-4 max-w-md">
              <TabsTrigger value="hot" className="flex items-center gap-1">
                <Flame className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Hot</span>
              </TabsTrigger>
              <TabsTrigger value="new" className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">New</span>
              </TabsTrigger>
              <TabsTrigger value="top" className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Top</span>
              </TabsTrigger>
              <TabsTrigger value="rising" className="flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Rising</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Posts List */}
          {posts.length === 0 ? (
            <Card className="p-8 text-center">
              <h3 className="text-xl font-medium mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-4">Be the first to post in this community!</p>
              <Button onClick={() => navigate(`/community/${id}/create-post`)}>Create Post</Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  userVote={userVotes[post.id] || 0}
                  onVoteUpdate={handleVoteUpdate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)}
