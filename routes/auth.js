const express = require('express');

const authController = require('../controller/auth');

const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', authController.getLoginPost);
router.get('/signup', authController.getSignup);
router.post('/signup', authController.getSignupPost);
router.post('/logout', authController.getLogoutPost);

module.exports = router;