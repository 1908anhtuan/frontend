import { formatDistanceToNow } from "date-fns"
import type { Post } from "../../types/types"

import MediaPreview from "./MediaPreview"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from "react-router-dom"

interface PostContentProps {
  post: Post
}

export default function PostContent({ post }: PostContentProps) {
  return (
    <Card>
      <CardHeader>
        {/* Community and author info */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          {post.community && (
            <>
              <Link to={`/community/${post.community.id}`} className="font-medium hover:underline">
                c/{post.community.name}
              </Link>
              <span>•</span>
            </>
          )}
          <span>Posted by</span>
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={post.author?.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-xs">{post.author?.username?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <span className="font-medium">u/{post.author?.username || "Unknown"}</span>
          </div>
          <span>•</span>
          <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
          {post.updatedAt && post.updatedAt !== post.createdAt && (
            <>
              <span>•</span>
              <span className="italic">edited</span>
            </>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold">{post.title}</h1>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent>
        {/* Content */}
        <div className="prose prose-sm max-w-none mb-6">
          {post.content.split("\n").map((paragraph, index) => (
            <p key={index} className="mb-3 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Media */}
        {post.media && post.media.length > 0 && <MediaPreview media={post.media} />}
      </CardContent>
    </Card>
  )
}
