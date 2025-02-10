const express = require("express");
const router = express.Router();
const validator = require("../../validators/validator");
const meetingController = require("../../controllers/meetingController");

router.post(
    "/create",
    validator.createMeetingValidationSchema,
    meetingController.createMeeting
);

router.get(
    "/getMeetings/:user_id",
    meetingController.getMeetingsByUser
);

router.post(
    "/deleteMeeting",
    meetingController.deleteMeeting
)
module.exports = router;
