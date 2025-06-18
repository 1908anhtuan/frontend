"use client"

import { useState } from "react"
import type { Comment } from "../../types/types"

import CommentForm from "./CommentForm"
import CommentThread from "./CommentThread"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MessageSquare } from "lucide-react"

interface CommentSectionProps {
  postId: string
  comments: Comment[]
  userVotes: Record<string, number>
  onVoteUpdate: (commentId: string, newScore: number, userVote: number, isComment: boolean) => void
  onCommentAdded: (comment: Comment) => void
}

export default function CommentSection({
  postId,
  comments,
  userVotes,
  onVoteUpdate,
  onCommentAdded,
}: CommentSectionProps) {
  const [sortBy, setSortBy] = useState<"best" | "new" | "old">("best")

  const sortedComments = [...comments].sort((a, b) => {
    switch (sortBy) {
      case "new":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "old":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "best":
      default:
        return b.voteScore - a.voteScore
    }
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comments ({comments.length})
          </CardTitle>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "best" | "new" | "old")}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="best">Best</option>
            <option value="new">New</option>
            <option value="old">Old</option>
          </select>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Comment form */}
        <CommentForm postId={postId} onCommentAdded={onCommentAdded} />

        <Separator />

        {/* Comments list */}
        {sortedComments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedComments.map((comment) => (
              <CommentThread
                key={comment.id}
                comment={comment}
                postId={postId}
                userVotes={userVotes}
                onVoteUpdate={onVoteUpdate}
                onCommentAdded={onCommentAdded}
                level={0}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
