import axios from "axios"
import type { Post, CreatePostDto } from "../types/types"

const API_URL = `${import.meta.env.VITE_API_GATEWAY_URL}/core-service`

// --- Posts ---

export const getPostsByCommunity = (communityId: string, accessToken: string) => {
  return axios.get<Post[]>(`${API_URL}/api/v1/posts/community/${communityId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

export const getPostById = (postId: string, accessToken: string) => {
  return axios.get<Post>(`${API_URL}/api/v1/posts/${postId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

export const createPost = (data: CreatePostDto, accessToken: string) => {
  return axios.post<Post>(`${API_URL}/api/v1/posts`, data, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

export const updatePost = (postId: string, data: Partial<CreatePostDto>, accessToken: string) => {
  return axios.put<Post>(`${API_URL}/api/v1/posts/${postId}`, data, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

export const deletePost = (postId: string, accessToken: string) => {
  return axios.delete(`${API_URL}/api/v1/posts/${postId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}
