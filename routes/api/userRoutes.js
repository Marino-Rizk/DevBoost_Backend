const express = require("express");
const userController = require("../../controllers/userController");
const router = express.Router();
const validator = require("../../validators/validator");

router.post(
    "/create",
    validator.createUserValidationSchema,
    userController.createUser
);

router.post(
    "/login",
    validator.loginValidationSchema,
    userController.login
);

router.post(
    "/loginAdmin",
    validator.loginValidationSchema,
    userController.loginAdmin
);

router.get(
    "/getUser/:userId",
    userController.getUserData
);

router.delete(
    "/delete/:userId",
    userController.deleteUser
);

router.put(
    "/updatePassword",
    validator.updatePasswordValidationSchema,
    userController.updateAdminPassword
);

router.get(
    "/students",
    userController.getAllStudents
);

module.exports = router;
