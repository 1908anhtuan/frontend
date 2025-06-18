import type { Post } from "../../types/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ArrowBigDown, ArrowBigUp, MessageSquare, Share2 } from "lucide-react"
import { Link } from "react-router-dom"
import { useState } from "react"
import { formatDistanceToNow } from "date-fns"

interface PostCardProps {
  post: Post
  userVote?: number
  onVoteUpdate?: (postId: string, newScore: number, userVote: number) => void
}

export default function PostCard({
  post,
  userVote = 0,
  onVoteUpdate,
}: PostCardProps) {
  const [votes, setVotes] = useState(post.voteScore)
  const [currentUserVote, setCurrentUserVote] = useState<"up" | "down" | null>(
    userVote === 1 ? "up" : userVote === -1 ? "down" : null
  )

  const handleVote = (direction: "up" | "down") => {
    let newVote = 0
    if (currentUserVote === direction) {
      newVote = 0
      setVotes((v) => v - (direction === "up" ? 1 : -1))
      setCurrentUserVote(null)
    } else {
      const change = direction === "up" ? 1 : -1
      const revert = currentUserVote === "up" ? -1 : currentUserVote === "down" ? 1 : 0
      newVote = change
      setVotes((v) => v + change + revert)
      setCurrentUserVote(direction)
    }

    if (onVoteUpdate) {
      onVoteUpdate(post.id, votes + newVote, newVote)
    }
  }

  return (
    <Card className="border border-border rounded-xl">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {post.author?.avatar ? (
            <img
              src={post.author.avatar}
              alt={post.author.username}
              className="w-7 h-7 rounded-full object-cover"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
              {post.author?.username?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}
          <span>
            <span className="text-foreground font-medium">{post.author?.username ?? "Unknown"}</span>{" "}
            • {formatDistanceToNow(new Date(post.createdAt))} ago
          </span>
        </div>

        <Link
          to={`/post/${post.id}`}
          className="mt-2 text-xl font-semibold leading-tight text-foreground hover:underline"
        >
          {post.title}
        </Link>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <p className="text-sm text-muted-foreground line-clamp-3">{post.content}</p>
        {post.content.length > 300 && (
          <Link
            to={`/post/${post.id}`}
            className="text-sm text-primary hover:underline mt-2 inline-block"
          >
            Read more
          </Link>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between flex-wrap gap-4">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8  ${currentUserVote === "up" ? "text-primary" : ""}`}
            onClick={() => handleVote("up")}
          >
            <ArrowBigUp className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center text-sm font-medium">{votes}</span>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${currentUserVote === "down" ? "text-destructive" : ""}`}
            onClick={() => handleVote("down")}
          >
            <ArrowBigDown className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4" />
            <span>Comments</span>
          </Button>

          <Button variant="ghost" size="sm" className="flex items-center gap-1.5">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
