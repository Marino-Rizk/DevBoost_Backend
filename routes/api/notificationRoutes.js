const express = require("express");
const router = express.Router();
const validator = require("../../validators/validator");
const notificationController = require("../../controllers/notificationController");

router.post(
    "/create",
    validator.createNotificationValidationSchema,
    notificationController.createNotification
);

router.get(
    "/getNotifications/:user_id",
    notificationController.getUnreadNotifications
);

router.put(
    "/read",
    validator.readNotificationValidationSchema,
    notificationController.markNotificationAsRead
);

module.exports = router;
