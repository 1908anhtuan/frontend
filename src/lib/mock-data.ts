import type { Community, Post, User } from "../types/types"

// Mock Users
export const mockUsers: User[] = [
  {
    id: "1",
    username: "johndoe",
    avatar: "/placeholder.svg",
    createdAt: "2023-01-15T00:00:00Z",
  },
  {
    id: "2",
    username: "janedoe",
    avatar: "/placeholder.svg",
    createdAt: "2023-02-20T00:00:00Z",
  },
  {
    id: "3",
    username: "techguru",
    avatar: "/placeholder.svg",
    createdAt: "2023-03-10T00:00:00Z",
  },
  {
    id: "4",
    username: "designmaster",
    avatar: "/placeholder.svg",
    createdAt: "2023-04-05T00:00:00Z",
  },
]

// Mock Communities
export const mockCommunities: Community[] = [
  {
    id: "1",
    name: "Technology",
    slug: "technology",
    description: "Discuss the latest in tech",
    memberCount: 15420,
    createdAt: "2022-12-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Programming",
    slug: "programming",
    description: "Share code and programming tips",
    memberCount: 12350,
    createdAt: "2023-01-10T00:00:00Z",
  },
  {
    id: "3",
    name: "Design",
    slug: "design",
    description: "For designers and design enthusiasts",
    memberCount: 8760,
    createdAt: "2023-02-15T00:00:00Z",
  },
  {
    id: "4",
    name: "Gaming",
    slug: "gaming",
    description: "All things gaming",
    memberCount: 20150,
    createdAt: "2023-03-20T00:00:00Z",
  },
  {
    id: "5",
    name: "Science",
    slug: "science",
    description: "Scientific discoveries and discussions",
    memberCount: 9870,
    createdAt: "2023-04-25T00:00:00Z",
  },
  {
    id: "6",
    name: "Books",
    slug: "books",
    description: "Book recommendations and discussions",
    memberCount: 7650,
    createdAt: "2023-05-30T00:00:00Z",
  },
  {
    id: "7",
    name: "Movies",
    slug: "movies",
    description: "Film discussions and reviews",
    memberCount: 11230,
    createdAt: "2023-06-05T00:00:00Z",
  },
]

// Mock Posts
export const mockPosts: Post[] = [
  {
    id: "1",
    title: "The Future of AI in Everyday Applications",
    content:
      "Artificial intelligence is rapidly evolving and becoming more integrated into our daily lives...",
    voteScore: 120,
    commentCount: 32,
    createdAt: "2023-05-15T14:30:00Z",
    author: mockUsers[0],
    authorId: mockUsers[0].id, 
    community: mockCommunities[0],
    tags: ["ai", "technology"], 
    media: [], 
  },
  {
    id: "1",
    title: "The Future of AI in Everyday Applications",
    content:
      "Artificial intelligence is rapidly evolving and becoming more integrated into our daily lives...",
    voteScore: 120,
    commentCount: 32,
    createdAt: "2023-05-15T14:30:00Z",
    author: mockUsers[0],
    authorId: mockUsers[0].id, 
    community: mockCommunities[0],
    tags: ["ai", "technology"], 
    media: [], 
  },
 {
    id: "1",
    title: "The Future of AI in Everyday Applications",
    content:
      "Artificial intelligence is rapidly evolving and becoming more integrated into our daily lives...",
    voteScore: 120,
    commentCount: 32,
    createdAt: "2023-05-15T14:30:00Z",
    author: mockUsers[0],
    authorId: mockUsers[0].id, 
    community: mockCommunities[0],
    tags: ["ai", "technology"], 
    media: [], 
  },
 {
    id: "1",
    title: "The Future of AI in Everyday Applications",
    content:
      "Artificial intelligence is rapidly evolving and becoming more integrated into our daily lives...",
    voteScore: 120,
    commentCount: 32,
    createdAt: "2023-05-15T14:30:00Z",
    author: mockUsers[0],
    authorId: mockUsers[0].id, 
    community: mockCommunities[0],
    tags: ["ai", "technology"], 
    media: [], 
  },
 {
    id: "1",
    title: "The Future of AI in Everyday Applications",
    content:
      "Artificial intelligence is rapidly evolving and becoming more integrated into our daily lives...",
    voteScore: 120,
    commentCount: 32,
    createdAt: "2023-05-15T14:30:00Z",
    author: mockUsers[0],
    authorId: mockUsers[0].id, 
    community: mockCommunities[0],
    tags: ["ai", "technology"], 
    media: [], 
  },
]
