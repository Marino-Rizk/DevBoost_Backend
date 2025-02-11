const Course = require("../models/Course");
const { validationResult, Result } = require("express-validator");
const helper = require("../utils/helper");
const { response } = require("express");

exports.createCourse = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errorCode: "missing_fields",
            errorMessage: errors.array(),
        });
    }

    try {
        const { title, description, teacher_id } = req.body;
        const image = req.files?.cover_url;  // Access cover_url instead of image
        let imageUrl = null;

        if (image) {
            const uploadedFilePath = await helper.uploadAndRenameFile(image);
            if (!uploadedFilePath.filePath || !uploadedFilePath.fileUrl) {
                return res.status(500).json({
                    errorCode: "upload_failed",
                    errorMessage: "Failed to upload image",
                });
            }
            imageUrl = uploadedFilePath.fileUrl;
        } else {
            return res.status(400).json({ error: "Cover image is required" });
        }

        const newCourse = { title, description, cover_url: imageUrl, teacher_id };

        const course = await Course.create(newCourse);


        res.status(201).json(course);
    } catch (error) {
        console.error("Error creating course:", error.message);
        res.status(500).json({
            message: "An error occurred while creating the course",
            error: error.message
        });
    }
};


exports.deleteCourse = async (req, res) => {
    const { courseId } = req.body;

    if (!courseId) {
        return res.status(400).json({ error: "course ID is required" });
    }
    try {
        await Course.delete(courseId);
        return res.status(200).json({
            status: "success",
            message: `course with ID ${courseId} has been deleted`,
        });
    } catch (err) {
        console.error("Error deleting course:", err);
        return res.status(500).json({
            errorCode: "internal_server_error",
            errorMessage: err.message || "An unexpected error occurred",
        });
    }
};

exports.searchCourse = async (req, res) => {
    const { title } = req.query; // Use query params

    if (!title) {
        return res.status(400).json({
            errorCode: "missing_parameter",
            errorMessage: "Title query parameter is required",
        });
    }

    try {
        const courses = await Course.searchCourse(title);
        return res.status(200).json(courses);
    } catch (err) {
        console.error("Error searching course:", err);
        return res.status(500).json({
            errorCode: "internal_server_error",
            errorMessage: err.message || "An unexpected error occurred",
        });
    }
};


exports.getRandomCourses = async (req, res) => {
    
    try {
        const courses = await Course.getRandom();

        res.status(200).json(courses)
    } catch (error) {
        console.error("Error getting courses:", error.message);
        res.status(500).json({
            message: "An error occurred while getting courses",
            error: error.message
        });
    }
};

exports.getCourses = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errorCode: "missing_fields",
            errorMessage: errors.array(),
        });
    }
    try {
        const courses = await Course.getCourses();

        res.status(200).json(courses);
    } catch (error) {
        console.error("Error getting courses:", error.message);
        res.status(500).json({
            message: "An error occurred while getting the courses",
            error: error.message
        });
    }
};

exports.addContent = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errorCode: "missing_fields",
            errorMessage: errors.array(),
        });
    }

    try {
        const { title, description, course_id } = req.body;
        const video = req.files?.url;
        let videoUrl = null;

        if (video) {
            const uploadedFilePath = await helper.uploadAndRenameFile(video);
            if (!uploadedFilePath.filePath || !uploadedFilePath.fileUrl) {
                return res.status(500).json({
                    errorCode: "upload_failed",
                    errorMessage: "Failed to upload video",
                });
            }
            videoUrl = uploadedFilePath.fileUrl;
        } else {
            return res.status(400).json({ error: "video URL is required" });
        }

        const newContent = { title, description, url: videoUrl, course_id };

        const content = await Course.addContent(newContent);


        res.status(201).json(content);
    } catch (error) {
        console.error("Error adding content:", error.message);
        res.status(500).json({
            message: "An error occurred",
            error: error.message
        });
    }

};

exports.getCoursesByTeacherId = async (req, res) => {
    const { teacher_id } = req.params;  // Get teacher_id from the request parameters

    try {
        // Fetch courses by teacher_id
        const courses = await Course.getCoursesByTeacherId(teacher_id);

        if (!courses.length) {
            return res.status(404).json({
                errorCode: "no_courses_found",
                errorMessage: `No courses found for teacher with ID ${teacher_id}`,
            });
        }

        res.status(200).json(courses);
    } catch (error) {
        console.error("Error fetching courses by teacher:", error.message);
        res.status(500).json({
            message: "An error occurred while fetching courses by teacher",
            error: error.message
        });
    }
};


exports.getCourseContent = async (req, res) => {
    const { course_id } = req.params;

    try {
        const content = await Course.getContent(course_id)
        res.status(201).json(content);
    } catch (error) {
        console.error("Error finding content:", error.message);
        res.status(500).json({
            message: "An error occurred",
            error: error.message
        });
    }
};

exports.enroll = async (req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errorCode: "missing_fields",
            errorMessage: errors.array(),
        });
    }

    const {user_id, course_id} = req.body; 
    try{
        const enrollment = await Course.enroll(user_id, course_id);

        res.status(200).json(enrollment);
    }catch (error){
        console.error("Error enrolling:", error.message);
        res.status(500).json({
            message: "An error occurred",
            error: error.message
        });
    }
}
