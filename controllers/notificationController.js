const Notification = require("../models/Notification");
const { validationResult, Result } = require("express-validator");
const helper = require("../utils/helper");

exports.createNotification = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errorCode: "missing_fields",
            errorMessage: errors.array(),
        });
    }

    try {
        const { title, description } = req.body;
        const notification = await Notification.create(title, description);
        res.status(201).json(notification);
    } catch (error) {
        console.error("Error creating notification:", error.message);
        res.status(500).json({
            message: "An error occurred while creating the notification",
            error: error.message
        });
    }
};

  exports.getUnreadNotifications = async (req, res) => {
    const {user_id} = req.params;

    try {
      const notifications = await Notification.getUnreadNotifications(user_id);
      res.status(200).json(notifications);
    } catch (error) {
      console.error("Error fetching unread notifications:", error.message);
      res.status(500).json({
        message: "An error occurred while fetching unread notifications",
        error: error.message
      });
    }
  };
  
  exports.markNotificationAsRead = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errorCode: "missing_fields",
            errorMessage: errors.array(),
        });
    }
    try {
        const { user_id, notification_id } = req.body; 

        const result = await Notification.markAsRead(user_id, notification_id);

        res.status(200).json(result);
    } catch (error) {
        console.error("Error marking notification as read:", error.message);
        res.status(500).json({
            message: "An error occurred while updating the notification status",
            error: error.message
        });
    }
};

