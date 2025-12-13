import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="">
      <Sidebar />
      <main className="flex h-[calc(100vh-4rem)] md:h-screen md:ml-22">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
