import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import JoinCommunityButton from "./JoinCommunityButton"
import type { Community, CommunitySettingsDto } from "../../types/types"
import { Calendar, Flag, PenSquare, Share2, Users } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth0 } from "@auth0/auth0-react"

interface CommunitySidebarProps {
  community: Community
  settings: CommunitySettingsDto | null
  isMember: boolean
  onMembershipChange: (isMember: boolean) => void
}

export default function CommunitySidebar({ community, isMember, onMembershipChange }: CommunitySidebarProps) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth0()

  // Format creation date
  const createdDate = community.createdAt
    ? new Date(community.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Unknown"

  return (
    <div className="space-y-6">
      {/* About Community Card */}
      <Card>
        <CardHeader>
          <CardTitle>About Community</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Description (shortened) */}
          {community.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">{community.description}</p>
          )}

          {/* Stats */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Members</span>
              </div>
              <span className="font-medium">{community.memberCount || 0}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Created</span>
              </div>
              <span className="text-sm">{createdDate}</span>
            </div>

            {community.createdBy && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <span>Creator</span>
                </div>
                <span className="text-sm font-medium">{community.createdBy}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          {/* Join/Leave button */}
          <JoinCommunityButton
            communityId={community.id}
            isMember={isMember}
            onMembershipChange={onMembershipChange}
            className="w-full"
          />

          {/* Create Post button */}
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            disabled={!isAuthenticated || !isMember}
            onClick={() => navigate(`/community/${community.id}/create-post`)}
          >
            <PenSquare className="h-4 w-4" />
            Create Post
          </Button>
        </CardFooter>
      </Card>

      {/* Community Actions Card */}
      <Card>
        <CardHeader>
          <CardTitle>Community Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            <Share2 className="h-4 w-4 mr-2" />
            Share Community
          </Button>

          <Button variant="ghost" className="w-full justify-start text-destructive">
            <Flag className="h-4 w-4 mr-2" />
            Report Community
          </Button>
        </CardContent>
      </Card>

      {/* Rules Card (placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle>Community Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">This community doesn't have any rules yet.</p>
        </CardContent>
      </Card>
    </div>
  )
}
