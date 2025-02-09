const { checkSchema } = require("express-validator");

const createUserValidationSchema = checkSchema({
  full_name: {
    in: ["body"],
    notEmpty: {
      errorMessage: "fullName is required",
    },
  },
  email: {
    in: ["body"],
    notEmpty: {
      errorMessage: "email is required",
    },
    isEmail: {
      errorMessage: "email must be a valid email address",
    },
  },
  password: {
    in: ["body"],
    notEmpty: {
      errorMessage: "password is required",
    },
    isLength: {
      options: { min: 8 },
      errorMessage: "password must be at least 8 characters long",
    },
    matches: {
      options: /^(?=.*[A-Z]).*$/, // Regex to ensure at least one uppercase letter
      errorMessage: "password must contain at least one uppercase letter",
    },
  },
  role_id: {
    in: ["body"],
    notEmpty: {
      errorMessage: "role is required",
    },
    isIn: {
      options: [[1, 2, 3]],
      errorMessage: "role must be either 1, 2, or 3",
    },
  },
});


const loginValidationSchema = checkSchema({
  email: {
    in: ["body"],
    notEmpty: {
      errorMessage: "email is required",
    },
    isEmail: {
      errorMessage: "email must be a valid email address",
    },
  },
  password: {
    in: ["body"],
    notEmpty: {
      errorMessage: "password is required",
    },
  },
});

// const updateProfileValidationSchema = checkSchema({
//   fullName: {
//     in: ["body"],
//     notEmpty: {
//       errorMessage: "fullName is required",
//     },
//   },
// });

const updatePasswordValidationSchema = checkSchema({
  password: {
    in: ["body"],
    notEmpty: {
      errorMessage: "password is required",
    },
    isLength: {
      options: { min: 8 },
      errorMessage: "password must be at least 8 characters long",
    },
    matches: {
      options: /^(?=.*[A-Z]).*$/, // Regex to ensure at least one uppercase letter
      errorMessage: "password must contain at least one uppercase letter",
    },
  },
});

////////////////////////////////

const createCourseValidationSchema = checkSchema({
  title: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Title is required",
    },
  },
  description: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Description is required",
    },
  },
  teacher_id: {
    in: ["body"],
    notEmpty: {
      errorMessage: "teacher_id is required",
    },
    isInt: {
      errorMessage: "teacher_id must be a number",
    },
  },
});

const addContentValidationSchema = checkSchema({
  title: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Title is required",
    },
  },
  description: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Description is required",
    },
  },
  course_id: {
    in: ["body"],
    notEmpty: {
      errorMessage: "teacher_id is required",
    },
    isInt: {
      errorMessage: "teacher_id must be a number",
    },
  },
});

const enrollmentValidationSchema = checkSchema({
  user_id: {
    in: ["body"],
    notEmpty: {
      errorMessage: "user_id is required",
    },
    isInt: {
      errorMessage: "user_id must be a number",
    },
  },
  course_id: {
    in: ["body"],
    notEmpty: {
      errorMessage: "course_id is required",
    },
    isInt: {
      errorMessage: "course_id must be a number",
    },
  },
});
////////////////////////////////////////
const searchTeacherValidationSchema = checkSchema({
  q: {
    in: ["params"],
    notEmpty: {
      errorMessage: "q is required",
    },
    isLength: {
      options: { min: 4 }, // Minimum length of 4 characters
      errorMessage: "q must be at least 4 characters long",
    },
  },
});


//////////////////////////////////////////////

const createNotificationValidationSchema = checkSchema({
  title: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Title is required",
    },
  },
  description: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Description is required",
    },
  },
});
const readNotificationValidationSchema = checkSchema({
  user_id: {
    in: ["body"],
    notEmpty: {
      errorMessage: "user_id is required",
    },
    isInt: {
      errorMessage: "user_id must be a number",
    },
  },
  notification_id: {
    in: ["body"],
    notEmpty: {
      errorMessage: "notification_id is required",
    },
    isInt: {
      errorMessage: "notification_id must be a number",
    },
  },
});

///////////////////////////////////////////////

const createMeetingValidationSchema = checkSchema({
  title: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Title is required",
    },
  },
  user_id: {
    in: ["body"],
    notEmpty: {
      errorMessage: "user_id is required",
    },
    isInt: {
      errorMessage: "user_id must be a number",
    },
  },
  teacher_id: {
    in: ["body"],
    notEmpty: {
      errorMessage: "teacher_id is required",
    },
    isInt: {
      errorMessage: "teacher_id must be a number",
    },
  },
});

module.exports = {

  searchTeacherValidationSchema,
  createUserValidationSchema,
  loginValidationSchema,
  updatePasswordValidationSchema,
  createCourseValidationSchema,
  addContentValidationSchema,
  enrollmentValidationSchema,
  createNotificationValidationSchema,
  readNotificationValidationSchema,
  createMeetingValidationSchema,
};
