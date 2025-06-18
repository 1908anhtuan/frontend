import React, { useState, useEffect } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { CreateProfileDto } from "../types/CreateProfileDto"
import { createUserProfile } from "../api/userServiceApi"
import { useProfile } from "../contexts/ProfileContext"
import { useNavigate } from "react-router-dom"

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

const OnboardingPage = () => {
  const { user, getAccessTokenSilently } = useAuth0()
  const { profile, setProfile } = useProfile()
  const navigate = useNavigate()

  const [displayName, setDisplayName] = useState(user?.name || "")
  const [bio, setBio] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (profile) navigate("/profile")
  }, [profile, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: "openid profile email",
        },
      })

      const profileData: CreateProfileDto = {
        displayName: displayName || "Anonymous",
        bio: bio,
      }

      const response = await createUserProfile(profileData, accessToken)
      setProfile(response.data)
      navigate("/")
    } catch (err) {
      setError("Error creating profile. Please try again.")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Display Name</label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us a bit about yourself"
                rows={4}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button type="submit">Create Profile</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default OnboardingPage
