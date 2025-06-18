"use client"

import { useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { castVote } from "../../api/VoteApi"
import { Button } from "@/components/ui/button"
import { ArrowBigUp, ArrowBigDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { VoteRequest } from "../../types/types"

interface VoteButtonsProps {
  itemId: string
  voteScore: number
  userVote: number // -1, 0, or 1
  onVoteUpdate: (newScore: number, userVote: number) => void
  isPost?: boolean
  compact?: boolean
}

export default function VoteButtons({
  itemId,
  voteScore,
  userVote,
  onVoteUpdate,
  isPost = false,
  compact = false,
}: VoteButtonsProps) {
  const { isAuthenticated, getAccessTokenSilently, loginWithRedirect } = useAuth0()
  const [loading, setLoading] = useState(false)

  const handleVote = async (value: -1 | 1) => {
    if (!isAuthenticated) {
      loginWithRedirect()
      return
    }

    setLoading(true)

    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: "https://api.communitysphere.dev",
        },
      })

      // Calculate new vote value (toggle if same, otherwise set new value)
      const newVote = userVote === value ? 0 : value

      // Calculate score change
      const scoreChange = newVote - userVote
      const newScore = voteScore + scoreChange

      // Submit vote
const voteData: VoteRequest = isPost
  ? { postId: itemId, value: newVote as -1 | 0 | 1 }
  : { commentId: itemId, value: newVote as -1 | 0 | 1 }

      await castVote(voteData, token)

      // Update UI
      onVoteUpdate(newScore, newVote)
    } catch (error) {
      console.error("Error submitting vote:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatScore = (score: number) => {
    if (Math.abs(score) >= 1000) {
      return (score / 1000).toFixed(1) + "k"
    }
    return score.toString()
  }

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          disabled={loading}
          onClick={() => handleVote(1)}
          className={cn("h-8 w-8 p-0", userVote === 1 && "text-orange-500 hover:text-orange-600")}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowBigUp className="h-4 w-4" />}
        </Button>

        <span
          className={cn(
            "text-sm font-medium min-w-[2rem] text-center",
            userVote === 1 && "text-orange-500",
            userVote === -1 && "text-blue-500",
          )}
        >
          {formatScore(voteScore)}
        </span>

        <Button
          variant="ghost"
          size="sm"
          disabled={loading}
          onClick={() => handleVote(-1)}
          className={cn("h-8 w-8 p-0", userVote === -1 && "text-blue-500 hover:text-blue-600")}
        >
          <ArrowBigDown className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        disabled={loading}
        onClick={() => handleVote(1)}
        className={cn("h-8 w-8 p-0", userVote === 1 && "text-orange-500 hover:text-orange-600")}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowBigUp className="h-5 w-5" />}
      </Button>

      <span
        className={cn(
          "text-sm font-bold min-w-[2rem] text-center",
          userVote === 1 && "text-orange-500",
          userVote === -1 && "text-blue-500",
        )}
      >
        {formatScore(voteScore)}
      </span>

      <Button
        variant="ghost"
        size="sm"
        disabled={loading}
        onClick={() => handleVote(-1)}
        className={cn("h-8 w-8 p-0", userVote === -1 && "text-blue-500 hover:text-blue-600")}
      >
        <ArrowBigDown className="h-5 w-5" />
      </Button>
    </div>
  )
}
