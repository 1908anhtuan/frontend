import { useAuth0 } from "@auth0/auth0-react"
import { useEffect, useState } from "react"
import {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
} from "../api/userServiceApi"
import type { CreateProfileDto } from "../types/CreateProfileDto"
import type { UpdateProfileDto } from "../types/UpdateProfileDto"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../components/ui/avatar"
import { Button } from "../components/ui/button"
import { Textarea } from "../components/ui/textarea"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog"
import { Pencil, Save, Trash2, User, X } from "lucide-react"

interface UserProfile extends CreateProfileDto {
  auth0Id: string
}

const ProfilePage = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [bio, setBio] = useState("")
  const [activeTab, setActiveTab] = useState("profile")

  useEffect(() => {
    const fetchProfile = async () => {
      if (isAuthenticated && user) {
        setLoading(true)
        try {
          const accessToken = await getAccessTokenSilently({
            authorizationParams: {
              audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
          })

          const response = await getUserProfile(accessToken)
          setProfile(response.data)
          setBio(response.data.bio || "")
        } catch (err: unknown) {
          if (
            typeof err === "object" &&
            err !== null &&
            "response" in err &&
            (err as any).response.status === 404
          ) {
            try {
              const accessToken = await getAccessTokenSilently({
                authorizationParams: {
                  audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                },
              })

              const profileData: CreateProfileDto = {
                displayName: user.name ?? "Anonymous",
                bio: "",
                avatarUrl: user.picture || "",
              }

              const createResponse = await createUserProfile(
                profileData,
                accessToken
              )
              setProfile(createResponse.data)
            } catch (createError) {
              setError("Failed to create your profile. Please try again.")
            }
          } else {
            setError("Failed to load your profile. Please try again.")
          }
        } finally {
          setLoading(false)
        }
      }
    }

    fetchProfile()
  }, [isAuthenticated, user, getAccessTokenSilently])

  const handleUpdateProfile = async () => {
    if (profile) {
      setLoading(true)
      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
        })

        const updatedProfileData: UpdateProfileDto = { bio }

        const response = await updateUserProfile(updatedProfileData, accessToken)
        setProfile(response.data)
        setEditing(false)
      } catch {
        setError("Failed to update your profile. Please try again.")
      } finally {
        setLoading(false)
      }
    }
  }

  const handleDeleteProfile = async () => {
    if (profile) {
      setLoading(true)
      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
        })

        await deleteUserProfile(accessToken)
        setProfile(null)
      } catch {
        setError("Failed to delete your profile. Please try again.")
      } finally {
        setLoading(false)
      }
    }
  }

  const cancelEditing = () => {
    setBio(profile?.bio || "")
    setEditing(false)
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to view your profile</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button>Log In</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {loading && !profile ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading your profile...</p>
          </div>
        ) : error ? (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => setError(null)}>
                Dismiss
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 flex flex-col md:flex-row items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={profile?.avatarUrl || user?.picture} alt={profile?.displayName} />
                <AvatarFallback className="text-2xl">
                  {profile?.displayName?.charAt(0) || user?.name?.charAt(0) || <User />}
                </AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold">{profile?.displayName || user?.name}</h1>
                <p className="text-muted-foreground">Member since {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>About Me</CardTitle>
                      {!editing && (
                        <Button variant="ghost" size="icon" onClick={() => setEditing(true)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {editing ? (
                      <div className="space-y-4">
                        <Textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="Tell us about yourself..."
                          className="min-h-[120px]"
                        />
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={cancelEditing} disabled={loading}>
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                          </Button>
                          <Button onClick={handleUpdateProfile} disabled={loading}>
                            {loading ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-background"></div>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="prose max-w-none">
                        {profile?.bio ? (
                          <p>{profile.bio}</p>
                        ) : (
                          <p className="text-muted-foreground italic">No bio provided. Click edit to add your bio.</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Account ID</p>
                        <p className="text-sm text-muted-foreground truncate">{profile?.auth0Id || user?.sub}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-6">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Profile
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your profile and remove your data
                            from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteProfile}
                            className="bg-destructive text-destructive-foreground"
                          >
                            {loading ? "Deleting..." : "Delete Profile"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your posts, comments, and interactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="rounded-full bg-muted p-3 mb-4">
                        <User className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium">No activity yet</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your recent posts and comments will appear here
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage
