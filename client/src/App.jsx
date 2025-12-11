import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header/Navbar */}
      <main className="flex p-4 justify-center items-center grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
