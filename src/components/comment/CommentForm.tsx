"use client"

import type React from "react"

import { useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { createComment } from "../../api/commentApi"
import type { Comment, CreateCommentDto } from "../../types/types"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2 } from "lucide-react"

interface CommentFormProps {
  postId: string
  parentCommentId?: string
  onCommentAdded: (comment: Comment) => void
  placeholder?: string
}

export default function CommentForm({
  postId,
  parentCommentId,
  onCommentAdded,
  placeholder = "What are your thoughts?",
}: CommentFormProps) {
  const { isAuthenticated, getAccessTokenSilently, loginWithRedirect, user } = useAuth0()
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      loginWithRedirect()
      return
    }

    if (!content.trim()) return

    setIsSubmitting(true)
    setError(null)

    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: "https://api.communitysphere.dev",
        },
      })

      const commentData: CreateCommentDto = {
        postId,
        content: content.trim(),
        parentCommentId,
      }

      const response = await createComment(commentData, token)
      onCommentAdded(response.data)
      setContent("")
    } catch (err: any) {
      console.error("Error creating comment:", err)
      setError("Failed to post comment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="border rounded-lg p-4 text-center">
        <p className="text-muted-foreground mb-3">Log in to join the discussion</p>
        <Button onClick={() => loginWithRedirect()}>Log In</Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={user?.picture || "/placeholder.svg"} />
          <AvatarFallback className="text-xs">{user?.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className="min-h-[80px] resize-none"
            disabled={isSubmitting}
          />

          {error && <p className="text-sm text-destructive mt-1">{error}</p>}

          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-muted-foreground">{content.length}/10000 characters</span>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setContent("")}
                disabled={!content || isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={!content.trim() || isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Comment"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
