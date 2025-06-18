"use client"

import { useAuth0 } from "@auth0/auth0-react"
import { useProfile } from "../contexts/ProfileContext"
import { Link } from "react-router-dom"
import { useState } from "react"
import { Search, Bell, Menu, LogOut, User, Settings } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import Sidebar from "../components/sidebar"

export default function Navbar() {
  const { isAuthenticated, isLoading, loginWithRedirect, logout, user } = useAuth0()
  const { profile } = useProfile()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const handleLogin = () => {
    loginWithRedirect({
      authorizationParams: {
        audience: "https://api.communitysphere.dev",
      },
    })
  }

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } })
  }

  // Loading state with the new design
  if (isLoading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container flex h-16 items-center px-4">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <div className="h-6 w-6 bg-primary rounded-full"></div>
            <span className="font-bold hidden sm:inline-block">CommunitySphere</span>
          </Link>
          <div className="ml-auto flex items-center">
            <div className="animate-pulse bg-muted rounded-md h-8 w-20"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <>
      {/* Fixed header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container flex h-16 items-center px-4">
          {/* Mobile menu trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <Sidebar />
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <div className="h-6 w-6 bg-primary rounded-full"></div>
            <span className="font-bold hidden sm:inline-block">CommunitySphere</span>
          </Link>

          {/* Search */}
          <div className="flex-1 flex items-center">
            <div className={`relative ${isSearchOpen ? "w-full" : "hidden md:flex md:w-full max-w-md"}`}>
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search communities and posts..." className="pl-8 bg-muted" />
            </div>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </div>

          {/* Navigation and user menu */}
          <nav className="flex items-center space-x-3 ml-auto">
            {/* Navigation links */}
            <Link to="/" className="text-sm font-medium hidden md:block">
              Home
            </Link>

            {isAuthenticated && (
              <>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hidden md:flex">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-muted-foreground">No new notifications</DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>


                {/* Welcome text (visible on larger screens) */}
                <span className="text-sm font-medium hidden lg:block">
                  {profile ? `Welcome, ${profile.displayName}` : "Welcome"}
                </span>
              </>
            )}

            {/* User menu or login button */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={profile?.avatarUrl || user?.picture || "/placeholder.svg"}
                        alt={profile?.displayName || user?.name || "User"}
                      />
                      <AvatarFallback>{profile?.displayName?.charAt(0) || user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/profile" className="w-full flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/settings" className="w-full flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={handleLogin}>Log In</Button>
            )}
          </nav>
        </div>
      </header>

      <div className="h-16"></div>
    </>
  )
}
