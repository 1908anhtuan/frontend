import { useAuth0 } from "@auth0/auth0-react";

const ShowToken = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const handleShowToken = async () => {
    try {
      const token = await getAccessTokenSilently();
      console.log("Access Token:", token);
      alert("Access token printed to console!");
    } catch (error) {
      console.error("Error getting token", error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <button onClick={handleShowToken}>
      Show JWT Token
    </button>
  );
};

export default ShowToken;
