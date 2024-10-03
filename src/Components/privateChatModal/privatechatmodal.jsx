import React, { useEffect, useState } from "react";
import "./privatechatmodal.css";
import socket from "../../socket"; // Reuse the global socket instance

const PrivateChatModal = ({ togglePrivateChat, recipient, onUserClick }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  console.log("recipientId", recipient);

  // Get the current user details from localStorage
  const userDetails = localStorage.getItem("user");
  const { userId } = JSON.parse(userDetails);

  useEffect(() => {
    // Emit the event to request private chat history with the selected user
    if (recipient?.userId) {
      socket.emit("user-id-for-private-chat", {
        recipientId: recipient.userId,
      });

      // Listen to the event for receiving private chat history
      socket.on("user-to-user-private-chat-history", (history) => {
        console.log("history", history);
        setChatHistory(history); // Update chat history for the current recipient
      });

      // Clean up event listeners when the component unmounts or recipient changes
      return () => {
        socket.off("user-to-user-private-chat-history");
      };
    }
  }, [recipient.userId]); // Add recipient.userId as a dependency
  console.log("use", recipient.userId);
  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      console.log("before ");
      console.log(newMessage.senderId, recipient.userId);
      if (newMessage.senderId === recipient.userId) {
        onUserClick(newMessage.senderId);
        console.log("after ");
        setChatHistory((prevHistory) => [...prevHistory, newMessage]);
      }
    };
    socket.on("private-message", handleNewMessage);

    return () => {
      socket.off("private-message", handleNewMessage);
    };
  }, [recipient.userId]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setMessage(inputValue);
    setIsButtonDisabled(inputValue.trim().length === 0);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      socket.emit("PrivateMessage", {
        recipientId: recipient.userId,
        socketId: recipient.socketId,
        message: message.trim(),
      });
      console.log("emii");
      setMessage("");
      setIsButtonDisabled(true);
    }
  };

  return (
    <div className="private-chat-modal">
      <div className="private-chat-header">
        <h2>{recipient.username}</h2>
        <button className="close-btn" onClick={togglePrivateChat}>
          &times;
        </button>
      </div>

      {/* Chat history display with a scrollable area */}
      <div className="chat-history">
        {chatHistory.length > 0 ? (
          chatHistory.map((message) => (
            <div
              key={message._id}
              className={`chat-message ${
                message.senderId === userId ? "sent" : "received"
              }`}
            >
              <p>{message.message}</p>
            </div>
          ))
        ) : (
          <div className="no-messages">
            <p>No messages yet. Start a conversation!</p>
          </div>
        )}
      </div>

      {/* Input field to send a new message */}
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={handleInputChange}
        />
        <button onClick={handleSendMessage} disabled={isButtonDisabled}>
          Send
        </button>
      </div>
    </div>
  );
};

export default PrivateChatModal;
