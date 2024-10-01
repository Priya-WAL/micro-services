import React, { useEffect, useState } from "react";
import "./chatbotmodal.css";
import socket from "../../socket";
import PrivateChatModal from "../privateChatModal/privatechatmodal";

const ChatModal = ({ toggleChatModal }) => {
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [currentChatUser, setCurrentChatUser] = useState(null); // State to manage the current chat user

  // Fetch authorization token from local storage
  const token = localStorage.getItem("authToken");

  // Simplified function to get only the first letter of the first word
  const getUserInitials = (name) => {
    if (!name) return "";

    const nameParts = name.trim().split(" ").filter(Boolean);

    return nameParts.length > 0 ? nameParts[0][0].toUpperCase() : "";
  };

  useEffect(() => {
    socket.emit("Previous-History", { token });
    socket.on("connected-users", (users) => {
      setConnectedUsers(users);
    });

    return () => {
      socket.off("connected-users");
    };
  }, []);

  const handleUserClick = (user) => {
    setCurrentChatUser(user); // Set the clicked user as the current chat user
  };

  return (
    <div className="chat-container">
      {currentChatUser && (
        <PrivateChatModal
          togglePrivateChat={() => setCurrentChatUser(null)}
          recipient={currentChatUser}
        />
      )}
      <div className="chat-modal">
        <div className="chat-modal-content">
          {/* Modal Header */}
          <div className="chat-modal-header">
            <h2>Users</h2>
            <button className="chat-modal-close" onClick={toggleChatModal}>
              &times;
            </button>
          </div>

          {/* List of Connected Users */}
          <div className="connected-users-list">
            {connectedUsers.length > 0 ? (
              connectedUsers.map((user, index) => (
                <div
                  className="user-card"
                  key={index}
                  onClick={() => handleUserClick(user)}
                >
                  {/* Display Initials */}
                  <div className="initials-avatar">
                    {getUserInitials(user.username)}
                  </div>
                  <span className="user-name">{user.username}</span>
                </div>
              ))
            ) : (
              <p>No users connected.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
