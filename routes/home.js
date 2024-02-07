const express = require('express');
const controller= require('../controller/home');

const router = express.Router();

router.get('/',controller.landingPage );
router.get('/review',controller.reviewPage);
router.post('/review',controller.Post);
router.get('/myReviews',controller.myreviewPage);
router.get('/allReviews',controller.allreviewPage);
router.get('/thanks',controller.thanksPage);

exports.routes = router;