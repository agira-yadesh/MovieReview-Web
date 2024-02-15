const express = require("express");
const { check, body } = require("express-validator");

const authController = require("../controller/auth");
const User = require("../models/users");

const router = express.Router();

router.get("/login", authController.getLogin);

router.post(
  "/login",
  body("mailid")
    .isEmail()
    .withMessage("Please enter a vaild email")
    .normalizeEmail(),
  body(
    "password",
    "Please enter a password with only numbers and text of at least 5 characters."
  )
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim(),
  authController.getLoginPost
);
router.get("/signup", authController.getSignup);

router.post(
  "/signup",
  [
    check("mailid")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ where: { email: value } }).then(
          (existingUser) => {
            if (existingUser) {
              return Promise.reject(
                "E-Mail exists already, please pick a different one."
              );
            }
          }
        );
      })
      .normalizeEmail(),

    body(
      "password",
      "Please enter a password with only numbers and text of at least 5 characters."
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password does not match");
        }
        return true;
      }),
  ],
  authController.getSignupPost
);

router.post("/logout", authController.getLogoutPost);
router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);
router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);

module.exports = router;
