import logo from "../assets/logo.webp";
import messagesIcon from "../assets/messages.webp";
import userIcon from "../assets/user.svg";
import devProfileIcon from "../assets/devprofiles.jpg";
import signoutIcon from "../assets/signout.webp";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Sidebar() {
  const { user } = useAuth();
  const handleSignout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <aside className="fixed w-full bottom-0 h-16 md:left-0 md:top-0 md:h-screen md:w-22 bg-gray-900 text-white flex md:flex-col shadow-lg z-40">
      <div className="p-2 md:p-5 md:border-b border-r border-gray-800">
        <img src={logo} alt="" className="w-full h-full" />
      </div>
      <nav className="flex-1 p-2 md:p-4 text-center px-4">
        <ul className="flex md:flex-col gap-4 items-center h-full md:h-auto justify-start">
          <Link
            to="/"
            className="md:p-4 cursor-pointer hover:bg-gray-800 rounded w-6 h-6 md:w-full md:h-full"
          >
            <li>
              <img src={messagesIcon} alt="" className="w-full h-full" />{" "}
            </li>
          </Link>
          <Link
            to="/profile"
            className="md:p-4 cursor-pointer hover:bg-gray-800 rounded w-6 h-6 md:w-full md:h-full"
          >
            <li>
              <img src={userIcon} alt="" className="w-full h-full" />{" "}
            </li>
          </Link>
        </ul>
      </nav>
      <div
        className="p-3 md:p-4 md:m-4 m-2 cursor-pointer hover:bg-gray-800 rounded"
        onClick={handleSignout}
      >
        <img src={signoutIcon} alt="" className="w-full h-full" />
      </div>
      <div className="p-2 md:p-5 md:border-t md:border-l-0 border-l border-gray-800 h-16 w-16 md:w-22 md:h-22">
        <img
          src={user?.profile || devProfileIcon}
          alt=""
          className="w-full h-full rounded-full object-cover cursor-pointer"
        />
      </div>
    </aside>
  );
}

export default Sidebar;
