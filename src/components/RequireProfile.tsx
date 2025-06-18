import React from "react";
import { Navigate } from "react-router-dom";
import { useProfile } from "../contexts/ProfileContext";
import { useAuth0 } from "@auth0/auth0-react";

const RequireProfile: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  const { profile, profileLoading } = useProfile();

  if (isLoading || profileLoading) {
    return <div>Loading...</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (profileLoading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <Navigate to="/onboarding" />;
  }

  return <>{children}</>;
};

export default RequireProfile;
