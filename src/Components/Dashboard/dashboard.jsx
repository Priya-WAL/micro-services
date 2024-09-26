import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import axios from "axios";
import socket from "../../socket";
import "./dashboard.css";

const Dashboard = () => {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const mounted = useRef(false);

  const fetchNotifications = async (replaceMessages = false) => {
    const token = localStorage.getItem("authToken");

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
      console.log("Service message received:", message);
      const newMessage = { id: null, text: message, isRead: false };

      setMessages((prevMessages) => [newMessage, ...prevMessages]);

      setUnreadCount((prevCount) => prevCount + 1);
    });

    return () => {
      socket.off("service");
    };
  }, []);

  const toggleModal = () => {
    setIsModalOpen((prevOpen) => !prevOpen);
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
      console.log("Marking as read:", id);
      socket.emit("readnotification", { notificationId: id });
    }
  };

  const toggleExpandCard = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  const handleViewAll = () => {
    fetchNotifications();
  };

  let userDetails = localStorage.getItem('user')
  let { userName, email } = JSON.parse(userDetails)

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
          <FaUserCircle className="profile-icon" />
        </div>
      </nav>

      <div className="dashboard-content">
        <h1 className="dashboard-heading">Hey {userName}, Welcome to the Notification Service App</h1>
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

            {/* Scrollable list of messages */}
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
            <button className="see-all-btn" onClick={handleViewAll}>
              View All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
