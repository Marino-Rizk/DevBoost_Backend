const Meeting = require("../models/Meeting");
const { validationResult } = require("express-validator");

exports.createMeeting = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errorCode: "missing_fields",
            errorMessage: errors.array(),
        });
    }

    try {
        const { title, meeting_start, meeting_end, user_id, teacher_id } = req.body;

        if (!meeting_start || !meeting_end) {
            return res.status(400).json({ error: "Meeting start and end times are required" });
        }

        const meeting = await Meeting.create(title, meeting_start, meeting_end, user_id, teacher_id);
        res.status(201).json(meeting);

    } catch (error) {
        console.error("Error creating meeting:", error.message);
        res.status(500).json({
            message: "An error occurred while creating the meeting",
            error: error.message
        });
    }
};

exports.getMeetingsByUser = async (req, res) => {
    const { user_id } = req.params;

    try {
        const meetings = await Meeting.getMeetingsByUser(user_id);
        res.status(200).json(meetings);
    } catch (error) {
        console.error("Error fetching meetings:", error.message);
        res.status(500).json({
            message: "An error occurred while fetching meetings",
            error: error.message
        });
    }
};
