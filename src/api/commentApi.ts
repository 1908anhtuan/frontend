import axios from "axios"
import type { Comment, CreateCommentDto, UpdateCommentDto } from "../types/types"

const API_URL = `${import.meta.env.VITE_API_GATEWAY_URL}/core-service`


export const getCommentsByPost = (postId: string, accessToken: string) => {
  return axios.get<Comment[]>(`${API_URL}/api/comments/post/${postId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

export const getCommentById = (commentId: string, accessToken: string) => {
  return axios.get<Comment>(`${API_URL}/api/comments/${commentId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

export const createComment = (data: CreateCommentDto, accessToken: string) => {
  return axios.post<Comment>(`${API_URL}/api/comments`, data, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

export const updateComment = (commentId: string, data: UpdateCommentDto, accessToken: string) => {
  return axios.put(`${API_URL}/api/comments/${commentId}`, data, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

export const deleteComment = (commentId: string, accessToken: string) => {
  return axios.delete(`${API_URL}/api/comments/${commentId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}
