import { BrowserRouter as Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePageVercel";
import OnboardingPage from "../pages/OnboardingPage";
import RequireProfile from "../components/RequireProfile";
import CreateCommunityPage from "@/pages/CreateCommunityPage";
import CommunityDetailPage from "@/pages/CommunityDetailPage"
import CommunityPostsPage from "@/pages/CommunityPostsPage";
import CreatePostPage from "@/pages/CreatePostPage";
import PostDetailPage from "@/pages/PostDetailPage";
const AppRouter = () => {
  return (
    
      <Routes>
        {/* The onboarding page is available at /onboarding */}
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Protected route, profile required */}
        <Route
          path="/profile"
          element={
            <RequireProfile>
              <ProfilePage />
            </RequireProfile>
          }
        />

          <Route path="/community/:id/posts" element={<CommunityPostsPage />} />

        <Route
          path="/create-community"
          element={
              <CreateCommunityPage />
          }
        />
        {/* Redirect logic for root (/) */}
        <Route
          path="/"
          element={
            //<RequireProfile>
              <HomePage />
            //</RequireProfile>
          }
        />
                <Route path="/CreatePost/:id" element={<CreatePostPage />} />

                <Route path="/post/:id" element={<PostDetailPage />} />

        <Route path="/community/:id" element={<CommunityDetailPage />} />
      </Routes>
    
  );
};

export default AppRouter;
