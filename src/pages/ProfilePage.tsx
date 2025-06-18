import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { getUserProfile, createUserProfile, updateUserProfile, deleteUserProfile } from "../api/userServiceApi";
import { CreateProfileDto } from "../types/CreateProfileDto";
import { UpdateProfileDto } from "../types/UpdateProfileDto"; // Assuming you have this DTO for updates

interface UserProfile {
  auth0Id: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
}

const ProfilePage = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<boolean>(false); // Track if the profile is being edited
  const [bio, setBio] = useState<string>(""); // Local state for editing bio

  useEffect(() => {
    const fetchProfile = async () => {
      if (isAuthenticated && user) {
        setLoading(true);
        try {
          const accessToken = await getAccessTokenSilently({
            authorizationParams: {
              audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            }
          });

          const response = await getUserProfile(accessToken);
          setProfile(response.data);
          setBio(response.data.bio || ""); // Set the bio if it exists
        } catch (err: any) {
          if (err.response && err.response.status === 404) {
            try {
              const accessToken = await getAccessTokenSilently({
                authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE }
              });

              const profileData: CreateProfileDto = {
                displayName: user.name ?? "Anonymous",
                bio: "",
                avatarUrl: "",
              };

              const createResponse = await createUserProfile(profileData, accessToken);
              setProfile(createResponse.data);
            } catch (createError: any) {
              setError("Failed to create your profile. Please try again.");
            }
          } else {
            setError("Failed to load your profile. Please try again.");
          }
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  const handleUpdateProfile = async () => {
    if (profile) {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE }
      });

      const updatedProfileData: UpdateProfileDto = {
        bio, // Only update the bio for now
      };

      try {
        const response = await updateUserProfile(updatedProfileData, accessToken);
        setProfile(response.data);
        setEditing(false); // Stop editing once the profile is updated
      } catch (updateError) {
        setError("Failed to update your profile. Please try again.");
      }
    }
  };

  const handleDeleteProfile = async () => {
    if (profile) {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE }
      });

      try {
        await deleteUserProfile(accessToken);
        setProfile(null); // Remove the profile after successful deletion
      } catch (deleteError) {
        setError("Failed to delete your profile. Please try again.");
      }
    }
  };

  if (!isAuthenticated) {
    return <div>Please log in to view your profile.</div>;
  }

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="profile-page">
      <h1>Your Profile</h1>
      {profile ? (
        <div className="profile-details">
          <p><strong>Name:</strong> {profile.displayName}</p>
          {editing ? (
            <div>
              <label>
                Bio:
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                />
              </label>
              <button onClick={handleUpdateProfile}>Save Changes</button>
            </div>
          ) : (
            <div>
              <p><strong>Bio:</strong> {profile.bio}</p>
              <button onClick={() => setEditing(true)}>Edit Bio</button>
            </div>
          )}
          {profile.avatarUrl && <img src={profile.avatarUrl} alt="Profile Avatar" />}
          <div>
            <button onClick={handleDeleteProfile}>Delete Profile</button>
          </div>
        </div>
      ) : (
        <p>No profile data found.</p>
      )}
    </div>
  );
};

export default ProfilePage;
