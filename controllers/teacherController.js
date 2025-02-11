const { validationResult } = require("express-validator");
const helper = require("../utils/helper");
const Teacher = require("../models/teacher");
const User = require("../models/User");

exports.searchTeacher = async (req, res) => {
    const { full_name } = req.query; // Use query params

    if (!full_name) {
        return res.status(400).json({
            errorCode: "missing_parameter",
            errorMessage: "Full name query parameter is required",
        });
    }

    try {
        const teachers = await Teacher.searchTeacher(full_name);
        return res.status(200).json(teachers);
    } catch (err) {
        console.error("Error searching teacher:", err);
        return res.status(500).json({
            errorCode: "internal_server_error",
            errorMessage: err.message || "An unexpected error occurred",
        });
    }
};

exports.getRandomTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.getRandom();

        res.status(200).json(teachers)
    } catch (error) {
        console.error("Error getting teachers:", error.message);
        res.status(500).json({
            message: "An error occurred while getting the teachers",
            error: error.message
        });
    }
};

exports.getTeachersByDomain = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errorCode: "missing_fields",
            errorMessage: errors.array(),
        });
    }
    try {

        const teachers = await Teacher.getTeachers();

        res.status(200).json(teachers);
    } catch (error) {
        console.error("Error getting teachers:", error.message);
        res.status(500).json({
            message: "An error occurred while getting the teachers",
            error: error.message
        });
    }
};

exports.updateProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errorCode: "missing_fields",
            errorMessage: errors.array(),
        });
    }

    const { user_id } = req.params;
    const { full_name, description, meeting_link } = req.body;

    let imageUrl = null;
    const image = req.files?.cover_url;

    if (image) {
        try {
            const uploadedFilePath = await helper.uploadAndRenameFile(image);
            if (!uploadedFilePath.filePath || !uploadedFilePath.fileUrl) {
                return res.status(500).json({
                    errorCode: "upload_failed",
                    errorMessage: "Failed to upload image",
                });
            }

            imageUrl = uploadedFilePath.fileUrl;

            
        } catch (err) {
            return res.status(500).json({
                errorCode: "upload_failed",
                errorMessage: "Error processing uploaded file",
            });
        }
    }

    try {
        // Fetch existing user
        const oldProfile = await User.findById(user_id);
        if (!oldProfile) {
            return res.status(404).json({ errorCode: "not_found", errorMessage: "User not found" });
        }

        if (oldProfile.role_id !== 2) {
            return res.status(403).json({
                errorCode: "forbidden",
                errorMessage: "Only teachers are allowed to update their profile",
            });
        }

        // Update profile
        await User.updateTeacherProfile(user_id, {
            full_name: full_name || oldProfile.full_name,
            image_url: imageUrl || oldProfile.image_url, // Use uploaded image if provided
            description: description || oldProfile.description,
            meeting_link: meeting_link || oldProfile.meeting_link,
        });

        // Fetch updated profile
        const updatedProfile = await User.findById(user_id);

        return res.status(200).json(updatedProfile);
    } catch (err) {
        console.error("Error updating teacher profile:", err);
        return res.status(500).json({
            errorCode: "internal_server_error",
            errorMessage: err.message || "An unexpected error occurred",
        });
    }
};
