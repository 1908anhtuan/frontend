import { useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { Button } from "@/components/ui/button"
import { Loader2, UserPlus, UserMinus } from "lucide-react"

interface JoinCommunityButtonProps {
  communityId: string
  isMember: boolean
  onMembershipChange: (isMember: boolean) => void
  className?: string
}

export default function JoinCommunityButton({
  communityId,
  isMember,
  onMembershipChange,
  className = "",
}: JoinCommunityButtonProps) {
  const { isAuthenticated, loginWithRedirect } = useAuth0()
  const [loading, setLoading] = useState(false)

  // Handle join/leave community
  const handleToggleMembership = async () => {
    if (!isAuthenticated) {
      loginWithRedirect()
      return
    }

    setLoading(true)

    try {
      // In a real app, you would make an API call to join/leave the community
      // For now, we'll just simulate a delay and toggle the state
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Toggle membership status
      onMembershipChange(!isMember)
    } catch (error) {
      console.error("Error toggling membership:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <Button onClick={() => loginWithRedirect()} className={className}>
        <UserPlus className="h-4 w-4 mr-2" />
        Log in to Join
      </Button>
    )
  }

  return (
    <Button
      variant={isMember ? "outline" : "default"}
      onClick={handleToggleMembership}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : isMember ? (
        <UserMinus className="h-4 w-4 mr-2" />
      ) : (
        <UserPlus className="h-4 w-4 mr-2" />
      )}
      {isMember ? "Leave" : "Join"}
    </Button>
  )
}
