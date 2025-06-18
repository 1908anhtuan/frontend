import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import JoinCommunityButton from "./JoinCommunityButton"
import type { Community } from "../../types/types"
import { Lock, Unlock, Users } from "lucide-react"

interface CommunityHeaderProps {
  community: Community
  isMember: boolean
  onMembershipChange: (isMember: boolean) => void
}

export default function CommunityHeader({ community, isMember, onMembershipChange }: CommunityHeaderProps) {
  // Default theme color if not provided
  const themeColor = community.theme?.primaryColor || "#4f46e5"

  return (
    <div className="mb-6">
      {/* Banner */}
      <div
        className="h-32 w-full rounded-t-lg bg-gradient-to-r from-primary/80 to-primary/40"
        style={{
          backgroundColor: themeColor,
          backgroundImage: community.theme?.bannerImage
            ? `url(${community.theme.bannerImage})`
            : `linear-gradient(to right, ${themeColor}80, ${themeColor}40)`,
        }}
      />

      {/* Community info card */}
      <Card className="-mt-6 border-t-0 rounded-t-none">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Community avatar */}
              <div
                className="w-16 h-16 rounded-full border-4 border-background flex items-center justify-center text-white font-bold text-xl"
                style={{ backgroundColor: themeColor }}
              >
                {community.name.charAt(0).toUpperCase()}
              </div>

              <div>
                {/* Community name and badges */}
                <div className="flex items-center flex-wrap gap-2">
                  <h1 className="text-2xl font-bold">{community.name}</h1>

                  <Badge
                    variant={community.isPublic !== false ? "outline" : "secondary"}
                    className="flex items-center gap-1"
                  >
                    {community.isPublic !== false ? (
                      <>
                        <Unlock className="h-3 w-3" />
                        <span>Public</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-3 w-3" />
                        <span>Private</span>
                      </>
                    )}
                  </Badge>
                </div>

                {/* Member count */}
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  <span>{community.memberCount || 0} members</span>
                </div>
              </div>
            </div>

            {/* Join/Leave button */}
            <JoinCommunityButton
              communityId={community.id}
              isMember={isMember}
              onMembershipChange={onMembershipChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
