const express = require("express");
const teacherController = require("../../controllers/teacherController");
const router = express.Router();
const validator = require("../../validators/validator");


router.get(
    "/getRandom",
    teacherController.getRandomTeachers,
);

router.get(
    "/getByDomain",
    teacherController.getTeachersByDomain,
);

router.get(
    "/searchTeacher",
    teacherController.searchTeacher,
);

router.put(
    "/updateProfile/:user_id",
    teacherController.updateProfile,
);
module.exports = router;
