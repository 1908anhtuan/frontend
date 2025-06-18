// communityServiceApi.ts
import axios from "axios"
import type {
  Community,
  CreateCommunityDto,
  CommunitySettingsDto,
  CreateCommunitySettingsRequest,
  UpdateCommunitySettingsRequest
} from "../types/types"

const API_URL = "http://localhost:8080/community-service"

// --- Communities ---

export const createCommunity = async (data: CreateCommunityDto, accessToken: string) => {
  return axios.post<Community>(`${API_URL}/api/community`, data, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

export const getCommunityById = async (communityId: string, accessToken: string) => {
    console.log('Calling backend with access token in community service:', accessToken);

  return axios.get(`${API_URL}/api/community/${communityId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

export const updateCommunity = async (
  communityId: string,
  data: Partial<CreateCommunityDto>,
  accessToken: string
) => {
  return axios.put(`${API_URL}/api/community/${communityId}`, data, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

export const deleteCommunity = async (communityId: string, accessToken: string) => {
  return axios.delete(`${API_URL}/api/community/${communityId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

// --- Community Settings ---

export const getCommunitySettings = async (communityId: string, accessToken: string) => {
  return axios.get<CommunitySettingsDto>(`${API_URL}/api/community-settings/${communityId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

export const updateCommunitySettings = async (
  communityId: string,
  data: UpdateCommunitySettingsRequest,
  accessToken: string
) => {
  return axios.put(`${API_URL}/api/community-settings/${communityId}`, data, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

export const initializeDefaultSettings = async (communityId: string, accessToken: string) => {
  return axios.post(`${API_URL}/api/community-settings/${communityId}/initialize-default`, null, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

export const initializeCustomSettings = async (
  communityId: string,
  data: CreateCommunitySettingsRequest,
  accessToken: string
) => {
  return axios.post(`${API_URL}/api/community-settings/${communityId}/initialize-custom`, data, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

export const resetCommunitySettings = async (communityId: string, accessToken: string) => {
  return axios.post(`${API_URL}/api/community-settings/${communityId}/reset`, null, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}
