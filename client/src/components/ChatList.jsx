import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import addUserIcon from "../assets/add-user.webp";
import devProfileIcon from "../assets/devprofiles.jpg";
import userProfileIcon from "../assets/user.svg";
import { Spinner } from "./ui/spinner";
import { Link } from "react-router-dom";
import Chat from "./Chat";

function ChatList() {
  const { user, token } = useAuth();
  const [ChatList, setChatList] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [isChatListLoading, setIsChatListLoading] = useState(false);

  useEffect(() => {
    const fetchUserChats = async () => {
      if (token) {
        setIsChatListLoading(true);
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/user/chats`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setIsChatListLoading(false);
            setChatList(data);
            setChatId(data[0]?.id || null);
          } else {
            setIsChatListLoading(false);
            console.error("Failed to fetch user chats");
          }
        } catch (error) {
          setIsChatListLoading(false);
          console.error("Error fetching user chats:", error);
        }
      }
    };

    fetchUserChats();
  }, [token]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  const addFriend = async (friendName) => {
    if (token) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/user/friends/${friendName}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ friendName }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Friend added successfully:", data);
        } else {
          console.error("Failed to add friend");
        }
      } catch (error) {
        console.error("Error adding friend:", error);
      }
    }
  };

  const handleChatSelect = (chatId) => {
    setChatId(chatId);
  };

  return (
    <div className="flex w-full h-full gap-2">
      <>
        <div className="flex flex-col md:w-1/3 bg-white rounded-lg gap-2 p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Chats</h1>
            <Link onClick={() => addFriend("user2@gmail.com")}>
              <img
                src={addUserIcon}
                alt="Add User"
                className="w-8 h-8 cursor-pointer hover:transform hover:scale-110 hover:bg-gray-200 rounded-lg p-1"
              />
            </Link>
          </div>
          <div className="w-full bg-gray-200 p-2 rounded-full text-md">
            search
          </div>
          <div className="grid grid-cols-auto gap-2 overflow-y-auto">
            {isChatListLoading ? (
              <div className="flex justify-center items-center h-24">
                <Spinner />
              </div>
            ) : ChatList && ChatList.length !== 0 ? (
              ChatList.map((chat) => {
                return (
                  <div
                    key={chat.id}
                    className="flex gap-2 p-2 items-center hover:bg-gray-100 rounded-lg cursor-pointer"
                    onClick={() => handleChatSelect(chat.id)}
                  >
                    <img
                      src={
                        chat.name !== "One on One Chat"
                          ? devProfileIcon
                          : chat.users.find(
                              (chatUser) => chatUser.id !== user.id
                            )?.profile || userProfileIcon
                      }
                      alt="profile"
                      className="w-12 h-12 rounded-full bg-black object-cover"
                    />
                    <div className="flex flex-col w-1/2">
                      <p className="font-bold">
                        {chat.name !== "One on One Chat"
                          ? chat.name
                          : chat.users.find(
                              (chatUser) => chatUser.id !== user.id
                            )?.name || "Name"}
                      </p>
                      <div className="flex w-full items-center">
                        <p className="text-xs">
                          {chat.messages[chat.messages.length - 1]?.text ||
                            "No messages yet"}
                        </p>
                        <span className="mx-1">·</span>
                        <p className="text-xs">{formatDate(chat.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="p-2">No chats available</p>
            )}
          </div>
        </div>
        <div className=" md:w-2/3 bg-white rounded-lg">
          {chatId && <Chat key={chatId} chatId={chatId} />}
        </div>
      </>
    </div>
  );
}

export default ChatList;
