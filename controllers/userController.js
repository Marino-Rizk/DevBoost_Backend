const User = require("../models/User");
const { validationResult } = require("express-validator");
const helper = require("../utils/helper"); // Ensure helper functions are properly defined
const Teacher = require("../models/teacher");

exports.createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errorCode: "missing_fields",
      errorMessage: errors.array(),
    });
  }

  try {
    const { full_name, email, password, role_id, description, domain_id, meeting_link } = req.body;
    let uploadedFileUrl = null;

    
    if (req.files?.image_url) { 
      const uploadedFile = await helper.uploadAndRenameFile(req.files.image_url);
      uploadedFileUrl = uploadedFile.fileUrl;
    }
    

    const newUser = { full_name, email, password, role_id };
    const user = await User.create(newUser);

    const { id, full_name: createdFullName, email: createdEmail, role_id: createdRoleId } = user;

    if (createdRoleId === 2) {
      const teacher_id = user.user_id;
      const newTeacher = { teacher_id, image_url: uploadedFileUrl, description, domain_id, meeting_link };
      const teacher = await Teacher.create(newTeacher);
      const { image_url: createdImage_url, description: createdDescription, domain_id: createdDomain_id,meeting_link:createdMeetingLink } = teacher;

      return res.status(201).json({
        message: 'User created successfully',
        data: {
          id,
          full_name: createdFullName,
          email: createdEmail,
          role_id: createdRoleId,
          image_url: createdImage_url,
          description: createdDescription,
          domain_id: createdDomain_id,
          meeting_link:createdMeetingLink
        },
      });
    }

    return res.status(201).json({
      message: 'User created successfully',
      data: {
        id,
        full_name: createdFullName,
        email: createdEmail,
        role_id: createdRoleId,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while creating the user', error });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errorCode: "missing_fields",
      errorMessage: errors.array(),
    });
  }

  try {
    const { email, password } = req.body;

    const results = await User.findByEmail(email);
    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = results[0];

    // Check if password is correct
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Successful login
    res.status(200).json( user );

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred during the login process', error });
  }
};

exports.getUserData = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.error("Error Finding User:", err);
    return res.status(500).json({
      errorCode: "internal_server_error",
      errorMessage: err.message || "An unexpected error occurred",
    });
  }
};


exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    await User.delete(userId);
    return res.status(200).json({
      status: "success",
      message: `User with ID ${userId} has been deleted`,
    });
  } catch (err) {
    console.error("Error deleting user:", err);
    return res.status(500).json({
      errorCode: "internal_server_error",
      errorMessage: err.message || "An unexpected error occurred",
    });
  }
};

exports.updateAdminPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errorCode: "missing_fields",
        errorMessage: errors.array(),
      });
    }
  
    const { password } = req.body;
  
    try {
      await User.updatePassword(password);
      return res.status(200).json({
        message: "Password updated successfully",
      });
    } catch (err) {
      console.error("Error updating password:", err);
      return res.status(500).json({
        errorCode: "internal_server_error",
        errorMessage: err.message || "An unexpected error occurred",
      });
    }
  };