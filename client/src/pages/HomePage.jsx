import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link, Navigate } from "react-router-dom";

function HomePage() {
  const { user, token } = useAuth();

  const handleSignout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div>
      {!user && <Navigate to="/signin" />}
      <Button onClick={handleSignout}>sign out</Button>
      <Button>
        <Link to="/signin">sign in</Link>
      </Button>
    </div>
  );
}

export default HomePage;
