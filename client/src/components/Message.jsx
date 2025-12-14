import { useAuth } from "@/contexts/AuthContext";

function Message({ userId, message }) {
  const { user } = useAuth();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`flex w-full ${
        message.senderId === userId ? "justify-end" : "justify-start"
      }`}
    >
      <div className="flex flex-col">
        <div className="flex gap-2 items-center justify-between px-1">
          <span className="text-sm">
            {message.sender.id === user.id ? "You" : message.sender.name}
          </span>
          <span className="text-xs text-gray-400">
            {formatDate(message.updatedAt)}
          </span>
        </div>
        <div className="flex justify-between gap-2 bg-blue-500 p-3 min-w-[100px] text-white text-md rounded-lg">
          <p>{message.message}</p>
          <button>X</button>
        </div>
      </div>
    </div>
  );
}

export default Message;
