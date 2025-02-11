const express = require("express");
const courseController = require("../../controllers/courseController");
const router = express.Router();
const validator = require("../../validators/validator");

router.post(
    "/create",
    validator.createCourseValidationSchema,
    courseController.createCourse
);

router.post(
    "/delete",
    courseController.deleteCourse
);

router.get(
    "/getRandom",
    courseController.getRandomCourses,
);

router.get(
    "/getCourses",
    courseController.getCourses,
);

router.get(
    "/searchCourse",
    courseController.searchCourse,
);

router.get(
    "/getByTeacherId/:teacher_id",
    courseController.getCoursesByTeacherId,
);

router.post(
    "/addContent",
    validator.addContentValidationSchema,
    courseController.addContent
);

router.get(
    "/getContent/:course_id",
    courseController.getCourseContent,
);

router.post(
    "/enroll",
    validator.enrollmentValidationSchema,
    courseController.enroll
);
module.exports = router;
