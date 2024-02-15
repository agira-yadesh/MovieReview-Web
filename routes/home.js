const express = require('express');
const controller= require('../controller/home');
const auth = require('../middleware/is-auth');
const { check, body } = require("express-validator");
const router = express.Router();

router.get('/',controller.landingPage );
router.get('/review',controller.reviewPage);
router.post('/review', body('review').trim(),auth,controller.Post);
router.get('/myReviews',auth, controller.myreviewPage);
router.get('/allReviews',controller.allreviewPage);
router.get('/thanks',auth, controller.thanksPage);

exports.routes = router;