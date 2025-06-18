import { useAuth0 } from "@auth0/auth0-react";
import { useProfile } from "../contexts/ProfileContext";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "./Navbar.css";

const Navbar = () => {
  const { isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();
  const { profile } = useProfile();

  // While Auth0 is rehydrating the session, show a loading state.
  if (isLoading) {
    return (
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-logo">CommunitySphere</div>
          <div className="navbar-buttons">
            <p>Loading...</p>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-logo">CommunitySphere</div>
        <div className="navbar-buttons">
          {/* Add links for Home and Profile */}
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/profile" className="navbar-link">Profile</Link>

          {isAuthenticated ? (
            <div className="navbar-welcome">
              <span className="navbar-welcome-text">
                {profile ? `Welcome, ${profile.displayName}` : 'Welcome'}
              </span>
              <button
                className="navbar-button"
                onClick={() =>
                  logout({ logoutParams: { returnTo: window.location.origin } })
                }
              >
                Log Out
              </button>
            </div>
          ) : (
            <button className="navbar-button" onClick={() => loginWithRedirect({
              authorizationParams: {
                audience: "https://api.communitysphere.dev",
              },
            })}>
              Log In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
