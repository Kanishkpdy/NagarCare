// notifications.js

document.addEventListener("DOMContentLoaded", () => {
  const notificationContainer = document.getElementById("notificationContainer");

  // Fetch and display notifications for the user
  const fetchNotifications = async () => {
    try {
      // Send a request to fetch notifications
      const response = await fetch("/api/notifications");
      if (!response.ok) throw new Error("Failed to fetch notifications");

      const notifications = await response.json();
      displayNotifications(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      notificationContainer.innerHTML = "<p>Error fetching notifications. Please try again later.</p>";
    }
  };

  // Display notifications in the notification container
  const displayNotifications = (notifications) => {
    notificationContainer.innerHTML = ""; // Clear previous notifications

    if (notifications.length === 0) {
      notificationContainer.innerHTML = "<p>No new notifications</p>";
      return;
    }

    // Loop through notifications and display each one
    notifications.forEach((notification) => {
      const notificationElement = document.createElement("div");
      notificationElement.classList.add("notification");

      notificationElement.innerHTML = `
        <p>${notification.message}</p>
        <span class="timestamp">${new Date(notification.timestamp).toLocaleString()}</span>
      `;

      notificationContainer.appendChild(notificationElement);
    });
  };

  // Poll for new notifications every 5 minutes
  setInterval(fetchNotifications, 300000); // 300000 ms = 5 minutes

  // Initial fetch of notifications when the page loads
  fetchNotifications();
});
