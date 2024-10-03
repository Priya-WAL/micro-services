import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import "./privatechatmodal.css";
import socket from "../../socket";
import EmojiPicker, { Categories } from "emoji-picker-react";

const PrivateChatModal = ({ togglePrivateChat, recipient, onUserClick }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const chatHistoryRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const userDetails = localStorage.getItem("user");
  const { userId } = JSON.parse(userDetails);

  useEffect(() => {
    if (recipient?.userId) {
      socket.emit("user-id-for-private-chat", {
        recipientId: recipient.userId,
      });

      socket.on("user-to-user-private-chat-history", (history) => {
        setChatHistory(history);
      });

      return () => {
        socket.off("user-to-user-private-chat-history");
      };
    }
  }, [recipient.userId]);

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      if (newMessage.senderId === recipient.userId) {
        onUserClick(newMessage.senderId);
        setChatHistory((prevHistory) => [...prevHistory, newMessage]);
      }
    };
    socket.on("private-message", handleNewMessage);

    return () => {
      socket.off("private-message", handleNewMessage);
    };
  }, [recipient.userId]);

  useLayoutEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setMessage(inputValue);
    setIsButtonDisabled(inputValue.trim().length === 0);
  };

  const handleEmojiPickerToggle = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setIsButtonDisabled(false);
    setShowEmojiPicker(false);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      socket.emit("PrivateMessage", {
        recipientId: recipient.userId,
        socketId: recipient.socketId,
        message: message.trim(),
      });
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

      <div className="chat-history" ref={chatHistoryRef}>
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

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={handleInputChange}
        />

        <button onClick={handleEmojiPickerToggle} className="emoji-btn">
          😀
        </button>

        {showEmojiPicker && (
          <div className="emoji-picker-container">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              disableSearchBar={true}
              groupVisibility={{
                flags: false,
                recently_used: false,
                animals_nature: false,
                food_drink: false,
                travel_places: false,
                objects: false,
                symbols: false,
                activities: false,
              }}
              groupNames={{
                smileys_people: "Smileys & People",
              }}
            />
          </div>
        )}

        <button
          className="send_button"
          onClick={handleSendMessage}
          disabled={isButtonDisabled}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default PrivateChatModal;
