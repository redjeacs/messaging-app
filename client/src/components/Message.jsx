import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

function Message({ userId, message, fetchChat }) {
  const { user, token } = useAuth();
  const [alert, setAlert] = useState({});

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert({}), 1000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/messages/${message.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      if (!res.ok)
        setAlert({
          title: "Error",
          message: data.error || data.message || "Delete failed",
        });

      fetchChat();
    } catch (error) {
      setAlert({ title: "Error", message: error.message });
      console.error(error);
    }
  };

  return (
    <>
      {alert.message && (
        <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] transform z-50 w-full max-w-md">
          <Alert variant="destructive" className="mb-2">
            <AlertTitle>{alert.title}</AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        </div>
      )}
      <div
        className={`flex w-full ${
          message.senderId === userId ? "justify-end" : "justify-start"
        }`}
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-2 justify-between px-1">
            <span className="text-sm">
              {message.sender.id === user.id ? "You" : message.sender.name}
            </span>
            <span className="text-xs text-gray-400">
              {formatDate(message.updatedAt)}
            </span>
          </div>
          <div
            className={`flex justify-between gap-4 p-3 text-white text-md rounded-lg ${
              message.senderId === userId ? "bg-blue-500" : "bg-gray-400"
            }`}
          >
            <p>{message.message}</p>
            {message.senderId === userId && (
              <button
                onClick={handleDelete}
                className="cursor-pointer text-sm hover:transform hover:scale-110"
              >
                X
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Message;
