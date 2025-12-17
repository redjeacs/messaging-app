import userProfileIcon from "../assets/user.svg";
import cameraIcon from "../assets/camera.webp";
import editIcon from "../assets/edit.webp";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileImagePopup from "@/components/ProfileImagePopup";

function ProfilePage() {
  const navigate = useNavigate();
  const { user, token, setUser } = useAuth();

  useEffect(() => {
    if (!user || !token) navigate("/signin");
  }, [user, token]);

  if (!user || !token) return null;

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [nameEdit, setNameEdit] = useState(false);
  const [emailEdit, setEmailEdit] = useState(false);
  const [imageFormOpen, setImageFormOpen] = useState(false);

  const handleNameChange = async () => {
    if (user.name === name) return setNameEdit(false);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        setName(user.name);
      } else if (data.user) {
        setUser({ ...user, name: data.user.name });
        setName(data.user.name);
      } else {
        setUser({ ...user, name });
        setName(name);
      }

      setNameEdit(false);
    } catch (err) {
      console.error("Error updating name:", err);
      setNameEdit(false);
    }
  };

  const handleEmailChange = async () => {
    if (user.email === email) return setEmailEdit(false);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        setEmail(user.email);
      } else if (data.user) {
        setUser({ ...user, email: data.user.email });
        setEmail(data.user.email);
      } else {
        setUser({ ...user, email });
        setEmail(email);
      }

      setEmailEdit(false);
    } catch (err) {
      console.error("Error updating email:", err);
      setEmailEdit(false);
    }
  };

  const openImageUpdateForm = () => {
    setImageFormOpen(true);
  };

  return (
    <div className="flex w-full p-4 justify-center items-center h-full">
      <div className="flex flex-col items-center bg-white min-w-[300px] w-1/2 h-full rounded-lg gap-8">
        <header className="text-2xl text-white p-2 bg-gray-800 w-full flex justify-center rounded-t-lg">
          Profile
        </header>
        <div className="bg-gray-400 rounded-full">
          <div className="relative">
            <img
              src={user.profile ? user.profile : userProfileIcon}
              alt="profile"
              className="w-34 h-34 rounded-full object-cover"
            />
            <img
              src={cameraIcon}
              alt="camera"
              onClick={openImageUpdateForm}
              className="bg-gray-800 w-8 h-8 absolute bottom-0 right-0 rounded-full p-1 cursor-pointer hover:transform hover:scale-110"
            />
            {imageFormOpen && (
              <ProfileImagePopup setImageFormOpen={setImageFormOpen} />
            )}
          </div>
        </div>
        <div className="min-w-[280px] w-1/2 h-full">
          <form>
            <div className="flex flex-col gap-4">
              <div className="relative flex flex-col">
                <label htmlFor="name" className="font-bold mb-1">
                  Name
                </label>
                <input
                  autoComplete="off"
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  readOnly={!nameEdit}
                  className="border border-gray-300 rounded p-2 bg-gray-100"
                />
                {nameEdit ? (
                  <button
                    type="button"
                    className={`absolute right-0 border px-1 rounded-sm cursor-pointer ${
                      user.name === name
                        ? "text-gray-400 border-gray-400"
                        : "text-green-600 border-green-600"
                    }`}
                    onClick={handleNameChange}
                  >
                    Save
                  </button>
                ) : (
                  <img
                    src={editIcon}
                    alt="edit"
                    onClick={() => setNameEdit(true)}
                    className="absolute right-0 w-6 h-6 cursor-pointer hover:transform hover:scale-110"
                  />
                )}
              </div>
              <div className="relative flex flex-col">
                <label htmlFor="email" className="font-bold mb-1">
                  Email
                </label>
                <input
                  autoComplete="off"
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly={!emailEdit}
                  className="border border-gray-300 rounded p-2 bg-gray-100"
                />

                {emailEdit ? (
                  <button
                    type="button"
                    className={`absolute right-0 border px-1 rounded-sm cursor-pointer ${
                      user.email === email
                        ? "text-gray-400 border-gray-400"
                        : "text-green-600 border-green-600"
                    }`}
                    onClick={handleEmailChange}
                  >
                    Save
                  </button>
                ) : (
                  <img
                    src={editIcon}
                    alt="edit"
                    onClick={() => setEmailEdit(true)}
                    className="absolute right-0 w-6 h-6 cursor-pointer hover:transform hover:scale-110"
                  />
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
