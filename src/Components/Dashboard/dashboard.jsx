import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import axios from "axios";
import socket from "../../socket";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";
import ChatModal from "../ChatBot/chatbotmodal";
import { BsChatDots } from "react-icons/bs";

const Dashboard = () => {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const mounted = useRef(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState({}); // To track unread messages for each user
  console.log("unreadMessages", unreadMessages);

  const toggleChatModal = () => {
    setIsChatOpen((prevState) => !prevState);
  };
  const token = localStorage.getItem("authToken");

  const fetchNotifications = async (replaceMessages = false) => {
    if (isFetching) return;
    setIsFetching(true);

    try {
      const response = await axios.get(
        "http://localhost:3000/user/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const fetchedMessages = response.data.map((msg) => ({
        id: msg._id,
        text: msg.message,
        isRead: msg.isRead,
      }));

      setMessages(fetchedMessages);

      const unreadMessagesCount = fetchedMessages.filter(
        (msg) => !msg.isRead
      ).length;
      setUnreadCount(unreadMessagesCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsFetching(false);
    }
  };
  useEffect(() => {
    if (!mounted.current) {
      fetchNotifications(true);
      mounted.current = true;
    }
    socket.on("service", (message) => {
      const newMessage = { id: null, text: message, isRead: false };

      setMessages((prevMessages) => [newMessage, ...prevMessages]);

      setUnreadCount((prevCount) => prevCount + 1);
    });

    socket.on("private-message", (message) => {
      console.log("rivate-message", message);
      // Assuming 'message' includes senderId
      const { senderId } = message;
      setUnreadMessages((prevCounts) => ({
        ...prevCounts,
        [senderId]: (prevCounts[senderId] || 0) + 1, // Increment unread message count for the user
      }));
    });

    return () => {
      socket.off("service");
      socket.off("private-message");
    };
  }, []);

  const toggleModal = () => {
    setIsProfileModalOpen(false);
    setIsModalOpen((prevOpen) => !prevOpen);
  };

  const toggleProfileModal = () => {
    setIsModalOpen(false);
    setIsProfileModalOpen((prevOpen) => !prevOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    navigate("/");
  };

  const markMessageAsRead = (index, id) => {
    const updatedMessages = messages.map((msg, i) =>
      i === index ? { ...msg, isRead: true } : msg
    );
    setMessages(updatedMessages);

    const updatedUnreadCount = updatedMessages.filter(
      (msg) => !msg.isRead
    ).length;
    setUnreadCount(updatedUnreadCount);

    if (id) {
      socket.emit("readnotification", { notificationId: id });
    }
  };

  const toggleExpandCard = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  const handleUserClick = (userId) => {
    // Reset unread count when user clicks on chat
    setUnreadMessages((prevCounts) => ({
      ...prevCounts,
      [userId]: 0,
    }));
  };

  let userDetails = localStorage.getItem("user");
  let { userName, email } = JSON.parse(userDetails);

  return (
    <div className="dashboard-home">
      <nav className="navbar">
        <h1 className="navbar-logo">Notification Service</h1>
        <div className="navbar-icons">
          <div className="notification-wrapper" onClick={toggleModal}>
            <IoMdNotificationsOutline className="notification-icon" />
            {unreadCount > 0 && (
              <span className="notification-count">{unreadCount}</span>
            )}
          </div>
          <FaUserCircle className="profile-icon" onClick={toggleProfileModal} />
        </div>
      </nav>

      <div className="dashboard-content">
        <h1 className="dashboard-heading">
          Hey {userName}, Welcome to the Notification Service App
        </h1>
      </div>
      <div className="chat-icon" onClick={toggleChatModal}>
        <BsChatDots className="chat-icon-image" />
        {Object.keys(unreadMessages).length > 0 &&
          Object.values(unreadMessages).reduce((a, b) => a + b, 0) >= 1 && (
            <span className="notification-count">
              {Object.values(unreadMessages).reduce((a, b) => a + b, 0)}
            </span>
          )}
        <p className="chat-icon-text">Chat Bot</p>
      </div>

      {/* Modal for Notifications */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Notifications</h2>
              <button className="modal-close" onClick={toggleModal}>
                &times;
              </button>
            </div>

            <div className="message-cards">
              {messages.length > 0 ? (
                messages
                  .sort((a, b) => a.isRead - b.isRead)
                  .map((msg, index) => (
                    <div
                      className={`message-card ${
                        expandedCard === index ? "expanded" : ""
                      }`}
                      key={index}
                      onClick={() => {
                        markMessageAsRead(index, msg.id);
                        toggleExpandCard(index);
                      }}
                    >
                      {!msg.isRead && <span className="red-dot" />}
                      <p>{msg.text}</p>
                    </div>
                  ))
              ) : (
                <p>No new notifications.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {isProfileModalOpen && (
        <div className="profileModal">
          <div className="modal-content">
            <div className="profile-modal-header">
              <h2>{userName}</h2>
              <h6>{email}</h6>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      )}
      {/* Modal for Chat Users */}
      {isChatOpen && (
        <ChatModal
          toggleChatModal={toggleChatModal} // Pass connected users to the chat modal
          onUserClick={handleUserClick} // Handle user click
          unreadMessageCounts={unreadMessages} // Pass unread message counts
        />
      )}
    </div>
  );
};

export default Dashboard;
