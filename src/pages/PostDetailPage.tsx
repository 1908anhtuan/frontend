"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth0 } from "@auth0/auth0-react"
import { getPostById } from "../api/postApi"
import { getCommentsByPost } from "../api/commentApi"
import { getBatchVotes } from "../api/VoteApi"
import type { Post, Comment } from "../types/types"

import PostContent from "../components/post/PostContent"
import CommentSection from "../components/comment/CommentSection"
import VoteButtons from "../components/vote/VoteButtons"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Share2, Flag, Edit } from "lucide-react"

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0()
  const navigate = useNavigate()

  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [userVotes, setUserVotes] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
  const fetchData = async () => {
    if (!id) return

    setLoading(true)
    setError(null)

    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: "https://api.communitysphere.dev",
        },
      })

      if (!token) {
        setError("Could not retrieve access token.")
        return
      }

      const [postResponse, commentsResponse] = await Promise.all([
        getPostById(id, token),
        getCommentsByPost(id, token),
      ])

      setPost(postResponse.data)
      setComments(commentsResponse.data)

      const commentIds = getAllCommentIds(commentsResponse.data)
      const votesResponse = await getBatchVotes([id], commentIds, token)

      setUserVotes({
        ...votesResponse.data.postVotes,
        ...votesResponse.data.commentVotes,
      })
    } catch (err: any) {
      console.error("Error fetching post:", err)
      setError("Failed to load post")
    } finally {
      setLoading(false)
    }
  }

  // Wait for full auth state before running
  if (isAuthenticated) {
    fetchData()
  }
}, [id, isAuthenticated, getAccessTokenSilently])

  const getAllCommentIds = (comments: Comment[]): string[] => {
    const ids: string[] = []
    const traverse = (commentList: Comment[]) => {
      commentList.forEach((comment) => {
        ids.push(comment.id)
        if (comment.replies?.length > 0) {
          traverse(comment.replies)
        }
      })
    }
    traverse(comments)
    return ids
  }

  const handleVoteUpdate = (itemId: string, newScore: number, userVote: number, isComment = false) => {
    if (isComment) {
      // Update comment vote score
      const updateComments = (commentList: Comment[]): Comment[] => {
        return commentList.map((comment) => {
          if (comment.id === itemId) {
            return { ...comment, voteScore: newScore }
          }
          if (comment.replies?.length > 0) {
            return { ...comment, replies: updateComments(comment.replies) }
          }
          return comment
        })
      }
      setComments((prev) => updateComments(prev))
    } else {
      // Update post vote score
      setPost((prev) => (prev ? { ...prev, voteScore: newScore } : null))
    }

    setUserVotes((prev) => ({ ...prev, [itemId]: userVote }))
  }

  const handleCommentAdded = (newComment: Comment) => {
    if (newComment.parentCommentId) {
      // Add reply to existing comment
      const updateComments = (commentList: Comment[]): Comment[] => {
        return commentList.map((comment) => {
          if (comment.id === newComment.parentCommentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newComment],
            }
          }
          if (comment.replies?.length > 0) {
            return { ...comment, replies: updateComments(comment.replies) }
          }
          return comment
        })
      }
      setComments((prev) => updateComments(prev))
    } else {
      // Add top-level comment
      setComments((prev) => [newComment, ...prev])
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-1">
            <Skeleton className="h-20 w-12" />
          </div>
          <div className="lg:col-span-11">
            <Skeleton className="h-64 w-full mb-4" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error || "Post not found"}</AlertDescription>
        </Alert>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    )
  }

  const isAuthor = user?.sub === post.authorId

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>

        <div className="flex items-center gap-2">
          {isAuthor && (
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Flag className="h-4 w-4 mr-1" />
            Report
          </Button>
        </div>
      </div>

      {/* Post content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Vote buttons */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="sticky top-24">
            <VoteButtons
              itemId={post.id}
              voteScore={post.voteScore}
              userVote={userVotes[post.id] || 0}
              onVoteUpdate={(newScore, userVote) => handleVoteUpdate(post.id, newScore, userVote)}
              isPost={true}
            />
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-11 order-1 lg:order-2">
          <PostContent post={post} />

          {/* Comments */}
          <div className="mt-8">
            <CommentSection
              postId={post.id}
              comments={comments}
              userVotes={userVotes}
              onVoteUpdate={handleVoteUpdate}
              onCommentAdded={handleCommentAdded}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
