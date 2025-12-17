import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import devProfileIcon from "../assets/devprofiles.jpg";
import userProfileIcon from "../assets/user.svg";
import sendIcon from "../assets/send.webp";
import Message from "./Message";

function Chat({ chatId }) {
  const { user, token } = useAuth();
  const [chat, setChat] = useState({});
  const [friends, setFriends] = useState([]);

  const fetchChat = useCallback(async () => {
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
  }, [chatId, token, user.id]);

  useEffect(() => {
    fetchChat();
  }, [fetchChat]);

  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    const message = e.target.message.value;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/messages/${chatId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            chatId: chatId,
            senderId: user.id,
            message: message,
          }),
        }
      );

      if (!res.ok) return console.error("Failed to send message");

      fetchChat();
      e.target.message.value = "";
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      <header className="flex p-4 gap-2 items-end border-b">
        <img
          src={
            chat.name !== "One on One Chat"
              ? devProfileIcon
              : friends?.profile || userProfileIcon
          }
          alt="profile"
          className="w-10 h-10 bg-gray-500 rounded-full object-cover"
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
      <div className="relative w-full h-full flex flex-col p-4">
        <div className="flex flex-col gap-4 w-full flex-1 overflow-y-auto">
          {chat.messages &&
            chat.messages.map((message) => (
              <Message
                key={message.id}
                userId={user.id}
                message={message}
                fetchChat={fetchChat}
              />
            ))}
        </div>
        <form
          onSubmit={handleSubmitMessage}
          className="flex self-end bottom-0 items-center w-full p-4 bg-gray-100 rounded-lg"
        >
          <input
            type="text"
            id="message"
            name="message"
            placeholder="Message"
            className="flex-1 border-none outline-none bg-transparent"
          />
          <button className="self-end">
            <img
              src={sendIcon}
              alt="Send"
              className="w-6 h-6 cursor-pointer hover:transform hover:scale-110"
            />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
