const express = require("express");
const userController = require("../../controllers/userController");
const router = express.Router();
const validator = require("../../validators/validator");

router.post(
    "/create",
    validator.createUserValidationSchema,
    userController.createUser
);

router.get(
    "/login",
    validator.loginValidationSchema,
    userController.login
);

router.get(
    "/getUser/:userId",
    userController.getUserData
);

router.post(
    "/delete/:userId",
    userController.deleteUser
);

router.put(
    "/updatePassword",
    validator.updatePasswordValidationSchema,
    userController.updateAdminPassword
);
module.exports = router;
