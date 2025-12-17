import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import userProfileIcon from "@/assets/user.svg";
import { Spinner } from "../components/ui/spinner";

function ProfileImagePopup({ setImageFormOpen }) {
  const { user, setUser, token } = useAuth();
  const [preview, setPreview] = useState(user?.profile || userProfileIcon);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileImageUpdate = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const fileInput = e.target.elements.profile;
      const file = fileInput.files[0];
      if (!file) {
        alert("Please select an image file.");
        setIsUploading(false);
        return;
      }
      const formData = new FormData();
      formData.append("profile", file);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/user/profile-image`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to update profile image.");
      } else {
        alert("Profile image updated successfully.");
        setUser({ ...user, profile: data.user.profile });
        setImageFormOpen(false);
      }
      setIsUploading(false);
    } catch (error) {
      console.error("Error uploading profile image:", error);
      setIsUploading(false);
      alert("Failed to upload profile image. Please try again.");
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black opacity-50 z-10"
        onClick={() => setImageFormOpen(false)}
      ></div>
      <div className="absolute z-10 bg-white border max-w-[85vw] border-gray-300 rounded shadow-lg top-10 left-1/2 transform -translate-x-1/2">
        {isUploading ? (
          <Spinner />
        ) : (
          <>
            <button
              className="absolute top-0 right-0 px-2 font-bold text-gray-600 hover:text-gray-800 cursor-pointer"
              onClick={() => setImageFormOpen(false)}
            >
              x
            </button>
            <form onSubmit={handleProfileImageUpdate}>
              <div className="flex flex-col gap-4 p-4 items-center">
                <label htmlFor="profile" className="font-bold mb-1">
                  Update Profile Image
                </label>
                <img
                  src={preview}
                  alt="profile"
                  className="w-32 h-32 rounded-full object-cover mb-2 bg-gray-400"
                />
                <input
                  type="file"
                  id="profile"
                  name="profile"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="border border-gray-300 rounded p-2 max-w-full bg-gray-100 cursor-pointer hover:border-gray-400"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700"
                >
                  Upload
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </>
  );
}

export default ProfileImagePopup;
