export interface Community {
    id: string
    name: string
    slug: string //ft
    description?: string
    memberCount: number //ft
    createdAt?: string
    isPublic?: boolean
    createdBy?: string
    tags?: string[]
    theme?: {
      primaryColor: string
      bannerImage?: string
    }
    welcomeMessage?: string
  }
  
  export interface User {
    id: string
    username: string
    avatar?: string
    createdAt: string
  }
  
 export interface Post {
  id: string
  title: string
  content: string
  authorId: string
  voteScore: number
  tags: string[]
  media: { url: string; type: "image" | "video" }[]
  createdAt: string
  updatedAt?: string  
  author?: User
  community?: Community
  commentCount?: number
}
  
  export interface CreateCommunityDto {
  name: string
  description?: string
  isPrivate: boolean
  theme?: {
    primaryColor: string
    bannerImage?: string
  }
  welcomeMessage?: string
  tags?: string[]
}

export interface CommunitySettingsDto {
  theme: string // "light" | "dark"
  isContentMature: boolean
  welcomeMessage?: string
  maxPostLength: number
}

export interface CreateCommunitySettingsRequest {
  theme?: string
  isContentMature?: boolean
  welcomeMessage?: string
  maxPostLength?: number
}

export interface UpdateCommunitySettingsRequest {
  theme?: string
  isContentMature?: boolean
  welcomeMessage?: string
  maxPostLength?: number
}
export interface Comment {
  id: string
  postId: string
  parentCommentId?: string
  authorId: string
  content: string
  voteScore: number
  isDeleted: boolean
  isEdited: boolean
  createdAt: string
  replies: Comment[]
  author?: User
}
export interface CreateCommentDto {
  postId: string
  content: string
  parentCommentId?: string
}

export interface UpdateCommentDto {
  content: string
}

export interface Vote {
  postId?: string
  commentId?: string
  value: -1 | 0 | 1
}

export interface CreatePostDto {
  title: string
  content: string
  communityId: string
  tags?: string[]
  media?: { url: string; type: "image" | "video" }[]
}

export interface VoteRequest {
  postId?: string
  commentId?: string
  value: -1 | 0 | 1
}

export interface BatchVoteRequest {
  postIds: string[]
  commentIds: string[]
}

export interface BatchVoteResultDto {
  postVotes: Record<string, number>
  commentVotes: Record<string, number>
}
