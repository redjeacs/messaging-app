import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link, Navigate } from "react-router-dom";

function HomePage() {
  const { user, token } = useAuth();

  return (
    <div>
      {!user && <Navigate to="/signin" />}

      <Button>
        <Link to="/signin">sign in</Link>
      </Button>
    </div>
  );
}

export default HomePage;
