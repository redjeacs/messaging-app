import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import devProfile from "../assets/devprofiles.jpg";
import { Spinner } from "./ui/spinner";

function ChatList() {
  const { token } = useAuth();
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
            setChatList([
              { id: 1, users: [], messages: [] },
              { id: 2, users: [], messages: [] },
              { id: 3, users: [], messages: [] },
              { id: 4, users: [], messages: [] },
              { id: 5, users: [], messages: [] },
              { id: 6, users: [], messages: [] },
              { id: 7, users: [], messages: [] },
              { id: 8, users: [], messages: [] },
            ]);
            // setChatId(data[0].id);
            console.log("Fetched user chats:", data);
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
            console.log("Fetched chat messages:", data);
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

  const handleChatSelect = (chatId) => {
    setChatId(chatId);
  };

  return (
    <div className="flex w-full h-full gap-2">
      <>
        <div className="flex flex-col md:w-1/3 bg-white rounded-lg gap-2 p-4">
          <h1 className="text-2xl font-bold">Chats</h1>
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
                  >
                    <img
                      src={chat.users[0]?.profilePic || devProfile}
                      alt="profile"
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex flex-col">
                      <p className="font-bold">
                        {chat.users[0]?.name || "Name"}
                      </p>
                      <p className="text-xs">
                        {chat.messages[chat.messages.length - 1]?.text ||
                          "No messages yet"}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="p-2">No chats available</p>
            )}
          </div>
        </div>
        <div className=" md:w-2/3 bg-white rounded-lg p-4">test</div>
      </>
    </div>
  );
}

export default ChatList;
