
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Plus, PenSquare, Flame, Clock, Star } from "lucide-react"
import { mockCommunities } from "@/lib/mock-data"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-full space-y-4 py-2">
      <div className="flex flex-col space-y-2 px-2">
        <Button className="w-full justify-start" onClick={() => navigate("/create-community")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Community
        </Button>

        <Button className="w-full justify-start">
          <PenSquare className="mr-2 h-4 w-4" />
          Create Post
        </Button>
      </div>

      <Separator />

      <div className="px-2">
        <h3 className="mb-2 px-4 text-lg font-semibold tracking-tight">Discover</h3>
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start">
            <Flame className="mr-2 h-4 w-4" />
            Popular
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Clock className="mr-2 h-4 w-4" />
            New
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Star className="mr-2 h-4 w-4" />
            Following
          </Button>
        </div>
      </div>

      <Separator />

      <div className="px-2">
        <h3 className="mb-2 px-4 text-lg font-semibold tracking-tight">Top Communities</h3>
        <ScrollArea className="h-[300px]">
          <div className="space-y-1">
            {mockCommunities.map((community) => (
              <Link
                key={community.id}
                to={`/community/${community.slug}`}
                className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
              >
                <div className="w-6 h-6 rounded-full bg-primary mr-2 flex-shrink-0"></div>
                <span className="truncate">{community.name}</span>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
