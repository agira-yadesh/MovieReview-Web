const express = require('express');
const controller= require('../controller/admin');

const router = express.Router();

router.delete('/myReviews/:id',controller.deleteReview);
router.get('/totalReviews',controller.totalReviews);
router.get('/review/:id',controller.editreviewPage);
router.post('/updateReview/:id',controller.updateReview);

exports.routes = router;