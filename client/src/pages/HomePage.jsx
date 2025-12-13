import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link, Navigate } from "react-router-dom";
import ChatList from "@/components/ChatList";

function HomePage() {
  const { user, token } = useAuth();

  return (
    <div className="w-full p-4">
      {!user && <Navigate to="/signin" />}

      <ChatList />
    </div>
  );
}

export default HomePage;
