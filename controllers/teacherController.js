const { validationResult } = require("express-validator");
const helper = require("../utils/helper");
const Teacher = require("../models/teacher");
const User = require("../models/User");


exports.searchTeacher = async (req, res) => {

    const { q } = req.params;

    try {
        const teacher = await Teacher.searchTeacher(q);
        return res.status(200).json(teacher);
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

    const { userId } = req.params;
    const { full_name, description, meeting_link } = req.body;
    
    let uploadedFileUrl = null;

    if (req.files?.image) {
        const uploadedFile = await helper.uploadAndRenameFile(req.files.image);
        uploadedFileUrl = uploadedFile.fileUrl;
    }

    try {
        // Fetch existing user
        const oldProfile = await User.findById(userId);
        if (!oldProfile) {
            return res.status(404).json({ errorCode: "not_found", errorMessage: "User not found" });
        }

        if (oldProfile.role_id !== 2) {
            return res.status(403).json({
                errorCode: "forbidden",
                errorMessage: "Only teachers are allowed to update their profile",
            });
        }

        // Update profile in both users & teacher tables
        await User.updateTeacherProfile(userId, {
            full_name: full_name || oldProfile.full_name,
            image_url: uploadedFileUrl || oldProfile.image_url,
            description: description || oldProfile.description,
            meeting_link: meeting_link || oldProfile.meeting_link,
        });

        // Fetch updated profile
        const updatedProfile = await User.findById(userId);

        return res.status(200).json({
            message: "Teacher profile updated successfully",
            user: updatedProfile,
        });
    } catch (err) {
        console.error("Error updating teacher profile:", err);
        return res.status(500).json({
            errorCode: "internal_server_error",
            errorMessage: err.message || "An unexpected error occurred",
        });
    }
};


