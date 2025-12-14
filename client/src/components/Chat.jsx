import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import devProfileIcon from "../assets/devprofiles.jpg";
import userProfileIcon from "../assets/user.svg";

function Chat({ chatId }) {
  const { user, token } = useAuth();
  const [chat, setChat] = useState({});
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchChat = async () => {
      if (chatId && token) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/messages/${chatId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setChat(data);
            const friendUsers = data.users.find(
              (chatUser) => chatUser.id !== user.id
            );
            setFriends(friendUsers);
          } else {
            console.error("Failed to fetch chat messages");
          }
        } catch (error) {
          console.error("Error fetching chat messages:", error);
        }
      }
    };
    fetchChat();
  }, [chatId]);

  console.log(friends);

  return (
    <div>
      <header className="flex p-4 gap-2 items-end border-b">
        <img
          src={
            chat.name !== "One on One Chat"
              ? devProfileIcon
              : friends?.profile || userProfileIcon
          }
          alt="profile"
          className="w-10 h-10 bg-gray-500 rounded-full object-cover p-1"
        />
        <div className="flex flex-col">
          <p className="font-bold text-lg">
            {chat.name !== "One on One Chat"
              ? chat.name
              : friends?.name || "Name"}
          </p>
          {chat.name === "One on One Chat" && (
            <div className="flex items-center text-xs">
              <p>{friends?.email || "Email"}</p>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default Chat;
