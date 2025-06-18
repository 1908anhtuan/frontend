import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getUserProfile } from "../api/userServiceApi";

export interface UserProfile {
  auth0Id: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  roles?: string[];
}

interface ProfileContextType {
  profile: UserProfile | null;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  refreshProfile: () => void;
  profileLoading: boolean;
}

const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  setProfile: () => {},
  refreshProfile: () => {},
  profileLoading: true,
});

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const refreshProfile = async () => {
    if (isAuthenticated && user) {
      setProfileLoading(true);
      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          },
        });

        const response = await getUserProfile(accessToken);
        console.log("Profile fetched:", response.data);
        setProfile(response.data);
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          console.log("Profile not found, setting profile to null");
          setProfile(null);
        } else {
          console.error("Error fetching profile", err);
        }
      } finally {
        setProfileLoading(false);
      }
    } else {
      setProfileLoading(false); // Not authenticated, don't wait
    }
  };

  useEffect(() => {
    refreshProfile();
  }, [isAuthenticated, user]);

  return (
    <ProfileContext.Provider
      value={{ profile, setProfile, refreshProfile, profileLoading }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
