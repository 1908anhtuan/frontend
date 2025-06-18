"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import type { Comment } from "../../types/types"

import CommentForm from "./CommentForm"
import VoteButtons from "../vote/VoteButtons"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Reply, Edit, Flag, ChevronDown, ChevronUp } from "lucide-react"

interface CommentThreadProps {
  comment: Comment
  postId: string
  userVotes: Record<string, number>
  onVoteUpdate: (commentId: string, newScore: number, userVote: number, isComment: boolean) => void
  onCommentAdded: (comment: Comment) => void
  level: number
}

export default function CommentThread({
  comment,
  postId,
  userVotes,
  onVoteUpdate,
  onCommentAdded,
  level,
}: CommentThreadProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showReplies] = useState(true)

  const maxLevel = 6 // Maximum nesting level
  const isMaxLevel = level >= maxLevel

  const handleReplyAdded = (newComment: Comment) => {
    onCommentAdded(newComment)
    setShowReplyForm(false)
  }

  if (comment.isDeleted) {
    return (
      <div className={`${level > 0 ? "ml-6 border-l-2 border-muted pl-4" : ""}`}>
        <div className="text-muted-foreground italic text-sm py-2">[Comment deleted]</div>
        {comment.replies && comment.replies.length > 0 && showReplies && (
          <div className="space-y-3 mt-3">
            {comment.replies.map((reply) => (
              <CommentThread
                key={reply.id}
                comment={reply}
                postId={postId}
                userVotes={userVotes}
                onVoteUpdate={onVoteUpdate}
                onCommentAdded={onCommentAdded}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`${level > 0 ? "ml-6 border-l-2 border-muted pl-4" : ""}`}>
      <div className="flex gap-3">
        {/* Vote buttons */}
        <div className="flex-shrink-0">
          <VoteButtons
            itemId={comment.id}
            voteScore={comment.voteScore}
            userVote={userVotes[comment.id] || 0}
            onVoteUpdate={(newScore, userVote) => onVoteUpdate(comment.id, newScore, userVote, true)}
            isPost={false}
            compact={true}
          />
        </div>

        {/* Comment content */}
        <div className="flex-1 min-w-0">
          {/* Comment header */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={comment.author?.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-xs">{comment.author?.username?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <span className="font-medium">u/{comment.author?.username || "Unknown"}</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
            {comment.isEdited && (
              <>
                <span>•</span>
                <Badge variant="outline" className="text-xs">
                  edited
                </Badge>
              </>
            )}

            {/* Collapse button for threads with replies */}
            {comment.replies && comment.replies.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="h-5 w-5 p-0 ml-auto"
              >
                {isCollapsed ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
              </Button>
            )}
          </div>

          {/* Comment content */}
          {!isCollapsed && (
            <>
              <div className="mb-3">
                <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
              </div>

              {/* Comment actions */}
              <div className="flex items-center gap-2 mb-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="h-6 text-xs"
                  disabled={isMaxLevel}
                >
                  <Reply className="h-3 w-3 mr-1" />
                  Reply
                </Button>

                <Button variant="ghost" size="sm" className="h-6 text-xs">
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>

                <Button variant="ghost" size="sm" className="h-6 text-xs">
                  <Flag className="h-3 w-3 mr-1" />
                  Report
                </Button>
              </div>

              {/* Reply form */}
              {showReplyForm && (
                <div className="mb-3">
                  <CommentForm
                    postId={postId}
                    parentCommentId={comment.id}
                    onCommentAdded={handleReplyAdded}
                    placeholder="Write a reply..."
                  />
                </div>
              )}
            </>
          )}

          {/* Collapsed indicator */}
          {isCollapsed && comment.replies && comment.replies.length > 0 && (
            <div className="text-sm text-muted-foreground">
              [{comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"} hidden]
            </div>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && !isCollapsed && showReplies && (
            <div className="space-y-3 mt-3">
              {comment.replies.map((reply) => (
                <CommentThread
                  key={reply.id}
                  comment={reply}
                  postId={postId}
                  userVotes={userVotes}
                  onVoteUpdate={onVoteUpdate}
                  onCommentAdded={onCommentAdded}
                  level={level + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
