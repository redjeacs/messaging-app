import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

function HomePage() {
  const { user, token } = useAuth();
  return (
    <div>
      HomePage
      <Button>Click me</Button>
    </div>
  );
}

export default HomePage;
