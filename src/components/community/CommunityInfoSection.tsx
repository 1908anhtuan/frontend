import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Community, CommunitySettingsDto } from "../../types/types"
import { Info, Tag } from "lucide-react"

interface CommunityInfoSectionProps {
  community: Community
  settings: CommunitySettingsDto | null
}

export default function CommunityInfoSection({ community, settings }: CommunityInfoSectionProps) {
  // Extract tags from community if they exist
  const tags = community.tags || []

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        {/* Description */}
        {community.description && (
          <div className="mb-4">
            <h2 className="text-lg font-medium mb-2">About</h2>
            <p className="text-muted-foreground">{community.description}</p>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">Tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Welcome message */}
        {(community.welcomeMessage || settings?.welcomeMessage) && (
          <>
            <Separator className="my-4" />
            <div className="bg-muted/30 rounded-lg p-4 flex items-start gap-3">
              <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium mb-1">Welcome to {community.name}</h3>
                <p className="text-sm text-muted-foreground">{community.welcomeMessage || settings?.welcomeMessage}</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
