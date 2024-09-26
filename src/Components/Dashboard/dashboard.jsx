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
  const [isFetching, setIsFetching] = useState(false); // Prevent duplicate API calls
  const mounted = useRef(false); // To ensure the API call happens only once on mount

  // Function to fetch notifications from the API
  const fetchNotifications = async (replaceMessages = false) => {
    const token = localStorage.getItem("authToken"); // Retrieve the token from local storage

    if (isFetching) return; // Prevent duplicate calls
    setIsFetching(true);

    try {
      const response = await axios.get(
        "http://localhost:3000/user/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use the token in the Authorization header
          },
        }
      );

      const fetchedMessages = response.data.map((msg) => ({
        id: msg._id,
        text: msg.message,
        isRead: msg.isRead,
      }));

      setMessages((prevMessages) => {
        // Remove duplicates by id
        const existingIds = prevMessages.map((msg) => msg.id);
        const newMessages = fetchedMessages.filter(
          (msg) => !existingIds.includes(msg.id)
        );

        // Sort: unread messages at the top, read messages at the bottom
        const allMessages = replaceMessages
          ? [...newMessages, ...prevMessages] // Replace messages initially
          : [...newMessages, ...prevMessages]; // Append new messages on "View All"

        const sortedMessages = allMessages
          .filter((msg) => !msg.isRead) // Unread messages first
          .concat(allMessages.filter((msg) => msg.isRead)); // Read messages at the bottom

        return sortedMessages;
      });

      // Update unread count based on new unread messages
      const unreadFromAPI = fetchedMessages.filter((msg) => !msg.isRead).length;
      setUnreadCount((prevUnreadCount) =>
        replaceMessages ? unreadFromAPI : prevUnreadCount + unreadFromAPI
      );
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    // Ensure the API is called only once on component mount
    if (!mounted.current) {
      fetchNotifications(true); // Fetch and replace messages initially
      mounted.current = true;
    }

    // Listen for 'service' events continuously
    socket.on("service", (message) => {
      console.log("Service message received:", message);
      setMessages((prevMessages) => [
        { text: message, isRead: false }, // Add the service message at the top
        ...prevMessages,
      ]);

      // Only increment unread count if the modal is not open
      if (!isModalOpen) {
        setUnreadCount((prevCount) => prevCount + 1);
      }
    });

    // Cleanup on unmount
    return () => {
      socket.off("service"); // Cleanup the 'service' event listener
    };
  }, [isModalOpen]);

  // Toggle modal visibility
  const toggleModal = () => {
    setIsModalOpen((prevOpen) => {
      if (!prevOpen) {
        // Reset unread count only when opening the modal
        setUnreadCount(0);
      }
      return !prevOpen;
    });
  };

  // Mark individual message as read when clicked
  const markMessageAsRead = (index, id) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg, i) =>
        i === index ? { ...msg, isRead: true } : msg
      )
    );

    // Emit the message ID to the backend only if the message has an ID
    if (id) {
      console.log("iddd....", id);
      socket.emit("readnotification", { notificationId: id });
    }
  };

  // Expand or collapse the card
  const toggleExpandCard = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  // Handle "View All" button click
  const handleViewAll = () => {
    fetchNotifications(); // Fetch the messages from the server again, do not replace existing ones
  };

  return (
    <div className="dashboard-home">
      {/* NavBar Section */}
      <nav className="navbar">
        <h1 className="navbar-logo">Microservices App</h1>
        <div className="navbar-icons">
          <div className="notification-wrapper" onClick={toggleModal}>
            <IoMdNotificationsOutline className="notification-icon" />
            {/* Only show the notification count if the modal is closed */}
            {!isModalOpen && unreadCount > 0 && (
              <span className="notification-count">{unreadCount}</span>
            )}
          </div>
          <FaUserCircle className="profile-icon" />
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        <h1 className="dashboard-heading">Welcome to the Dashboard</h1>
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

            <button className="see-all-btn" onClick={handleViewAll}>
              View All
            </button>

            {/* Scrollable list of messages */}
            <div className="message-cards">
              {messages.length > 0 ? (
                messages
                  .sort((a, b) => a.isRead - b.isRead) // Sort unread messages at the top
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
    </div>
  );
};

export default Dashboard;
