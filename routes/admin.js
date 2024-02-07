const express = require('express');
const controller= require('../controller/admin');

const router = express.Router();

router.post('/delete-review/:id',controller.deletePost);
router.get('/review/:id',controller.editreviewPage);
router.post('/updateReview/:id',controller.updateReview);

exports.routes = router;