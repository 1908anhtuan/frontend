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
      "Artificial intelligence is rapidly evolving and becoming more integrated into our daily lives. From smart assistants to recommendation systems, AI is changing how we interact with technology. What are your thoughts on how AI will shape our future in the next decade? I believe we'll see more personalized experiences and automation of routine tasks, but there are also concerns about privacy and job displacement that need to be addressed.",
    votes: 128,
    commentCount: 32,
    createdAt: "2023-05-15T14:30:00Z",
    author: mockUsers[0],
    community: mockCommunities[0],
  },
  {
    id: "2",
    title: "Best Practices for React Performance Optimization",
    content:
      "After working on several large-scale React applications, I've compiled some best practices for optimizing performance. These include: using React.memo for component memoization, implementing useMemo and useCallback hooks effectively, code splitting with React.lazy, and virtualizing long lists. What performance optimization techniques have worked well for your React projects?",
    votes: 95,
    commentCount: 24,
    createdAt: "2023-05-18T09:45:00Z",
    author: mockUsers[2],
    community: mockCommunities[1],
  },
  {
    id: "3",
    title: "Design Trends to Watch in 2023",
    content:
      "This year is seeing some interesting shifts in design trends. Minimalism is evolving with more playful elements, dark mode is becoming standard, 3D elements are more prominent, and micro-interactions are enhancing user experience. As a designer, I'm particularly excited about the increased focus on accessibility and inclusive design practices. What design trends are you most excited about this year?",
    votes: 87,
    commentCount: 19,
    createdAt: "2023-05-20T16:15:00Z",
    author: mockUsers[3],
    community: mockCommunities[2],
  },
  {
    id: "4",
    title: "The Most Anticipated Games of the Year",
    content:
      "With several major releases on the horizon, this is shaping up to be an exciting year for gamers. From sequels to beloved franchises to innovative new IPs, there's something for everyone. I'm personally looking forward to the new open-world RPG that was announced last month. Which upcoming games are you most excited to play?",
    votes: 112,
    commentCount: 45,
    createdAt: "2023-05-22T11:20:00Z",
    author: mockUsers[1],
    community: mockCommunities[3],
  },
  {
    id: "5",
    title: "Recent Breakthroughs in Quantum Computing",
    content:
      "Quantum computing research has seen some significant advancements recently. Scientists have achieved new milestones in qubit stability and error correction, bringing us closer to practical quantum computers. These developments could revolutionize fields like cryptography, drug discovery, and complex system simulation. What implications do you think quantum computing will have on your field of interest?",
    votes: 76,
    commentCount: 15,
    createdAt: "2023-05-25T13:50:00Z",
    author: mockUsers[2],
    community: mockCommunities[4],
  },
]
