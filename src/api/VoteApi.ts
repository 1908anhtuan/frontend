import axios from "axios"
import type { BatchVoteResultDto, VoteRequest } from "../types/types"

const API_URL = import.meta.env.VITE_CORESERVICE_API_URL || "http://localhost:8080/core-service"

// --- Votes ---

export const castVote = (data: VoteRequest, accessToken: string) => {
  return axios.post(`${API_URL}/api/v1/vote`, data, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

export const getUserVote = (
  accessToken: string,
  postId?: string,
  commentId?: string
) => {
  const query = new URLSearchParams()
  if (postId) query.append("postId", postId)
  if (commentId) query.append("commentId", commentId)

  return axios.get<number | null>(`${API_URL}/api/v1/vote/user-vote?${query.toString()}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

export const getBatchVotes = (
  postIds: string[],
  commentIds: string[],
  accessToken: string
) => {
    console.log("Sending token to backend:", accessToken)
console.log("Is array: getbatch votes" );

  return axios.post<BatchVoteResultDto>(`${API_URL}/api/v1/vote/batch`, {
    postIds,
    commentIds,
  }, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}
