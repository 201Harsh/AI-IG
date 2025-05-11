const router = require("express").Router();
const userController = require("../controllers/user.controller");
const { body } = require("express-validator");

router.post(
  "/register",
  [
    body("username").isString().isLength({ min: 3, max: 20 }),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  userController.RegisterUser
);

router.post(
  "/login",
  [
    body("username").isString().isLength({ min: 3, max: 20 }),
    body("password").isLength({ min: 6 }),
  ],
  userController.LoginUser
);

module.exports = router;
