import axios from "axios";
import { CreateProfileDto } from "../types/CreateProfileDto";
import { UpdateProfileDto } from "../types/UpdateProfileDto"; 

const API_URL = "http://localhost:8080/user-service";

// Function to get the user profile
export const getUserProfile = async (accessToken: string) => {
  console.log('Calling backend with access token:', accessToken);
  return axios.get(`${API_URL}/api/userprofiles/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

// Function to create a new user profile
export const createUserProfile = (data: CreateProfileDto, accessToken: string) => {
  return axios.post(`${API_URL}/api/userprofiles`, data, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};

// Function to update an existing user profile
export const updateUserProfile = (data: UpdateProfileDto, accessToken: string) => {
  return axios.put(`${API_URL}/api/userprofiles`, data, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};

// Function to delete the user profile
export const deleteUserProfile = async (accessToken: string) => {
  return axios.delete(`${API_URL}/api/userprofiles`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};
